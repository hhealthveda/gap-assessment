import type { Assessment, ControlResponse, ScopingDecision } from "@shared/schema";
import { DOD_SCORE_VALUES } from "../client/src/lib/sprsCalculator";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { Readable } from "stream";

export function generateCsvReport(
  assessment: Assessment,
  responses: ControlResponse[],
  scopingDecisions: ScopingDecision[],
  sprsScore: any
): string {
  const lines = [];
  
  // Header
  lines.push([
    "Control ID",
    "Status",
    "In Scope",
    "Implementation Notes",
    "Last Updated"
  ].join(","));
  
  // Create a map of scoping decisions
  const scopingMap = new Map(
    scopingDecisions.map(d => [d.controlId, d])
  );
  
  // Add each control's data
  for (const response of responses) {
    const scoping = scopingMap.get(response.controlId);
    lines.push([
      response.controlId,
      response.status,
      scoping ? (scoping.applicable ? "Yes" : "No") : "Yes",
      `"${(response.notes || "").replace(/"/g, '""')}"`,
      response.updatedAt
    ].join(","));
  }
  
  // Add summary section
  lines.push("");
  lines.push(`"Assessment Name","${assessment.name}"`);
  lines.push(`"Organization","${assessment.organizationName}"`);
  lines.push(`"Completion","${assessment.completedPercentage}%"`);
  
  if (sprsScore) {
    lines.push("");
    lines.push("SPRS Score Summary");
    lines.push(`"SPRS Score","${sprsScore.sprsScore}"`);
    lines.push(`"Implementation Factor","${sprsScore.implementationFactor}"`);
    lines.push(`"Implementation Level","${sprsScore.implementationLevel}"`);
  }
  
  return lines.join("\n");
}

export function generateExcelReport(
  assessment: Assessment,
  responses: ControlResponse[],
  scopingDecisions: ScopingDecision[],
  sprsScore: any
): Buffer {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Assessment Results");
  
  // Add headers
  worksheet.columns = [
    { header: "Control ID", key: "controlId", width: 15 },
    { header: "Status", key: "status", width: 15 },
    { header: "In Scope", key: "inScope", width: 10 },
    { header: "DOD Value", key: "dodValue", width: 10 },
    { header: "Implementation Notes", key: "notes", width: 50 },
    { header: "Last Updated", key: "updatedAt", width: 20 }
  ];
  
  // Style headers
  worksheet.getRow(1).font = { bold: true };
  
  // Create a map of scoping decisions
  const scopingMap = new Map(
    scopingDecisions.map(d => [d.controlId, d])
  );
  
  // Add data rows
  responses.forEach(response => {
    const scoping = scopingMap.get(response.controlId);
    worksheet.addRow({
      controlId: response.controlId,
      status: response.status,
      inScope: scoping ? (scoping.applicable ? "Yes" : "No") : "Yes",
      dodValue: DOD_SCORE_VALUES[response.controlId] || 1,
      notes: response.notes || "",
      updatedAt: response.updatedAt
    });
  });
  
  // Add summary section
  const summarySheet = workbook.addWorksheet("Summary");
  
  summarySheet.columns = [
    { header: "Metric", key: "metric", width: 30 },
    { header: "Value", key: "value", width: 20 }
  ];
  
  summarySheet.getRow(1).font = { bold: true };
  
  // Add assessment info
  summarySheet.addRow({ metric: "Assessment Name", value: assessment.name });
  summarySheet.addRow({ metric: "Organization", value: assessment.organizationName });
  summarySheet.addRow({ metric: "Completion", value: `${assessment.completedPercentage}%` });
  
  // Add SPRS data if available
  if (sprsScore) {
    summarySheet.addRow({ metric: "SPRS Score", value: sprsScore.sprsScore });
    summarySheet.addRow({ metric: "Implementation Factor", value: sprsScore.implementationFactor });
    summarySheet.addRow({ metric: "Implementation Level", value: sprsScore.implementationLevel });
  }
  
  return workbook.xlsx.writeBuffer() as unknown as Buffer;
}

export async function generatePdfReport(
  assessment: Assessment,
  responses: ControlResponse[],
  scopingDecisions: ScopingDecision[],
  sprsScore: any
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument();
    
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Title
    doc.fontSize(20).text(assessment.name, { align: 'center' });
    doc.moveDown();
    
    // Organization and Date
    doc.fontSize(12)
      .text(`Organization: ${assessment.organizationName}`)
      .text(`Generated: ${new Date().toLocaleString()}`)
      .text(`Completion: ${assessment.completedPercentage}%`)
      .moveDown();
    
    // SPRS Score section if available
    if (sprsScore) {
      doc.fontSize(16).text('SPRS Score Summary', { underline: true });
      doc.fontSize(12)
        .text(`SPRS Score: ${sprsScore.sprsScore}`)
        .text(`Implementation Factor: ${sprsScore.implementationFactor}`)
        .text(`Implementation Level: ${sprsScore.implementationLevel}`)
        .moveDown();
    }
    
    // Controls Table
    doc.fontSize(16).text('Control Assessment Details', { underline: true });
    doc.moveDown();
    
    // Create a map of scoping decisions
    const scopingMap = new Map(
      scopingDecisions.map(d => [d.controlId, d])
    );
    
    // Table headers
    const tableTop = doc.y;
    const colWidths = {
      controlId: 80,
      status: 70,
      inScope: 60,
      dodValue: 60,
      notes: 240
    };
    
    doc.fontSize(10)
      .text('Control ID', doc.x, tableTop, { width: colWidths.controlId })
      .text('Status', doc.x + colWidths.controlId, tableTop, { width: colWidths.status })
      .text('In Scope', doc.x + colWidths.controlId + colWidths.status, tableTop, { width: colWidths.inScope })
      .text('DoD Value', doc.x + colWidths.controlId + colWidths.status + colWidths.inScope, tableTop, { width: colWidths.dodValue })
      .text('Notes', doc.x + colWidths.controlId + colWidths.status + colWidths.inScope + colWidths.dodValue, tableTop, { width: colWidths.notes });
    
    doc.moveDown();
    
    // Table rows
    responses.forEach(response => {
      const scoping = scopingMap.get(response.controlId);
      const y = doc.y;
      
      // Check if we need a new page
      if (y > doc.page.height - 100) {
        doc.addPage();
        doc.y = 50;
      }
      
      doc.fontSize(9)
        .text(response.controlId, doc.x, doc.y, { width: colWidths.controlId })
        .text(response.status, doc.x + colWidths.controlId, doc.y, { width: colWidths.status })
        .text(scoping ? (scoping.applicable ? "Yes" : "No") : "Yes", 
              doc.x + colWidths.controlId + colWidths.status, doc.y, 
              { width: colWidths.inScope })
        .text(String(DOD_SCORE_VALUES[response.controlId] || 1),
              doc.x + colWidths.controlId + colWidths.status + colWidths.inScope, doc.y,
              { width: colWidths.dodValue })
        .text(response.notes || "",
              doc.x + colWidths.controlId + colWidths.status + colWidths.inScope + colWidths.dodValue, doc.y,
              { width: colWidths.notes });
      
      doc.moveDown();
    });
    
    doc.end();
  });
}