import { useCallback, useState } from "react";

/**
 * Data required to submit a new resource to the awesome-shadcn-ui list.
 */
export interface SubmissionData {
  /** Name of the resource */
  name: string;
  /** Brief description of the resource */
  description: string;
  /** URL to the resource */
  url: string;
  /** Category the resource belongs to */
  category: string;
}

/**
 * Result of a pull request submission attempt.
 */
export interface PRSubmissionResult {
  /** Whether the submission was successful */
  success: boolean;
  /** PR number if successful */
  prNumber?: number;
  /** URL to the created PR if successful */
  prUrl?: string;
  /** Error message if unsuccessful */
  error?: string;
}

/**
 * Return type for the usePRSubmission hook.
 */
export interface UsePRSubmissionReturn {
  /** Whether a submission is currently in progress */
  isSubmitting: boolean;
  /** Error message if the last submission failed */
  error: string | null;
  /** Current status message during submission */
  submissionStatus: string | null;
  /** Submit a new resource as a PR */
  submitPR: (submission: SubmissionData) => Promise<PRSubmissionResult>;
  /** Validate submission data before submitting */
  validateSubmission: (
    submission: SubmissionData,
  ) => Promise<{ valid: boolean; error?: string }>;
}

/**
 * Manages pull request submissions for new resources.
 *
 * Handles the full submission flow including validation,
 * API communication, and status tracking.
 *
 * @returns Submission state and control functions
 *
 * @example
 * ```tsx
 * const { submitPR, isSubmitting, error } = usePRSubmission()
 *
 * const handleSubmit = async (data: SubmissionData) => {
 *   const result = await submitPR(data)
 *   if (result.success) {
 *     console.log('PR created:', result.prUrl)
 *   }
 * }
 * ```
 */
export function usePRSubmission(): UsePRSubmissionReturn {
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
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Validation failed";
        return { valid: false, error: message };
      }
    },
    [],
  );

  const submitPR = useCallback(
    async (submission: SubmissionData): Promise<PRSubmissionResult> => {
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
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to submit pull request";
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
