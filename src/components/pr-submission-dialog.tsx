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
import { useGitHubAuth } from "@/hooks/use-github-auth";
import { SubmissionData, usePRSubmission } from "@/hooks/use-pr-submission";
import { PR_TEMPLATE } from "@/lib/config";
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  Github,
  Loader2,
  LogOut,
  Plus,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const CATEGORIES = PR_TEMPLATE.CATEGORIES;

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
  const [codeCopied, setCodeCopied] = useState(false);

  const {
    isSubmitting,
    error: submissionError,
    submissionStatus,
    submitPR,
  } = usePRSubmission();

  const {
    authState,
    isLoading: isAuthLoading,
    error: authError,
    startDeviceFlow,
    logout,
    stopPolling,
  } = useGitHubAuth();

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

    if (!authState.token) {
      toast.error("Please sign in with GitHub first");
      return;
    }

    const result = await submitPR(formData, authState.token);

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
    stopPolling();
    setOpen(false);
    setTimeout(() => {
      setStep("form");
      setFormData({ name: "", description: "", url: "", category: "" });
      setSubmissionResult(null);
    }, 300);
  }, [stopPolling]);

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

  const renderAuthStep = () => (
    <div className="space-y-4">
      {authState.isPolling && authState.userCode ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Enter this code on GitHub to continue:
          </p>
          <div className="flex items-center justify-center gap-2">
            <code className="rounded-md border bg-muted px-4 py-2 text-lg font-mono tracking-widest">
              {authState.userCode}
            </code>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              aria-label="Copy code"
              onClick={async () => {
                if (!authState.userCode) return;
                try {
                  await navigator.clipboard.writeText(authState.userCode);
                  setCodeCopied(true);
                  toast.success("Code copied to clipboard");
                  setTimeout(() => setCodeCopied(false), 2000);
                } catch {
                  toast.error("Failed to copy code");
                }
              }}
            >
              {codeCopied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button asChild variant="outline" className="w-full h-10">
            <a
              href={authState.verificationUri ?? "https://github.com/login/device"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open GitHub
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Waiting for authorization...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Sign in with GitHub to submit a resource. Your submission will be
            linked to your GitHub account.
          </p>
          <Button
            onClick={startDeviceFlow}
            disabled={isAuthLoading}
            className="w-full h-10"
          >
            {isAuthLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Github className="mr-2 h-4 w-4" />
            )}
            Sign in with GitHub
          </Button>
        </div>
      )}

      {authError && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}
    </div>
  );

  const renderFormStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2">
        <div className="flex items-center gap-2 text-sm">
          {authState.avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={authState.avatar}
              alt=""
              className="h-5 w-5 rounded-full"
            />
          )}
          <span className="text-muted-foreground">
            Signed in as <span className="text-foreground">@{authState.username}</span>
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          disabled={isSubmitting}
          className="h-7 px-2 text-muted-foreground"
        >
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>

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
              ? authState.isAuthenticated
                ? "Add a resource to the awesome shadcn/ui list."
                : "Sign in with GitHub to add a resource to the list."
              : "Your pull request is ready for review."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5">
          {step === "form" &&
            (authState.isAuthenticated ? renderFormStep() : renderAuthStep())}
          {step === "success" && renderSuccessStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
