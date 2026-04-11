import { Octokit } from "@octokit/rest";
import { useCallback, useRef, useState } from "react";

/**
 * Authentication state for GitHub OAuth device flow.
 */
export interface GitHubAuthState {
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** GitHub username of authenticated user */
  username: string | null;
  /** Avatar URL of authenticated user */
  avatar: string | null;
  /** OAuth access token (stored in memory only) */
  token: string | null;
  /** Device code during authentication flow */
  deviceCode: string | null;
  /** User code to display during authentication */
  userCode: string | null;
  /** GitHub verification URL for device flow */
  verificationUri: string | null;
  /** Whether currently polling for authentication completion */
  isPolling: boolean;
}

/**
 * GitHub user profile data.
 */
export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  email: string;
}

/**
 * Response from GitHub device flow initiation.
 */
export interface DeviceFlowResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

/**
 * Return type for the useGitHubAuth hook.
 */
export interface UseGitHubAuthReturn {
  /** Current authentication state */
  authState: GitHubAuthState;
  /** Whether an auth operation is in progress */
  isLoading: boolean;
  /** Error message if any operation failed */
  error: string | null;
  /** Initiates the GitHub device flow authentication */
  startDeviceFlow: () => Promise<{
    success: boolean;
    userCode?: string;
    verificationUri?: string;
  }>;
  /** Logs out the current user */
  logout: () => void;
  /** Stops polling for device flow completion */
  stopPolling: () => void;
  /** Creates an authenticated Octokit instance */
  createAuthenticatedOctokit: () => Octokit | null;
}

/**
 * Manages GitHub OAuth authentication using the device flow.
 *
 * The device flow allows users to authenticate by:
 * 1. Displaying a user code
 * 2. Having them visit github.com/login/device
 * 3. Entering the code to authorize
 * 4. Polling until authorization completes
 *
 * @returns Authentication state and control functions
 *
 * @example
 * ```tsx
 * const { authState, startDeviceFlow, logout } = useGitHubAuth()
 *
 * if (!authState.isAuthenticated) {
 *   return (
 *     <button onClick={startDeviceFlow}>
 *       Sign in with GitHub
 *     </button>
 *   )
 * }
 *
 * return <p>Welcome, {authState.username}!</p>
 * ```
 */
export function useGitHubAuth(): UseGitHubAuthReturn {
  const [authState, setAuthState] = useState<GitHubAuthState>({
    isAuthenticated: false,
    username: null,
    avatar: null,
    token: null,
    deviceCode: null,
    userCode: null,
    verificationUri: null,
    isPolling: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
  }, []);

  const pollForToken = useCallback((deviceCode: string, interval: number) => {
    const poll = async () => {
      try {
        const response = await fetch("/api/github/device-flow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "poll", device_code: deviceCode }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Polling failed");
        }

        const data = await response.json();

        if (data.access_token) {
          const octokit = new Octokit({ auth: data.access_token });
          const { data: user } = await octokit.rest.users.getAuthenticated();

          setAuthState((prev) => ({
            ...prev,
            isAuthenticated: true,
            username: user.login,
            avatar: user.avatar_url,
            token: data.access_token,
            isPolling: false,
            deviceCode: null,
            userCode: null,
            verificationUri: null,
          }));
        } else if (data.error === "authorization_pending") {
          pollingTimeoutRef.current = setTimeout(poll, interval * 1000);
        } else if (data.error === "slow_down") {
          pollingTimeoutRef.current = setTimeout(poll, (interval + 5) * 1000);
        } else if (data.error === "access_denied") {
          throw new Error("Authorization was denied by the user");
        } else if (data.error === "expired_token") {
          throw new Error("Authorization code expired. Please try again.");
        } else {
          throw new Error(
            data.error_description || data.error || "Authentication failed",
          );
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Authentication failed";
        setError(message);
        setAuthState((prev) => ({
          ...prev,
          isPolling: false,
          deviceCode: null,
          userCode: null,
          verificationUri: null,
        }));
      }
    };

    pollingTimeoutRef.current = setTimeout(poll, interval * 1000);
  }, []);

  const startDeviceFlow = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/github/device-flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start device flow");
      }

      const data: DeviceFlowResponse = await response.json();

      setAuthState((prev) => ({
        ...prev,
        deviceCode: data.device_code,
        userCode: data.user_code,
        verificationUri: data.verification_uri,
        isPolling: true,
      }));

      pollForToken(data.device_code, data.interval);

      return {
        success: true,
        userCode: data.user_code,
        verificationUri: data.verification_uri,
      };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to start authentication";
      setError(message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [pollForToken]);

  const logout = useCallback(() => {
    stopPolling();

    setAuthState({
      isAuthenticated: false,
      username: null,
      avatar: null,
      token: null,
      deviceCode: null,
      userCode: null,
      verificationUri: null,
      isPolling: false,
    });
    setError(null);
  }, [stopPolling]);

  const createAuthenticatedOctokit = useCallback(() => {
    if (!authState.token) return null;
    return new Octokit({ auth: authState.token });
  }, [authState.token]);

  return {
    authState,
    isLoading,
    error,
    startDeviceFlow,
    logout,
    stopPolling,
    createAuthenticatedOctokit,
  };
}
