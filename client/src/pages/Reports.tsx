import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const { toast } = useToast();
  const [selectedLevel, setSelectedLevel] = useState("level1");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const assessmentId = selectedLevel === "level1" ? 1 : 2;

  const { data: assessment, isLoading: isLoadingAssessment } = useQuery({
    queryKey: [`/api/assessments/${assessmentId}`],
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: [`/api/assessments/${assessmentId}/calculate-completion`],
  });

  const isLoading = isLoadingAssessment || isLoadingStats;
  
  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: `Your ${selectedLevel === "level1" ? "Level 1" : "Level 2"} report is being generated as a ${selectedFormat.toUpperCase()} file.`,
    });
    
    // In a production app, this would make an API call to generate the report
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your ${selectedLevel === "level1" ? "Level 1" : "Level 2"} report has been downloaded.`,
      });
    }, 2000);
  };

  // Mock data for domain compliance
  const domainComplianceData = [
    { name: "Access Control", compliance: 85, color: "#22c55e" },
    { name: "Identification & Authentication", compliance: 92, color: "#22c55e" },
    { name: "Media Protection", compliance: 58, color: "#f59e0b" },
    { name: "Physical Protection", compliance: 76, color: "#22c55e" },
    { name: "System & Comm Protection", compliance: 32, color: "#ef4444" },
    { name: "System & Info Integrity", compliance: 65, color: "#f59e0b" },
  ];

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Assessment Reports</h1>
          <p className="mt-2 text-sm text-slate-600">
            Generate and export assessment reports to document your CMMC compliance status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <Select
            value={selectedFormat}
            onValueChange={setSelectedFormat}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Report</SelectItem>
              <SelectItem value="csv">CSV Export</SelectItem>
              <SelectItem value="excel">Excel Export</SelectItem>
            </SelectContent>
          </Select>
          <Button className="whitespace-nowrap" onClick={handleExportReport}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export Report
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="level1"
        value={selectedLevel}
        onValueChange={setSelectedLevel}
        className="mb-8"
      >
        <TabsList>
          <TabsTrigger value="level1">CMMC Level 1</TabsTrigger>
          <TabsTrigger value="level2">CMMC Level 2</TabsTrigger>
        </TabsList>
        <TabsContent value="level1">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-medium text-slate-900 mb-2">Level 1 Report</h2>
              <p className="text-sm text-slate-600">
                Report showing compliance status for 17 CMMC Level 1 controls.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="level2">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-medium text-slate-900 mb-2">Level 2 Report</h2>
              <p className="text-sm text-slate-600">
                Report showing compliance status for 110 CMMC Level 2 controls.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Preview */}
      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
            <h3 className="text-lg font-medium leading-6 text-slate-900">Report Preview</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h4 className="text-base font-medium text-slate-900 mb-2">Executive Summary</h4>
              {isLoading ? (
                <Skeleton className="h-24 w-full" />
              ) : (
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-700 mb-2">
                    This report presents the results of a CMMC {selectedLevel === "level1" ? "Level 1" : "Level 2"} gap assessment 
                    conducted for {assessment?.organizationName || "your organization"}.
                  </p>
                  <p className="text-sm text-slate-700 mb-2">
                    Overall compliance: <span className="font-medium">{stats?.complianceScore || 0}%</span>
                  </p>
                  <p className="text-sm text-slate-700">
                    Assessment completion: <span className="font-medium">{assessment?.completedPercentage || 0}%</span>
                  </p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h4 className="text-base font-medium text-slate-900 mb-2">Compliance by Domain</h4>
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={domainComplianceData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, "Compliance"]}
                      labelStyle={{ fontWeight: "bold" }}
                    />
                    <Bar dataKey="compliance" radius={[4, 4, 0, 0]}>
                      {domainComplianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-base font-medium text-slate-900 mb-2">Compliance Summary</h4>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex flex-col space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-white rounded border border-slate-200">
                      <div className="text-xs text-slate-500">Total Controls</div>
                      <div className="text-lg font-medium text-slate-900">{stats?.totalControls || 0}</div>
                    </div>
                    <div className="p-3 bg-white rounded border border-slate-200">
                      <div className="text-xs text-slate-500">Applicable</div>
                      <div className="text-lg font-medium text-slate-900">{stats?.applicableControls || 0}</div>
                    </div>
                    <div className="p-3 bg-white rounded border border-slate-200">
                      <div className="text-xs text-slate-500">Compliant</div>
                      <div className="text-lg font-medium text-success">{stats?.compliantControls || 0}</div>
                    </div>
                    <div className="p-3 bg-white rounded border border-slate-200">
                      <div className="text-xs text-slate-500">Non-Compliant</div>
                      <div className="text-lg font-medium text-danger">{stats?.nonCompliantControls || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleExportReport}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Generate Full Report
        </Button>
      </div>
    </>
  );
};

export default Reports;
