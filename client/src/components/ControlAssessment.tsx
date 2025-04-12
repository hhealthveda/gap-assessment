import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Paperclip, Check, AlertTriangle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

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

type ControlAssessmentProps = {
  control: Control;
  response?: Response;
  scopingDecision?: ScopingDecision;
  onResponseUpdate: (controlId: string, status: string, notes?: string, evidence?: string) => void;
  onScopingUpdate: (controlId: string, applicable: boolean, reason?: string) => void;
  showScoping: boolean;
};

const ControlAssessment = ({
  control,
  response,
  scopingDecision,
  onResponseUpdate,
  onScopingUpdate,
  showScoping
}: ControlAssessmentProps) => {
  const [status, setStatus] = useState<string>(response?.status || "");
  const [notes, setNotes] = useState<string>(response?.notes || "");
  const [evidence, setEvidence] = useState<string>(response?.evidence || "");
  const [applicable, setApplicable] = useState<boolean>(scopingDecision?.applicable !== false);
  const [reason, setReason] = useState<string>(scopingDecision?.reason || "");
  const [evidenceVisible, setEvidenceVisible] = useState<boolean>(false);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onResponseUpdate(control.id, value, notes, evidence);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleEvidenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEvidence(e.target.value);
  };

  const handleNotesBlur = () => {
    if (status) {
      onResponseUpdate(control.id, status, notes, evidence);
    }
  };

  const handleEvidenceBlur = () => {
    if (status) {
      onResponseUpdate(control.id, status, notes, evidence);
    }
  };

  const handleApplicableChange = (checked: boolean) => {
    setApplicable(checked);
    onScopingUpdate(control.id, checked, reason);
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
  };

  const handleReasonBlur = () => {
    onScopingUpdate(control.id, applicable, reason);
  };

  const getStatusIcon = () => {
    if (!status) return null;
    
    switch (status) {
      case "yes":
        return (
          <div className="h-6 w-6 rounded-full bg-success bg-opacity-20 flex items-center justify-center">
            <Check className="h-4 w-4 text-success" />
          </div>
        );
      case "partial":
        return (
          <div className="h-6 w-6 rounded-full bg-warning bg-opacity-20 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-warning" />
          </div>
        );
      case "no":
        return (
          <div className="h-6 w-6 rounded-full bg-danger bg-opacity-20 flex items-center justify-center">
            <X className="h-4 w-4 text-danger" />
          </div>
        );
      default:
        return null;
    }
  };

  if (showScoping) {
    return (
      <div className="px-4 py-5 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-start">
          <div className="sm:flex-1">
            <h4 className="text-sm font-medium text-slate-900 flex items-center">
              {control.id}
              {!applicable && (
                <Badge variant="outline" className="ml-2 bg-slate-100">
                  Not Applicable
                </Badge>
              )}
            </h4>
            <p className="mt-1 text-sm text-slate-600">{control.description}</p>
            
            <div className="mt-4 flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id={`applicable-${control.id}`}
                  checked={applicable}
                  onCheckedChange={handleApplicableChange}
                />
                <Label htmlFor={`applicable-${control.id}`} className="cursor-pointer">
                  This control is applicable to my environment
                </Label>
              </div>
              
              {!applicable && (
                <div>
                  <Label htmlFor={`reason-${control.id}`} className="text-xs font-medium text-slate-700">
                    Justification for non-applicability:
                  </Label>
                  <Textarea
                    id={`reason-${control.id}`}
                    placeholder="Explain why this control does not apply to your environment..."
                    className="mt-1"
                    rows={3}
                    value={reason}
                    onChange={handleReasonChange}
                    onBlur={handleReasonBlur}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (scopingDecision && !scopingDecision.applicable) {
    return (
      <div className="px-4 py-5 sm:px-6 bg-slate-50">
        <div className="flex flex-col sm:flex-row sm:items-start">
          <div className="sm:flex-1">
            <h4 className="text-sm font-medium text-slate-900 flex items-center">
              {control.id}
              <Badge variant="outline" className="ml-2 bg-slate-100">
                Not Applicable
              </Badge>
            </h4>
            <p className="mt-1 text-sm text-slate-600">{control.description}</p>
            
            {scopingDecision.reason && (
              <div className="mt-2 p-2 bg-slate-100 rounded-md">
                <p className="text-xs font-medium text-slate-700">Justification:</p>
                <p className="text-sm text-slate-600">{scopingDecision.reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-start">
        <div className="sm:flex-1">
          <h4 className="text-sm font-medium text-slate-900">{control.id}</h4>
          <p className="mt-1 text-sm text-slate-600">{control.description}</p>
          
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-700">Compliance Status:</span>
            <RadioGroup 
              value={status} 
              onValueChange={handleStatusChange}
              className="mt-2 flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id={`yes-${control.id}`} />
                <Label htmlFor={`yes-${control.id}`}>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="partial" id={`partial-${control.id}`} />
                <Label htmlFor={`partial-${control.id}`}>Partial</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id={`no-${control.id}`} />
                <Label htmlFor={`no-${control.id}`}>No</Label>
              </div>
            </RadioGroup>
          </div>

          {status && (
            <div className="mt-4">
              <Label htmlFor={`notes-${control.id}`} className="text-xs font-medium text-slate-700">
                Assessment Notes:
              </Label>
              <Textarea
                id={`notes-${control.id}`}
                placeholder="Add notes about the implementation status..."
                className="mt-1"
                rows={3}
                value={notes}
                onChange={handleNotesChange}
                onBlur={handleNotesBlur}
              />
            </div>
          )}
        </div>
        
        {status && (
          <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                {getStatusIcon()}
                <span className="ml-2 text-sm text-slate-600">
                  {status === "yes" ? "Compliant" : status === "partial" ? "Partially Compliant" : "Non-Compliant"}
                </span>
              </div>
              
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEvidenceVisible(!evidenceVisible)}
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  {evidence ? "View Evidence" : "Add Evidence"}
                </Button>
              </div>
            </div>
            
            {evidenceVisible && (
              <Card className="mt-2">
                <CardContent className="p-3">
                  <Label htmlFor={`evidence-${control.id}`} className="text-xs font-medium text-slate-700">
                    Evidence:
                  </Label>
                  <Input
                    id={`evidence-${control.id}`}
                    placeholder="Provide a link to or description of evidence..."
                    className="mt-1"
                    value={evidence}
                    onChange={handleEvidenceChange}
                    onBlur={handleEvidenceBlur}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlAssessment;
