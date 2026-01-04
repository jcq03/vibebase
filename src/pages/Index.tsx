import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [ideaInput, setIdeaInput] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://znvstbggiqsecovmtfzx.supabase.co/storage/v1/object/sign/images/vibebase%20logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MDYwNDQ0Yy01ZTQzLTQ5ZDgtYTYxZi05OTA2OGE5Y2RmZmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvdmliZWJhc2UgbG9nby5wbmciLCJpYXQiOjE3NjY2NTQ2NzAsImV4cCI6MTc5ODE5MDY3MH0.SO3-sI4vKng48HxQJX4NAsdY_Xotr0BWFHW-GHGCLC8"
              alt="VIBE BASE Logo"
              className="h-16 w-auto"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Sign in
            </button>
            <Button
              onClick={() => navigate("/signup")}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              Get started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-gray-100 rounded-full text-sm font-medium mb-4 text-gray-900">
              Special Offer: Get Started Today
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-gray-900">
              Build Your First App in{" "}
              <span className="block mt-2">30 Days</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mt-6">
              Get started today, and receive all new features for free: AI-powered tools, step-by-step guidance, live build calls and more
            </p>
            
            {/* Video Section */}
            <div className="max-w-3xl mx-auto mt-10 rounded-xl overflow-hidden shadow-2xl border border-gray-200">
              <iframe
                className="w-full aspect-video"
                src="https://www.youtube.com/embed/lBSkrKdOTqk"
                title="Vibe Base Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            
            {/* Idea Input Section */}
            <div className="max-w-2xl mx-auto w-full mt-12">
              <div className="flex gap-3 items-center">
                <Input
                  type="text"
                  placeholder="Explain your idea here..."
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && ideaInput.trim()) {
                      navigate("/auth");
                    }
                  }}
                  className="flex-1 h-14 text-base text-gray-900 bg-gray-50 border-gray-300 rounded-lg px-6 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 placeholder:text-gray-500"
                />
                <Button
                  size="lg"
                  className="h-14 px-8 rounded-lg bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2"
                  onClick={() => {
                    // Save the idea to localStorage to use after payment
                    localStorage.setItem("vibebase_idea", ideaInput.trim());
                    navigate("/signup");
                  }}
                  disabled={!ideaInput.trim()}
                >
                  <Wand2 className="w-5 h-5" />
                  Build
                </Button>
              </div>
              
              {/* Pricing text moved below text box */}
              <div className="text-sm text-gray-600 mt-4 text-center">
                Value: <span className="line-through">$348</span> - get it for only <span className="font-bold text-gray-900">$49</span> one-off life time payment
              </div>
            </div>
            
            <div className="flex flex-col items-center mt-12">
            <Button 
              size="lg" 
              className="text-lg px-10 py-6 h-auto rounded-full bg-gray-900 text-white hover:bg-gray-800"
              onClick={() => navigate("/signup")}
            >
              Start Building Now
            </Button>
              {/* Down Arrow */}
              <div className="mt-8">
                <svg className="w-6 h-6 text-gray-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-[95%]">
          <div className="w-full">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
            <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                From idea to app in minutes
              </h2>
                <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Vibe Base analyzes your codebase, helps you plan new features with precision, and keeps your team aligned with automatically generated docs.
              </p>
              
                {/* Steps */}
                <div className="space-y-4">
                  <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">01. Generate Detailed Prompts</h3>
                    <p className="text-gray-600">
                      Create high-quality, structured prompts for tools like Cursor, Lovable, and other AI builders—covering features, logic, UI behavior, and implementation steps so nothing is vague or missed.
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">02. Customize Features</h3>
                    <p className="text-gray-600">
                      Describe how each feature should work, including UI, routes, models, and file paths, in as much detail as you need.
                        </p>
                      </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">03. Idea to Detailed Plan & Tracked Progress</h3>
                    <p className="text-gray-600">
                      Turn rough ideas into a clear build plan with defined features, tech stack, and step-by-step tasks—then track progress with a simple to-do system as you build.
                    </p>
                    </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">04. In-Depth Video Course</h3>
                    <p className="text-gray-600">
                      Learn how to use all the top AI coding and building tools through structured lessons, real examples, ongoing support, and live calls to level up your vibe coding skills.
                    </p>
                  </div>
                </div>
            </div>
            
              {/* Right Column - Image */}
              <div className="h-full min-h-[400px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://znvstbggiqsecovmtfzx.supabase.co/storage/v1/object/public/images/Screenshot%202026-01-04%20at%2011.41.12.png"
                  alt="Vibe Base Dashboard Preview"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loved by Builders Section */}
      <section className="bg-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-16">
              <Button 
                size="lg" 
                className="text-lg px-10 py-6 h-auto rounded-full bg-gray-900 text-white hover:bg-gray-800"
                onClick={() => navigate("/signup")}
              >
                Start Building Now
              </Button>
            </div>
          <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by Builders
            </h2>
              <p className="text-xl text-gray-600">
              Join thousands of developers building their dream apps
            </p>
          </div>
          
            {/* Testimonials Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Vibe Base day one: docs organized, cursor-tuned, hyper-restored. This toolkit is incredible!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                    SJ
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">@sarahj_dev</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "The task management and PRD features streamline my entire workflow. Love it!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                    MC
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Michael Chen</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Game-changing for solo developers. It's like having a whole team at my fingertips!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                    ED
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Emma Davis</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 4 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Works perfectly with my workflow. My productivity has skyrocketed!"
                  </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                    AR
                    </div>
                    <div>
                    <p className="font-semibold text-gray-900">Alex Rivera</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 5 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "This is a great app so far. Looking forward to continuing to learn to build apps and then subsequently launch and sell them."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                    JW
                    </div>
                  <div>
                    <p className="font-semibold text-gray-900">Jessica Wong</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 6 */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
            ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Vibe Base turned me from a beginner into a productive developer. Incredible value!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                    DP
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">David Park</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Everything you need to build your first app
            </p>
            
            {/* Pricing Card */}
            <div className="bg-white border-2 border-gray-900 rounded-lg p-8 max-w-md mx-auto relative overflow-visible">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Pro Builder</h3>
              <div className="mb-8">
                <span className="text-5xl font-bold text-gray-900">$49</span>
                <span className="text-gray-600 ml-2">one-off lifetime payment</span>
                <p className="text-sm text-orange-600 font-medium mt-2">Only first 50 users, then $29/month</p>
              </div>
              
              <ul className="space-y-4 mb-8 text-left">
              {[
                "AI-Powered Idea Generator",
                "Full Tool Kit Access",
                "All Step-by-Step Courses",
                "Weekly Live Build Calls",
                "Build Tracker & Analytics",
                "Private Community Access",
                "Priority Support"
              ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-900 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
              ))}
              </ul>
              
              <Button
                className="w-full bg-gray-900 text-white hover:bg-gray-800 h-12 text-lg"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
              
              {/* Green Ribbon - Below Get Started button */}
              <div className="mt-4 flex justify-center">
                <div 
                  className="bg-green-600 text-white px-8 py-2 text-sm font-bold shadow-lg whitespace-nowrap uppercase tracking-wide relative"
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  Limited time offer, GET NOW!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-3">
                <img
                  src="https://znvstbggiqsecovmtfzx.supabase.co/storage/v1/object/sign/images/vibebase%20logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83MDYwNDQ0Yy01ZTQzLTQ5ZDgtYTYxZi05OTA2OGE5Y2RmZmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvdmliZWJhc2UgbG9nby5wbmciLCJpYXQiOjE3NjY2NTQ2NzAsImV4cCI6MTc5ODE5MDY3MH0.SO3-sI4vKng48HxQJX4NAsdY_Xotr0BWFHW-GHGCLC8"
                  alt="VIBE BASE Logo"
                  className="h-12 w-auto"
                />
                </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                <a href="#" className="hover:text-gray-900">About</a>
                <a href="#" className="hover:text-gray-900">Features</a>
                <a href="#" className="hover:text-gray-900">Pricing</a>
                <a href="#" className="hover:text-gray-900">Contact</a>
                <a href="#" className="hover:text-gray-900">Privacy</a>
                <a href="#" className="hover:text-gray-900">Terms</a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} VIBE BASE. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

