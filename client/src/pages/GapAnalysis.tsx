import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DomainComplianceChart from "@/components/DomainComplianceChart";
import GapAnalysisSummary from "@/components/GapAnalysisSummary";

const GapAnalysis = () => {
  const [selectedLevel, setSelectedLevel] = useState("level1");
  const assessmentId = selectedLevel === "level1" ? 1 : 2;

  const { data: assessment, isLoading: isLoadingAssessment } = useQuery({
    queryKey: [`/api/assessments/${assessmentId}`],
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: [`/api/assessments/${assessmentId}/calculate-completion`],
  });

  const isLoading = isLoadingAssessment || isLoadingStats;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Gap Analysis</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review compliance gaps across domains and identify areas needing improvement.
        </p>
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
              <h2 className="text-lg font-medium text-slate-900 mb-2">Level 1 Gap Analysis</h2>
              <p className="text-sm text-slate-600">
                Analyzing 17 controls across 6 domains for CMMC Level 1 compliance.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="level2">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-medium text-slate-900 mb-2">Level 2 Gap Analysis</h2>
              <p className="text-sm text-slate-600">
                Analyzing 110 controls across 14 domains for CMMC Level 2 compliance.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Compliance Summary Card */}
      <Card className="mb-8">
        <CardContent className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium text-slate-900">Overall Compliance</h3>
              {isLoading ? (
                <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                <div className="mt-1">
                  <span className="text-3xl font-bold text-primary">{stats?.complianceScore || 0}%</span>
                  <span className="ml-2 text-sm text-slate-600">
                    ({stats?.compliantControls || 0} of {stats?.applicableControls || 0} controls)
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 sm:mt-0 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-success bg-opacity-10 rounded-lg">
                <div className="text-success font-medium">{stats?.compliantControls || 0}</div>
                <div className="text-xs text-slate-600">Compliant</div>
              </div>
              <div className="p-3 bg-warning bg-opacity-10 rounded-lg">
                <div className="text-warning font-medium">{stats?.partialControls || 0}</div>
                <div className="text-xs text-slate-600">Partial</div>
              </div>
              <div className="p-3 bg-danger bg-opacity-10 rounded-lg">
                <div className="text-danger font-medium">{stats?.nonCompliantControls || 0}</div>
                <div className="text-xs text-slate-600">Non-Compliant</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance by Domain Chart */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="p-0">
            <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
              <h3 className="text-lg font-medium leading-6 text-slate-900">Compliance by Domain</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <DomainComplianceChart assessmentId={assessmentId} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
              <h3 className="text-lg font-medium leading-6 text-slate-900">Gap Analysis Details</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <GapAnalysisSummary assessmentId={assessmentId} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="mt-8">
        <CardContent className="p-0">
          <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
            <h3 className="text-lg font-medium leading-6 text-slate-900">Recommendations</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-5">
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">System & Communications Protection (SC)</h4>
                <p className="text-sm text-slate-700 mb-2">
                  This domain has the lowest compliance score. Consider prioritizing implementation of:
                </p>
                <ul className="list-disc pl-5 text-sm text-slate-700">
                  <li>Boundary protection controls (SC.3.043)</li>
                  <li>Architectural designs with security principles (SC.2.179)</li>
                  <li>Secure remote access methods (SC.1.176)</li>
                </ul>
              </div>

              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Media Protection (MP)</h4>
                <p className="text-sm text-slate-700 mb-2">
                  Consider strengthening media handling procedures, particularly:
                </p>
                <ul className="list-disc pl-5 text-sm text-slate-700">
                  <li>Media sanitization procedures (MP.2.119)</li>
                  <li>Media access restrictions (MP.2.120)</li>
                </ul>
              </div>

              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Access Control (AC)</h4>
                <p className="text-sm text-slate-700">
                  This domain is performing well. Maintain current controls and consider documenting procedures to ensure consistency.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default GapAnalysis;
