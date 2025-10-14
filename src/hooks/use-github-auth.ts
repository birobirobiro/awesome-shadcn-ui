import { Octokit } from "@octokit/rest";
import { useCallback, useRef, useState } from "react";

export interface GitHubAuthState {
  isAuthenticated: boolean;
  username: string | null;
  avatar: string | null;
  token: string | null;
  deviceCode: string | null;
  userCode: string | null;
  verificationUri: string | null;
  isPolling: boolean;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  email: string;
}

export interface DeviceFlowResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

export function useGitHubAuth() {
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

  const startDeviceFlow = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call our API endpoint instead of GitHub directly
      const response = await fetch("/api/github/device-flow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      // Start polling for token
      pollForToken(data.device_code, data.interval);

      return {
        success: true,
        userCode: data.user_code,
        verificationUri: data.verification_uri,
      };
    } catch (err: any) {
      console.error("Device flow error:", err);
      setError(err.message || "Failed to start authentication");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pollForToken = useCallback(
    async (deviceCode: string, interval: number) => {
      const poll = async () => {
        try {
          // Call our API endpoint instead of GitHub directly
          const response = await fetch("/api/github/device-flow", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "poll",
              device_code: deviceCode,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Polling failed");
          }

          const data = await response.json();

          if (data.access_token) {
            // We got the token! Now get user info
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

            return { success: true, user };
          } else if (data.error === "authorization_pending") {
            // Still waiting for user to authorize
            pollingTimeoutRef.current = setTimeout(poll, interval * 1000);
          } else if (data.error === "slow_down") {
            // Increase polling interval
            pollingTimeoutRef.current = setTimeout(poll, (interval + 5) * 1000);
          } else if (data.error === "access_denied") {
            // User denied the authorization
            throw new Error("Authorization was denied by the user");
          } else if (data.error === "expired_token") {
            // The device code expired
            throw new Error("Authorization code expired. Please try again.");
          } else {
            // Some other error occurred
            throw new Error(
              data.error_description || data.error || "Authentication failed",
            );
          }
        } catch (err: any) {
          console.error("Polling error:", err);
          setError(err.message || "Authentication failed");
          setAuthState((prev) => ({
            ...prev,
            isPolling: false,
            deviceCode: null,
            userCode: null,
            verificationUri: null,
          }));
        }
      };

      // Start polling
      pollingTimeoutRef.current = setTimeout(poll, interval * 1000);
    },
    [],
  );

  const stopPolling = useCallback(() => {
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
      pollingTimeoutRef.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    // Stop any ongoing polling
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

    return new Octokit({
      auth: authState.token,
    });
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
