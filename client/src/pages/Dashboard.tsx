import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import DomainComplianceChart from "@/components/DomainComplianceChart";
import RecentActivity from "@/components/RecentActivity";
import GapAnalysisSummary from "@/components/GapAnalysisSummary";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data: assessments, isLoading: isLoadingAssessments } = useQuery({
    queryKey: ["/api/assessments"],
  });

  const { data: level1Stats, isLoading: isLoadingLevel1Stats } = useQuery({
    queryKey: ["/api/assessments/1/calculate-completion"],
    enabled: !!assessments?.length
  });

  const { data: level2Stats, isLoading: isLoadingLevel2Stats } = useQuery({
    queryKey: ["/api/assessments/2/calculate-completion"],
    enabled: !!assessments?.length
  });

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">CMMC Gap Assessment Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Monitor your compliance status and view gap analysis for CMMC Level 1 and Level 2.
        </p>
      </div>

      {/* Assessment Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Overall Compliance */}
        <Card>
          <CardContent className="p-0">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary bg-opacity-10 rounded-md p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">
                      Overall Compliance
                    </dt>
                    <dd>
                      {isLoadingLevel1Stats ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <div className="text-lg font-medium text-slate-900">
                          {level1Stats?.complianceScore || 0}%
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${level1Stats?.complianceScore || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: CMMC Level 1 */}
        <Card>
          <CardContent className="p-0">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-50 rounded-md p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">
                      CMMC Level 1
                    </dt>
                    <dd>
                      {isLoadingLevel1Stats ? (
                        <Skeleton className="h-8 w-32" />
                      ) : (
                        <div className="text-lg font-medium text-slate-900">
                          {level1Stats?.complianceScore || 0}% ({level1Stats?.compliantControls || 0}/{level1Stats?.applicableControls || 17} controls)
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-4 sm:px-6">
              <Link href="/assessment/level1" className="text-sm font-medium text-primary hover:text-primary/80">
                Continue Assessment <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: CMMC Level 2 */}
        <Card>
          <CardContent className="p-0">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-50 rounded-md p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">
                      CMMC Level 2
                    </dt>
                    <dd>
                      {isLoadingLevel2Stats ? (
                        <Skeleton className="h-8 w-32" />
                      ) : (
                        <div className="text-lg font-medium text-slate-900">
                          {level2Stats?.complianceScore || 0}% ({level2Stats?.compliantControls || 0}/{level2Stats?.applicableControls || 110} controls)
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-4 sm:px-6">
              <Link href="/assessment/level2" className="text-sm font-medium text-primary hover:text-primary/80">
                Continue Assessment <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance by Domain Chart */}
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
          <h3 className="text-lg font-medium leading-6 text-slate-900">Compliance by Domain</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <DomainComplianceChart />
        </div>
      </div>

      {/* Recent Activity and Gap Analysis */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardContent className="p-0">
            <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
              <h3 className="text-lg font-medium leading-6 text-slate-900">Recent Activity</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <RecentActivity assessmentId={1} />
            </div>
          </CardContent>
        </Card>

        {/* Gap Analysis Summary */}
        <Card>
          <CardContent className="p-0">
            <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
              <h3 className="text-lg font-medium leading-6 text-slate-900">Gap Analysis Summary</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <GapAnalysisSummary assessmentId={1} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
