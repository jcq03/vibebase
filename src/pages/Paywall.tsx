import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Lock, Check, Loader2 } from "lucide-react";

// Stripe Payment Link
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/9B65kw6sKeNsahoenSco000";

const Paywall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [loading, setLoading] = useState(false);

  const handlePurchase = () => {
    setLoading(true);
    
    // Redirect to Stripe Payment Link
    // Add email as prefilled if available
    const paymentUrl = email 
      ? `${STRIPE_PAYMENT_LINK}?prefilled_email=${encodeURIComponent(email)}`
      : STRIPE_PAYMENT_LINK;
    
    window.location.href = paymentUrl;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="https://znvstbggiqsecovmtfzx.supabase.co/storage/v1/object/sign/images/vibebase%20logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MDYwNDQ0Yy01ZTQzLTQ5ZDgtYTYxZi05OTA2OGE5Y2RmZmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvdmliZWJhc2UgbG9nby5wbmciLCJpYXQiOjE3NjY2NTQ2NzAsImV4cCI6MTc5ODE5MDY3MH0.SO3-sI4vKng48HxQJX4NAsdY_Xotr0BWFHW-GHGCLC8"
            alt="VIBE BASE Logo"
            className="h-12 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Complete Your Purchase
          </h1>
          <p className="text-gray-500 text-sm">
            Secure checkout powered by Stripe
          </p>
        </div>

        {/* Checkout Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Order Summary */}
          <div className="bg-gray-50 p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Pro Builder - Lifetime</p>
                <p className="text-sm text-gray-500">One-time payment</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">$49</p>
                <p className="text-sm text-gray-400 line-through">$348</p>
                <p className="text-xs text-orange-600 font-medium mt-1">Only first 50 users, then $29/month</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <Check className="w-4 h-4" />
              <span>You're saving $299 (86% off)</span>
            </div>
          </div>

          {/* What's Included */}
          <div className="p-6">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              What's included:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "AI-Powered Idea Generator",
                "Full Tool Kit Access",
                "All Step-by-Step Courses",
                "Weekly Live Build Calls",
                "Private Community Access",
                "Lifetime Updates",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Purchase Button */}
            <Button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full h-14 text-lg bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecting to checkout...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Pay $49 - Get Lifetime Access
                </span>
              )}
            </Button>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-4">
              <Shield className="w-4 h-4" />
              <span>Secure checkout via Stripe</span>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="bg-green-50 p-4 text-center border-t border-green-100">
            <p className="text-sm text-green-700 font-medium">
              ✓ 30-day money-back guarantee • No questions asked
            </p>
          </div>
        </div>

        {/* Already have access */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Already purchased?{" "}
            <button
              onClick={() => navigate("/auth")}
              className="text-gray-900 font-semibold hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Paywall;

