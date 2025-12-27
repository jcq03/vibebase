import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
  });

  const experienceOptions = [
    { value: "never", label: "I've never tried it" },
    { value: "just-started", label: "Just started (less than 1 month)" },
    { value: "few-months", label: "A few months" },
    { value: "6-months", label: "6 months to 1 year" },
    { value: "1-year-plus", label: "Over 1 year" },
  ];

  const leftTestimonials = [
    { stat: "Build 3x faster", name: "Alex M.", role: "Indie Developer" },
    { stat: "4x less errors", name: "Sarah K.", role: "Startup Founder" },
  ];

  const rightTestimonials = [
    { stat: "Vibe code with ease", name: "James L.", role: "Solo Builder" },
    { stat: "Get started easily", name: "Emma R.", role: "First-time Coder" },
  ];

  const TestimonialCard = ({ stat, name, role }: { stat: string; name: string; role: string }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-lg font-bold text-gray-900 mb-3">"{stat}"</p>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Store the sign-up data in waitlist table (non-blocking)
      const { error } = await supabase.from("waitlist").insert({
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        experience: formData.experience,
      });

      if (error) {
        // Check if it's a duplicate email error
        if (error.code === "23505") {
          toast({
            title: "Welcome back!",
            description: "Taking you to the next step...",
          });
        } else {
          // Log error but don't block the user
          console.error("Waitlist error:", error);
        }
      }
    } catch (error: any) {
      // Log error but don't block the user
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
      
      // Store signup data in localStorage for account creation after payment
      localStorage.setItem("vibebase_signup", JSON.stringify(formData));
      
      // Always navigate to welcome page
      toast({
        title: "Welcome aboard! 🎉",
        description: "Let's show you what's possible!",
      });
      navigate("/welcome", { state: { email: formData.email } });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">

      {/* Left side testimonials - hidden on mobile */}
      <div className="hidden lg:flex flex-col gap-6 absolute left-8 xl:left-16 top-1/2 -translate-y-1/2 w-64 opacity-60 hover:opacity-100 transition-opacity duration-300">
        {leftTestimonials.map((t, i) => (
          <div key={i} style={{ animationDelay: `${i * 150}ms` }} className="animate-fade-in">
            <TestimonialCard {...t} />
          </div>
        ))}
      </div>

      {/* Right side testimonials - hidden on mobile */}
      <div className="hidden lg:flex flex-col gap-6 absolute right-8 xl:right-16 top-1/2 -translate-y-1/2 w-64 opacity-60 hover:opacity-100 transition-opacity duration-300">
        {rightTestimonials.map((t, i) => (
          <div key={i} style={{ animationDelay: `${(i + 2) * 150}ms` }} className="animate-fade-in">
            <TestimonialCard {...t} />
          </div>
        ))}
      </div>

      {/* Main signup form */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="https://znvstbggiqsecovmtfzx.supabase.co/storage/v1/object/sign/images/vibebase%20logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MDYwNDQ0Yy01ZTQzLTQ5ZDgtYTYxZi05OTA2OGE5Y2RmZmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvdmliZWJhc2UgbG9nby5wbmciLCJpYXQiOjE3NjY2NTQ2NzAsImV4cCI6MTc5ODE5MDY3MH0.SO3-sI4vKng48HxQJX4NAsdY_Xotr0BWFHW-GHGCLC8"
            alt="VIBE BASE Logo"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900">Get Started</h1>
          <p className="text-gray-600 mt-2">Join thousands of builders creating their first apps</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 12px 24px -8px rgba(0, 0, 0, 0.15)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-12 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-12 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="h-12 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            {/* Vibe Coding Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-gray-700 font-medium">
                How long have you been vibe coding?
              </Label>
              <Select
                value={formData.experience}
                onValueChange={(value) => setFormData({ ...formData, experience: value })}
                required
              >
                <SelectTrigger className="h-12 border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !formData.name || !formData.email || !formData.phone || !formData.experience}
              className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 text-lg font-medium mt-6"
            >
              {loading ? "Creating your account..." : "Continue →"}
            </Button>
          </form>

          {/* Already have account */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/auth")}
                className="text-gray-900 font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🔒 Your information is secure and will never be shared</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

