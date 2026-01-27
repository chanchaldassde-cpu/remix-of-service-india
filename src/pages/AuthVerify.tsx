import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { ArrowLeft, Smartphone } from "lucide-react";

const AuthVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, verifyOtp, signInWithPhone } = useAuth();
  
  const phone = location.state?.phone as string;
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Redirect if no phone number or already logged in
  useEffect(() => {
    if (!phone) {
      navigate("/auth");
      return;
    }
    if (user && !loading) {
      navigate("/");
    }
  }, [phone, user, loading, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);
    try {
      const { error } = await verifyOtp(phone, otp);
      if (error) {
        toast.error("Invalid or expired code. Please try again.");
        setOtp("");
        return;
      }
      toast.success("Phone verified successfully!");
      navigate("/");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const { error } = await signInWithPhone(phone);
      if (error) {
        toast.error("Failed to resend code. Please try again.");
        return;
      }
      toast.success("New code sent!");
      setCountdown(30);
      setOtp("");
    } finally {
      setIsResending(false);
    }
  };

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  if (loading || !phone) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/auth")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Verify Phone</h1>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 pb-8">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Smartphone className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Enter OTP</CardTitle>
            <CardDescription>
              We've sent a 6-digit code to <br />
              <span className="font-medium text-foreground">{phone}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center">
              <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={6}
                disabled={isVerifying}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Verify Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleVerify}
              disabled={otp.length !== 6 || isVerifying}
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Verifying...
                </span>
              ) : (
                "Verify & Continue"
              )}
            </Button>

            {/* Resend */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Resend code in{" "}
                  <span className="font-medium text-foreground">{countdown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </button>
              )}
            </div>

            {/* Change Number */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/auth")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Use a different phone number
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthVerify;
