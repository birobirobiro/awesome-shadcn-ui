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
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Plus,
} from "lucide-react";
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

    const result = await submitPR(null, formData, { login: "" });

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
    <div className="space-y-3">
      <div className="text-center space-y-1 mb-2">
        <h3 className="text-lg font-semibold">Submit a New Resource</h3>
        <p className="text-sm text-muted-foreground">
          Add a new entry to the awesome shadcn/ui list
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
            disabled={isSubmitting}
          >
            <SelectTrigger className="mt-1.5 h-9 w-full">
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

        <div>
          <Label htmlFor="name">Resource Name</Label>
          <Input
            id="name"
            placeholder="e.g., shadcn-nextjs-dashboard"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="mt-1.5 h-9"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="e.g., Admin Dashboard UI built with Shadcn and NextJS"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="mt-1.5 h-9"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://github.com/username/project"
            value={formData.url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, url: e.target.value }))
            }
            className="mt-1.5 h-9"
            disabled={isSubmitting}
          />
        </div>

        {submissionError && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertCircle className="h-4 w-4" />
            {submissionError}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 h-9"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>{submissionStatus || "Submitting..."}</span>
            </div>
          ) : (
            <>
              Submit PR
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
      <div>
        <h3 className="text-lg font-semibold">PR Created Successfully!</h3>
        <p className="text-sm text-muted-foreground">
          Your pull request has been created automatically
        </p>
      </div>

      {submissionResult && (
        <div className="space-y-3">
          <Badge variant="secondary" className="text-sm">
            PR #{submissionResult.prNumber}
          </Badge>
          <div>
            <Button asChild variant="outline" className="w-full">
              <a
                href={submissionResult.prUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Pull Request
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>PR will be reviewed by maintainers</p>
          </div>
        </div>
      )}

      <Button onClick={handleClose} className="w-full">
        Close
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="w-full lg:w-auto text-base">
            <Plus className="mr-2 h-5 w-5" />
            Submit Resource
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === "form" && "Submit Resource"}
            {step === "success" && "Success!"}
          </DialogTitle>
          <DialogDescription>
            {step === "form" &&
              "Fill in your resource details. This will create a fork and PR automatically."}
            {step === "success" &&
              "Your PR has been created and will be reviewed by maintainers."}
          </DialogDescription>
        </DialogHeader>

        {step === "form" && renderFormStep()}
        {step === "success" && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
}
