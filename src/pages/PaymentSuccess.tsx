import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [status, setStatus] = useState<"creating" | "success" | "error">("creating");
  const [message, setMessage] = useState("Creating your account...");

  useEffect(() => {
    const createAccount = async () => {
      try {
        // Get signup data from localStorage
        const signupDataStr = localStorage.getItem("vibebase_signup");
        
        if (!signupDataStr) {
          // No signup data, just redirect to auth
          setMessage("Redirecting to sign in...");
          setTimeout(() => navigate("/auth"), 1500);
          return;
        }

        const signupData = JSON.parse(signupDataStr);
        const { name, email, phone, experience } = signupData;

        if (!email) {
          throw new Error("No email found");
        }

        setMessage("Setting up your account...");

        // Create the user account in Supabase
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: generateTempPassword(), // Generate a temporary password
          options: {
            data: {
              full_name: name,
              phone: phone,
              experience: experience,
              paid: true,
            },
          },
        });

        if (error) {
          // If user already exists, that's okay
          if (error.message.includes("already registered")) {
            setStatus("success");
            setMessage("Account found! Redirecting to sign in...");
            toast({
              title: "Welcome back!",
              description: "Please sign in to access your dashboard.",
            });
          } else {
            throw error;
          }
        } else {
          setStatus("success");
          setMessage("Account created! Check your email to verify, then sign in.");
          
          toast({
            title: "Account created! 🎉",
            description: "Check your email for a verification link, then sign in.",
          });
        }

        // Clear signup data
        localStorage.removeItem("vibebase_signup");

        // Redirect to auth after a delay
        setTimeout(() => {
          navigate("/auth", { state: { email, fromPayment: true } });
        }, 3000);

      } catch (error: any) {
        console.error("Account creation error:", error);
        setStatus("error");
        setMessage("There was an issue. Please sign up manually.");
        
        toast({
          title: "Account setup issue",
          description: "Please complete your signup manually.",
          variant: "destructive",
        });

        setTimeout(() => navigate("/auth"), 3000);
      }
    };

    createAccount();
  }, [navigate, toast]);

  // Generate a random temporary password
  const generateTempPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <img
          src="https://znvstbggiqsecovmtfzx.supabase.co/storage/v1/object/sign/images/vibebase%20logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MDYwNDQ0Yy01ZTQzLTQ5ZDgtYTYxZi05OTA2OGE5Y2RmZmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvdmliZWJhc2UgbG9nby5wbmciLCJpYXQiOjE3NjY2NTQ2NzAsImV4cCI6MTc5ODE5MDY3MH0.SO3-sI4vKng48HxQJX4NAsdY_Xotr0BWFHW-GHGCLC8"
          alt="VIBE BASE Logo"
          className="h-12 w-auto mx-auto mb-8"
        />

        {/* Success Icon */}
        <div className="mb-6">
          {status === "creating" ? (
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-gray-600 animate-spin" />
            </div>
          ) : status === "success" ? (
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          ) : (
            <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {status === "success" ? "Payment Successful!" : status === "error" ? "Almost there!" : "Processing..."}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">{message}</p>

        {/* Loading dots */}
        {status === "creating" && (
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;

