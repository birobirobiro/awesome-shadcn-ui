"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmissionData, usePRSubmission } from "@/hooks/use-pr-submission";
import { AlertCircle, Check, ExternalLink, Loader2, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  "Libs and Components",
  "Registries",
  "Plugins and Extensions",
  "Colors and Customizations",
  "Animations",
  "Tools",
  "Websites and Portfolios Inspirations",
  "Platforms",
  "Ports",
  "Design System",
  "Boilerplates / Templates",
];

interface PRSubmissionDialogProps {
  trigger?: React.ReactNode;
}

export function PRSubmissionDialog({ trigger }: PRSubmissionDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState<SubmissionData>({
    name: "",
    description: "",
    url: "",
    category: "",
  });
  const [submissionResult, setSubmissionResult] = useState<{
    prNumber?: number;
    prUrl?: string;
  } | null>(null);

  const {
    isSubmitting,
    error: submissionError,
    submissionStatus,
    submitPR,
  } = usePRSubmission();

  const handleSubmit = useCallback(async () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.url ||
      !formData.category
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await submitPR(formData);

    if (result.success) {
      setSubmissionResult({
        prNumber: result.prNumber,
        prUrl: result.prUrl,
      });
      setStep("success");
      toast.success("Pull request submitted successfully!");
    } else {
      toast.error(result.error || "Failed to submit pull request");
    }
  }, [formData, submitPR]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      setStep("form");
      setFormData({ name: "", description: "", url: "", category: "" });
      setSubmissionResult(null);
    }, 300);
  }, []);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        handleClose();
      } else {
        setOpen(true);
      }
    },
    [handleClose],
  );

  const renderFormStep = () => (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="category" className="text-sm text-muted-foreground">
            Category
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
            disabled={isSubmitting}
          >
            <SelectTrigger className="h-10 w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm text-muted-foreground">
            Name
          </Label>
          <Input
            id="name"
            placeholder="shadcn-dashboard"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="h-10"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="description"
            className="text-sm text-muted-foreground"
          >
            Description
          </Label>
          <Input
            id="description"
            placeholder="Admin dashboard built with shadcn/ui"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="h-10"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="url" className="text-sm text-muted-foreground">
            URL
          </Label>
          <Input
            id="url"
            type="url"
            placeholder="https://github.com/user/repo"
            value={formData.url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, url: e.target.value }))
            }
            className="h-10"
            disabled={isSubmitting}
          />
        </div>

        {submissionError && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{submissionError}</span>
          </div>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full h-10"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {submissionStatus || "Submitting..."}
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Check className="h-5 w-5 text-emerald-500" />
        </div>
        <div className="space-y-1">
          <p className="font-medium">Pull request created</p>
          {submissionResult && (
            <Badge variant="secondary" className="font-normal">
              #{submissionResult.prNumber}
            </Badge>
          )}
        </div>
      </div>

      {submissionResult && (
        <div className="space-y-3">
          <Button asChild variant="outline" className="w-full h-10">
            <a
              href={submissionResult.prUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button onClick={handleClose} className="w-full h-10">
            Done
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="w-full lg:w-auto cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Submit Resource
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-base font-medium">
            {step === "form" ? "Submit Resource" : "Success"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {step === "form"
              ? "Add a resource to the awesome shadcn/ui list."
              : "Your pull request is ready for review."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5">
          {step === "form" && renderFormStep()}
          {step === "success" && renderSuccessStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
