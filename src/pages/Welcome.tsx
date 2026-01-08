import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, Rocket, TrendingUp, Layers, ArrowRight, CheckCircle } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const features = [
    {
      icon: Rocket,
      title: "Idea to Launch in 30 Days",
      description: "Go from concept to live app faster than ever before with our proven framework",
    },
    {
      icon: TrendingUp,
      title: "Scale with Ease",
      description: "Built-in tools and guidance to grow your app from 0 to thousands of users",
    },
    {
      icon: Layers,
      title: "All-in-One Vibe Coding Platform",
      description: "Everything you need in one place: courses, tools, community, and live support",
    },
  ];

  const reviews = [
    {
      quote: "I launched my first app in 3 weeks. Never thought I could do it!",
      name: "Marcus T.",
      role: "First-time Builder",
      rating: 5,
    },
    {
      quote: "The step-by-step guidance made everything click. Now I have 3 apps live.",
      name: "Jennifer L.",
      role: "Indie Developer",
      rating: 5,
    },
    {
      quote: "Best investment I've made. The community alone is worth 10x the price.",
      name: "David K.",
      role: "Solo Founder",
      rating: 5,
    },
    {
      quote: "From zero coding knowledge to a profitable SaaS in 2 months. Incredible.",
      name: "Rachel M.",
      role: "Career Changer",
      rating: 5,
    },
  ];

  const stats = [
    { value: "10,000+", label: "Builders" },
    { value: "5,000+", label: "Apps Launched" },
    { value: "30 Days", label: "Avg. Launch Time" },
    { value: "4.9/5", label: "Rating" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            You're almost there!
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to the Future of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900">
              App Building
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Join thousands of builders who went from zero to launching their dream apps. 
            Your journey starts now.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Go to Dashboard Button */}
          <Button
            size="lg"
            onClick={() => navigate("/paywall", { state: { email } })}
            className="h-14 px-10 text-lg bg-gray-900 text-white hover:bg-gray-800 rounded-full font-semibold group"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Builders Choose Us
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Loved by Builders Worldwide
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Real stories from real people who transformed their ideas into successful apps
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg text-gray-800 mb-4 italic">"{review.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-sm font-semibold text-gray-600">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build Your Dream App?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Complete your account setup and start building today.
          </p>
          
          <Button
            size="lg"
            onClick={() => navigate("/paywall", { state: { email } })}
            className="h-14 px-10 text-lg bg-white text-gray-900 hover:bg-gray-100 rounded-full font-semibold group"
          >
            Continue to Dashboard
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="text-gray-500 text-sm mt-6">
            🔒 Secure checkout • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default Welcome;

