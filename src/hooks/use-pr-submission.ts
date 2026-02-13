import { useCallback, useState } from "react";

export interface SubmissionData {
  name: string;
  description: string;
  url: string;
  category: string;
}

export interface PRSubmissionResult {
  success: boolean;
  prNumber?: number;
  prUrl?: string;
  error?: string;
}

export function usePRSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const validateSubmission = useCallback(
    async (
      submission: SubmissionData,
    ): Promise<{ valid: boolean; error?: string }> => {
      try {
        const response = await fetch("/api/submit-resource", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });

        const data = await response.json();

        if (!response.ok) {
          return { valid: false, error: data.error };
        }

        return { valid: true };
      } catch (err: any) {
        return { valid: false, error: err.message };
      }
    },
    [],
  );

  const submitPR = useCallback(
    async (
      _octokit: unknown,
      submission: SubmissionData,
      _userInfo: { login: string; name?: string },
    ): Promise<PRSubmissionResult> => {
      setIsSubmitting(true);
      setError(null);
      setSubmissionStatus("Submitting your resource...");

      try {
        const response = await fetch("/api/submit-resource", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to submit");
        }

        return {
          success: true,
          prNumber: data.prNumber,
          prUrl: data.prUrl,
        };
      } catch (err: any) {
        const errorMessage = err.message || "Failed to submit pull request";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsSubmitting(false);
        setSubmissionStatus(null);
      }
    },
    [],
  );

  return {
    isSubmitting,
    error,
    submissionStatus,
    submitPR,
    validateSubmission,
  };
}
