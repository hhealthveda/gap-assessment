import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ControlAssessment from "./ControlAssessment";
import { Badge } from "@/components/ui/badge";

type Control = {
  id: string;
  name: string;
  description: string;
  domain: string;
};

type Response = {
  id: number;
  assessmentId: number;
  controlId: string;
  status: string;
  evidence?: string;
  notes?: string;
};

type ScopingDecision = {
  id: number;
  assessmentId: number;
  controlId: string;
  applicable: boolean;
  reason?: string;
};

type DomainAccordionProps = {
  domain: string;
  controls: Control[];
  responses?: Response[];
  scopingDecisions?: ScopingDecision[];
  onResponseUpdate: (controlId: string, status: string, notes?: string, evidence?: string) => void;
  onScopingUpdate: (controlId: string, applicable: boolean, reason?: string) => void;
  showScoping: boolean;
};

const DomainAccordion = ({
  domain,
  controls,
  responses = [],
  scopingDecisions = [],
  onResponseUpdate,
  onScopingUpdate,
  showScoping
}: DomainAccordionProps) => {
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  const getDomainDisplayName = (domain: string) => {
    const domainMap: Record<string, string> = {
      "AC": "Access Control",
      "AU": "Audit and Accountability",
      "AT": "Awareness and Training",
      "CM": "Configuration Management",
      "IA": "Identification and Authentication",
      "IR": "Incident Response",
      "MA": "Maintenance",
      "MP": "Media Protection",
      "PS": "Personnel Security",
      "PE": "Physical Protection",
      "RA": "Risk Assessment",
      "CA": "Security Assessment",
      "SC": "System and Communications Protection",
      "SI": "System and Information Integrity"
    };
    
    return domainMap[domain] || domain;
  };

  const domainDisplayName = getDomainDisplayName(domain);

  const getComplianceCount = () => {
    let compliant = 0;
    let partial = 0;
    let nonCompliant = 0;
    let notAssessed = 0;

    controls.forEach(control => {
      const response = responses.find(r => r.controlId === control.id);
      const scopingDecision = scopingDecisions.find(d => d.controlId === control.id);
      
      if (scopingDecision && !scopingDecision.applicable) {
        // Skip non-applicable controls
        return;
      }
      
      if (!response) {
        notAssessed++;
      } else if (response.status === "yes") {
        compliant++;
      } else if (response.status === "partial") {
        partial++;
      } else if (response.status === "no") {
        nonCompliant++;
      }
    });

    return { compliant, partial, nonCompliant, notAssessed };
  };

  const { compliant, partial, nonCompliant, notAssessed } = getComplianceCount();
  const totalApplicable = compliant + partial + nonCompliant + notAssessed;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={domain}>
        <AccordionTrigger className="px-4 py-5 sm:px-6 border-b border-slate-200 hover:bg-slate-50">
          <div className="flex flex-1 justify-between items-center">
            <div className="flex flex-col sm:flex-row sm:items-center text-left">
              <h3 className="text-lg font-medium leading-6 text-slate-900 mr-4">{domainDisplayName} ({domain})</h3>
              <div className="mt-1 sm:mt-0">
                {!showScoping && (
                  <div className="flex space-x-2">
                    {compliant > 0 && (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        {compliant} Compliant
                      </Badge>
                    )}
                    {partial > 0 && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        {partial} Partial
                      </Badge>
                    )}
                    {nonCompliant > 0 && (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                        {nonCompliant} Non-Compliant
                      </Badge>
                    )}
                    {notAssessed > 0 && (
                      <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">
                        {notAssessed} Not Assessed
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
            <Badge variant="secondary" className="ml-2">
              {controls.length} controls
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="divide-y divide-slate-200">
            {controls.map((control) => {
              const response = responses.find(r => r.controlId === control.id);
              const scopingDecision = scopingDecisions.find(d => d.controlId === control.id);
              
              return (
                <ControlAssessment
                  key={control.id}
                  control={control}
                  response={response}
                  scopingDecision={scopingDecision}
                  onResponseUpdate={onResponseUpdate}
                  onScopingUpdate={onScopingUpdate}
                  showScoping={showScoping}
                />
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DomainAccordion;
