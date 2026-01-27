import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

interface WaveRequestTimerProps {
  duration: number; // Total duration in seconds
  isActive: boolean;
  onTimeout: () => void;
}

/**
 * WaveRequestTimer - Displays countdown timer for wave request
 * Shows progress bar and remaining time
 */
export function WaveRequestTimer({ duration, isActive, onTimeout }: WaveRequestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // Reset timer when activated
    if (isActive) {
      setTimeLeft(duration);
    }
  }, [isActive, duration]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimeout]);

  const progress = (timeLeft / duration) * 100;

  if (!isActive) return null;

  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Timer className="h-4 w-4 text-primary" />
          <span>Waiting for providers</span>
        </div>
        <span className="text-lg font-bold text-primary">{timeLeft}s</span>
      </div>
      {/* Avoid Radix Progress here to prevent React Context consumer crashes in some builds */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground text-center">
        Request will expire if no provider accepts
      </p>
    </div>
  );
}
