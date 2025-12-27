// Recommended Tech Stack data - used for Tools page and Project Whiteboard recommendations

export type AppType = "mobile" | "web" | "saas";

export interface TechTool {
  name: string;
  category: string;
  description: string;
}

export interface TechStack {
  type: AppType;
  title: string;
  description: string;
  tools: TechTool[];
}

export const techStacks: Record<AppType, TechStack> = {
  mobile: {
    type: "mobile",
    title: "Mobile App",
    description: "Build native mobile applications for iOS and Android",
    tools: [
      { name: "Cursor AI", category: "Build & Code", description: "AI-powered code editor to build and refine your mobile app" },
      { name: "Supabase", category: "Backend", description: "Database, auth, and real-time features for your app" },
      { name: "RevenueCat", category: "Paywall", description: "Subscription management and in-app purchases" },
      { name: "Superwall", category: "Paywall", description: "A/B test paywalls and maximize conversion" },
    ],
  },
  web: {
    type: "web",
    title: "Web App",
    description: "Create modern web applications with AI-powered tools",
    tools: [
      { name: "Loveable", category: "Build", description: "AI app builder - describe your idea and get a working app" },
      { name: "Loveable Cloud", category: "Backend", description: "Integrated backend with Loveable for seamless deployment" },
      { name: "Stripe", category: "Paywall", description: "Accept payments and manage subscriptions" },
      { name: "RevenueCat", category: "Paywall", description: "Alternative subscription management platform" },
      { name: "Fasthosts", category: "Domain", description: "Register and manage your custom domain" },
    ],
  },
  saas: {
    type: "saas",
    title: "SaaS",
    description: "Build scalable software-as-a-service platforms",
    tools: [
      { name: "Cursor AI", category: "Build & Code", description: "AI code editor for building complex SaaS features" },
      { name: "Claude Code", category: "Build & Code", description: "Alternative AI coding assistant for development" },
      { name: "Supabase", category: "Backend", description: "PostgreSQL database with auth and real-time subscriptions" },
      { name: "Vercel", category: "Hosting", description: "Deploy and host your SaaS with automatic scaling" },
      { name: "Stripe", category: "Paywall", description: "Payment processing and subscription billing" },
      { name: "RevenueCat", category: "Paywall", description: "Manage subscriptions across platforms" },
    ],
  },
};

// Helper function to get recommended tools based on app type
export const getRecommendedTools = (appType: string): TechTool[] => {
  const normalizedType = appType.toLowerCase();
  
  if (normalizedType.includes("mobile") || normalizedType.includes("ios") || normalizedType.includes("android")) {
    return techStacks.mobile.tools;
  }
  if (normalizedType.includes("saas") || normalizedType.includes("software as a service")) {
    return techStacks.saas.tools;
  }
  // Default to web app
  return techStacks.web.tools;
};

// Get all tools for display
export const getAllTechStacks = (): TechStack[] => {
  return Object.values(techStacks);
};

