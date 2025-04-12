import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [organizationName, setOrganizationName] = useState("");

  const { data: assessment, isLoading } = useQuery({
    queryKey: ["/api/assessments/1"],
    onSuccess: (data) => {
      if (data?.organizationName) {
        setOrganizationName(data.organizationName);
      }
    }
  });

  const updateAssessmentMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PATCH", `/api/assessments/1`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/assessments/1"] });
      toast({
        title: "Settings updated",
        description: "Your assessment settings have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSaveSettings = () => {
    updateAssessmentMutation.mutate({
      organizationName
    });
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-2 text-sm text-slate-600">
          Configure your assessment settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="mb-8">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="export">Export Options</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-6">
                <h3 className="text-base font-medium text-slate-900 mb-4">Organization Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="organization-name">Organization Name</Label>
                    <Input 
                      id="organization-name" 
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="Enter your organization name"
                      className="max-w-md mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-base font-medium text-slate-900 mb-4">Assessment Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between max-w-md">
                    <Label htmlFor="auto-save" className="cursor-pointer">Auto-save assessment responses</Label>
                    <Switch id="auto-save" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between max-w-md">
                    <Label htmlFor="evidence-required" className="cursor-pointer">Require evidence for all controls</Label>
                    <Switch id="evidence-required" />
                  </div>
                  <div className="flex items-center justify-between max-w-md">
                    <Label htmlFor="highlight-gaps" className="cursor-pointer">Highlight compliance gaps</Label>
                    <Switch id="highlight-gaps" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={updateAssessmentMutation.isPending}>
                  {updateAssessmentMutation.isPending ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-6">
                <h3 className="text-base font-medium text-slate-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between max-w-md">
                    <Label htmlFor="email-notifications" className="cursor-pointer">Email notifications</Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between max-w-md">
                    <Label htmlFor="progress-updates" className="cursor-pointer">Weekly progress updates</Label>
                    <Switch id="progress-updates" />
                  </div>
                  <div className="flex items-center justify-between max-w-md">
                    <Label htmlFor="assessment-reminders" className="cursor-pointer">Assessment reminders</Label>
                    <Switch id="assessment-reminders" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-6">
                <h3 className="text-base font-medium text-slate-900 mb-4">Export Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between max-w-md">
                    <Label htmlFor="include-evidence" className="cursor-pointer">Include evidence in exports</Label>
                    <Switch id="include-evidence" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between max-w-md">
                    <Label htmlFor="include-comments" className="cursor-pointer">Include comments in exports</Label>
                    <Switch id="include-comments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between max-w-md">
                    <Label htmlFor="include-recommendations" className="cursor-pointer">Include recommendations</Label>
                    <Switch id="include-recommendations" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Export Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-base font-medium text-slate-900 mb-2">Data Management</h3>
            <p className="text-sm text-slate-600 mb-4">
              Manage your assessment data and exports.
            </p>
            <div className="space-y-4">
              <Button variant="outline">Export All Data</Button>
              <Button variant="outline" className="ml-4">Reset Assessment Data</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Settings;
