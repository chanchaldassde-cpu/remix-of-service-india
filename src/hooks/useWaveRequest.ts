import { useState, useCallback, useRef } from "react";
import { WaveStatus } from "@/components/booking/WaveRequestCard";

// Base provider interface that works with both type definitions
export interface BaseProvider {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  experience: string;
  verified: boolean;
  location: string;
  latitude: number;
  longitude: number;
  completedJobs: number;
  distance?: number;
}

// Provider with wave status
export interface ProviderWithStatus extends BaseProvider {
  waveStatus: WaveStatus;
  [key: string]: unknown; // Allow additional properties
}

// Wave request state
export type WaveRequestState = "idle" | "sending" | "waiting" | "accepted" | "timeout" | "cancelled";

interface UseWaveRequestOptions<T extends BaseProvider> {
  providers: T[];
  onProviderAccepted: (provider: T) => void;
  onTimeout: () => void;
  // Simulated response times (in ms) - for demo purposes
  minResponseTime?: number;
  maxResponseTime?: number;
  acceptChance?: number; // 0-1 probability of acceptance
}

/**
 * useWaveRequest - Hook to manage wave request flow
 * Simulates real-time provider responses for frontend demo
 * In production, this would connect to WebSocket/Supabase Realtime
 */
export function useWaveRequest<T extends BaseProvider>({
  providers,
  onProviderAccepted,
  onTimeout,
  minResponseTime = 2000,
  maxResponseTime = 8000,
  acceptChance = 0.4,
}: UseWaveRequestOptions<T>) {
  const [state, setState] = useState<WaveRequestState>("idle");
  const [providerStatuses, setProviderStatuses] = useState<Map<string, WaveStatus>>(
    new Map(providers.map((p) => [p.id, "idle"]))
  );
  const [acceptedProvider, setAcceptedProvider] = useState<T | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const acceptedRef = useRef(false);

  // Get providers with their current status
  const providersWithStatus = providers.map((p) => ({
    ...p,
    waveStatus: providerStatuses.get(p.id) || "idle" as WaveStatus,
  }));

  // Clear all pending timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  // Simulate sending wave request to all providers
  const sendWaveRequest = useCallback(() => {
    acceptedRef.current = false;
    setAcceptedProvider(null);
    setState("sending");

    // Set all providers to waiting
    const newStatuses = new Map<string, WaveStatus>();
    providers.forEach((p) => newStatuses.set(p.id, "waiting"));
    setProviderStatuses(newStatuses);

    // Brief delay to show "sending" state
    setTimeout(() => {
      setState("waiting");

      // Simulate each provider's response
      providers.forEach((provider) => {
        // Random response time for each provider
        const responseTime =
          minResponseTime + Math.random() * (maxResponseTime - minResponseTime);

        const timeout = setTimeout(() => {
          // Skip if already accepted by another provider
          if (acceptedRef.current) return;

          // Random accept/reject based on acceptChance
          // First provider in sorted list has higher chance
          const providerIndex = providers.findIndex((p) => p.id === provider.id);
          const adjustedChance = acceptChance + (providerIndex === 0 ? 0.3 : 0);
          const accepted = Math.random() < adjustedChance;

          if (accepted && !acceptedRef.current) {
            // This provider accepted!
            acceptedRef.current = true;
            setAcceptedProvider(provider);
            setState("accepted");

            // Update statuses - accepted provider and cancel others
            setProviderStatuses((prev) => {
              const updated = new Map(prev);
              providers.forEach((p) => {
                if (p.id === provider.id) {
                  updated.set(p.id, "accepted");
                } else if (updated.get(p.id) === "waiting") {
                  updated.set(p.id, "rejected"); // Cancel others
                }
              });
              return updated;
            });

            // Clear remaining timeouts
            clearAllTimeouts();

            // Notify parent
            onProviderAccepted(provider);
          } else {
            // This provider rejected
            setProviderStatuses((prev) => {
              const updated = new Map(prev);
              updated.set(provider.id, "rejected");
              return updated;
            });
          }
        }, responseTime);

        timeoutsRef.current.push(timeout);
      });
    }, 500);
  }, [providers, minResponseTime, maxResponseTime, acceptChance, onProviderAccepted, clearAllTimeouts]);

  // Handle timeout - called when timer expires
  const handleTimeout = useCallback(() => {
    if (acceptedRef.current) return; // Already accepted, ignore

    setState("timeout");
    clearAllTimeouts();

    // Mark all waiting providers as rejected
    setProviderStatuses((prev) => {
      const updated = new Map(prev);
      providers.forEach((p) => {
        if (updated.get(p.id) === "waiting") {
          updated.set(p.id, "rejected");
        }
      });
      return updated;
    });

    onTimeout();
  }, [providers, clearAllTimeouts, onTimeout]);

  // Cancel the wave request
  const cancelRequest = useCallback(() => {
    setState("cancelled");
    clearAllTimeouts();
    acceptedRef.current = false;

    // Reset all statuses
    setProviderStatuses(new Map(providers.map((p) => [p.id, "idle"])));
  }, [providers, clearAllTimeouts]);

  // Reset to initial state
  const reset = useCallback(() => {
    setState("idle");
    clearAllTimeouts();
    acceptedRef.current = false;
    setAcceptedProvider(null);
    setProviderStatuses(new Map(providers.map((p) => [p.id, "idle"])));
  }, [providers, clearAllTimeouts]);

  return {
    state,
    providersWithStatus,
    acceptedProvider,
    sendWaveRequest,
    handleTimeout,
    cancelRequest,
    reset,
    isWaiting: state === "waiting" || state === "sending",
  };
}
