import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, ZoomIn, ZoomOut, X, PanelRightOpen, ArrowLeft, Pencil, Check, StickyNote, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { techStacks, getRecommendedTools } from "@/data/techStack";

// Helper function to get emoji for tool category
const getCategoryIcon = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'build & code': return '🖥️';
    case 'build': return '💜';
    case 'backend': return '🗄️';
    case 'paywall': return '💳';
    case 'hosting': return '▲';
    case 'domain': return '🌐';
    default: return '⚡';
  }
};

// AI Content Generation based on project idea
interface AIContent {
  overview: {
    problemStatement: string;
    targetAudience: string;
    uniqueValue: string;
  };
  features: Array<{ name: string; description: string; priority: 'Essential' | 'Core' | 'Recommended' }>;
  appType: {
    recommended: string;
    appTypeKey: 'mobile' | 'saas' | 'web';
    reasons: string[];
    alternatives: Array<{ name: string; description: string }>;
  };
  tools: Array<{ name: string; description: string; recommended: boolean }>;
  backend: Array<{ name: string; description: string; priority: 'Required' | 'Recommended' | 'Optional' }>;
  phases: Array<{ name: string; week: string; tasks: string[] }>;
  recommendedAiTool: {
    name: string;
    icon: string;
    description: string;
  };
  recommendedCourses: Array<{ title: string; description: string }>;
}

const generateAIContent = (name: string, description: string, features: string): AIContent => {
  // Combine all text for analysis
  const allText = `${name} ${description} ${features}`.toLowerCase();
  const featureList = features.split(/[,\n]/).map(f => f.trim()).filter(f => f.length > 0);
  
  // Smart feature detection from idea text
  const hasAuth = allText.includes('auth') || allText.includes('login') || allText.includes('user') || allText.includes('account') || allText.includes('sign up') || allText.includes('register');
  const hasImages = allText.includes('image') || allText.includes('photo') || allText.includes('upload') || allText.includes('gallery') || allText.includes('picture');
  const hasPayments = allText.includes('payment') || allText.includes('stripe') || allText.includes('subscription') || allText.includes('checkout') || allText.includes('buy') || allText.includes('sell') || allText.includes('pricing') || allText.includes('monetize');
  const hasSocial = allText.includes('social') || allText.includes('share') || allText.includes('community') || allText.includes('follow') || allText.includes('friend') || allText.includes('network');
  const hasRealtime = allText.includes('real-time') || allText.includes('chat') || allText.includes('live') || allText.includes('messaging') || allText.includes('notification');
  const hasAI = allText.includes('ai') || allText.includes('gpt') || allText.includes('machine learning') || allText.includes('generate') || allText.includes('automate');
  const hasBooking = allText.includes('book') || allText.includes('schedule') || allText.includes('appointment') || allText.includes('reservation') || allText.includes('calendar');
  const hasEcommerce = allText.includes('ecommerce') || allText.includes('e-commerce') || allText.includes('shop') || allText.includes('store') || allText.includes('cart') || allText.includes('product');
  const hasTracker = allText.includes('track') || allText.includes('progress') || allText.includes('goal') || allText.includes('habit') || allText.includes('fitness') || allText.includes('health');
  
  // Smart app type detection - analyze the idea holistically
  const mobileKeywords = ['mobile', 'ios', 'android', 'app store', 'phone', 'native app', 'push notification', 'offline', 'gps', 'camera'];
  const saasKeywords = ['saas', 'subscription', 'multi-tenant', 'b2b', 'business', 'team', 'workspace', 'dashboard', 'analytics', 'crm', 'enterprise', 'api', 'platform'];
  const webKeywords = ['website', 'web app', 'landing page', 'portfolio', 'blog', 'marketplace'];
  
  const mobileScore = mobileKeywords.filter(kw => allText.includes(kw)).length;
  const saasScore = saasKeywords.filter(kw => allText.includes(kw)).length + (hasPayments ? 1 : 0) + (hasAuth ? 0.5 : 0);
  const webScore = webKeywords.filter(kw => allText.includes(kw)).length;
  
  // Determine app type based on highest score
  let appTypeKey: 'mobile' | 'saas' | 'web' = 'web';
  let recommendedAppType = 'Web Application';
  
  if (mobileScore > saasScore && mobileScore > webScore) {
    appTypeKey = 'mobile';
    recommendedAppType = 'Mobile App';
  } else if (saasScore > mobileScore && saasScore > webScore) {
    appTypeKey = 'saas';
    recommendedAppType = 'SaaS Application';
  } else if (hasEcommerce) {
    appTypeKey = 'web';
    recommendedAppType = 'E-commerce Web App';
  } else if (hasBooking) {
    appTypeKey = 'web';
    recommendedAppType = 'Booking/Scheduling Web App';
  }
  
  // Get the appropriate tech stack from data
  const recommendedStack = techStacks[appTypeKey];

  // Generate smart problem statement based on detected features
  const generateProblemStatement = () => {
    if (hasEcommerce) return `${name} provides a seamless online shopping experience, making it easy for customers to discover, purchase, and receive products`;
    if (hasBooking) return `${name} simplifies scheduling and appointments, eliminating back-and-forth communication and reducing no-shows`;
    if (hasTracker) return `${name} helps users track their progress and stay motivated by providing clear insights and goal management`;
    if (hasSocial) return `${name} connects people with shared interests, fostering community engagement and meaningful interactions`;
    if (hasAI) return `${name} leverages AI to automate tasks and provide intelligent insights, saving users time and effort`;
    return description || `${name} solves a key problem for users by providing an intuitive, efficient solution`;
  };

  const generateTargetAudience = () => {
    if (hasEcommerce) return 'Online shoppers looking for a convenient and trustworthy shopping experience';
    if (hasBooking) return 'Busy professionals and service providers who need efficient scheduling';
    if (hasTracker) return 'Goal-oriented individuals who want to track and improve their progress';
    if (hasSocial) return 'People seeking to connect with like-minded individuals and build community';
    if (appTypeKey === 'saas') return 'Businesses and teams looking to streamline their workflows';
    if (appTypeKey === 'mobile') return 'Mobile-first users who need on-the-go access and convenience';
    return `Users who need ${name.toLowerCase()} functionality for personal or professional use`;
  };

  // Generate smart features based on detected idea type
  const smartFeatures = [];
  
  // Always add auth if detected
  if (hasAuth) smartFeatures.push({ name: '🔐 User Authentication', description: 'Sign up, login, password reset, and session management', priority: 'Essential' as const });
  
  // Add type-specific features
  if (hasEcommerce) {
    smartFeatures.push({ name: '🛒 Shopping Cart', description: 'Add items, manage quantities, and save for later', priority: 'Essential' as const });
    smartFeatures.push({ name: '💳 Checkout Flow', description: 'Secure payment processing with Stripe integration', priority: 'Essential' as const });
    smartFeatures.push({ name: '📦 Order Tracking', description: 'Track order status and delivery updates', priority: 'Core' as const });
  } else if (hasBooking) {
    smartFeatures.push({ name: '📅 Calendar View', description: 'Visual calendar to see available slots and bookings', priority: 'Essential' as const });
    smartFeatures.push({ name: '⏰ Booking System', description: 'Select time slots and confirm appointments', priority: 'Essential' as const });
    smartFeatures.push({ name: '📧 Reminders', description: 'Email and push notification reminders', priority: 'Core' as const });
  } else if (hasTracker) {
    smartFeatures.push({ name: '📈 Progress Dashboard', description: 'Visual charts and stats to track your journey', priority: 'Essential' as const });
    smartFeatures.push({ name: '🎯 Goal Setting', description: 'Set, track, and achieve your personal goals', priority: 'Essential' as const });
    smartFeatures.push({ name: '🔔 Daily Reminders', description: 'Stay on track with customizable notifications', priority: 'Core' as const });
  } else if (hasSocial) {
    smartFeatures.push({ name: '👤 User Profiles', description: 'Customizable profiles with bio and avatar', priority: 'Essential' as const });
    smartFeatures.push({ name: '📝 Posts & Feed', description: 'Share content and see updates from connections', priority: 'Essential' as const });
    smartFeatures.push({ name: '💬 Messaging', description: 'Direct messages between users', priority: 'Core' as const });
  } else {
    smartFeatures.push({ name: '📊 Dashboard', description: `Main interface for ${name.toLowerCase()} with key data and actions`, priority: 'Essential' as const });
  }
  
  // Add user-specified features
  featureList.slice(0, 3).forEach((f, i) => {
    smartFeatures.push({ 
      name: `📝 ${f}`, 
      description: `Core functionality for ${f.toLowerCase()}`, 
      priority: (i === 0 ? 'Essential' : 'Core') as 'Essential' | 'Core' 
    });
  });
  
  // Add common features based on type
  if (hasImages) smartFeatures.push({ name: '📷 Image Upload', description: 'Upload and manage photos and images', priority: 'Core' as const });
  if (hasRealtime) smartFeatures.push({ name: '⚡ Real-time Updates', description: 'Live data sync without page refresh', priority: 'Core' as const });
  smartFeatures.push({ name: '🔍 Search & Filters', description: 'Find content quickly with search functionality', priority: 'Recommended' as const });
  smartFeatures.push({ name: '📱 Responsive Design', description: 'Works seamlessly on mobile, tablet, and desktop', priority: 'Recommended' as const });

  return {
    overview: {
      problemStatement: generateProblemStatement(),
      targetAudience: generateTargetAudience(),
      uniqueValue: hasAI ? `AI-powered ${name.toLowerCase()} that learns and adapts to user needs` : `Simple, fast, and intuitive ${name.toLowerCase()} experience`,
    },
    features: smartFeatures,
    appType: {
      recommended: recommendedAppType,
      appTypeKey: appTypeKey,
      reasons: appTypeKey === 'mobile' ? [
        'Native app experience with offline capabilities',
        'Access to device features (camera, GPS, notifications)',
        'App store distribution for wider reach',
        'Better performance for complex interactions',
      ] : appTypeKey === 'saas' ? [
        'Recurring revenue with subscription model',
        'Multi-tenant architecture for scalability',
        'Easier to update and maintain centrally',
        'Cross-platform access via web browser',
      ] : [
        'Cross-platform - works on any device with a browser',
        'No app store approval needed - deploy instantly',
        'Easier to update and maintain',
        hasRealtime ? 'Supports real-time features natively' : 'Lower development cost than native apps',
      ],
      alternatives: appTypeKey === 'mobile' ? [
        { name: '🌐 Web Application', description: 'If you want faster development and no app store' },
        { name: '🌐 PWA (Progressive Web App)', description: 'Web app with installable mobile experience' },
        { name: '💼 SaaS', description: 'If you want subscription-based monetization' },
      ] : appTypeKey === 'saas' ? [
        { name: '📱 Mobile App', description: 'If you need native app store presence' },
        { name: '🌐 Web Application', description: 'Simpler web app without SaaS features' },
        { name: '🖥️ Desktop App', description: 'For power users needing local access' },
      ] : [
        { name: '📱 Mobile App (React Native)', description: 'If you need offline access or native features' },
        { name: '🖥️ Desktop App (Electron)', description: 'For power users needing local file access' },
        { name: '🌐 PWA (Progressive Web App)', description: 'Web app that can be installed like a native app' },
      ],
    },
    // Use tools from the shared tech stack based on app type
    tools: recommendedStack.tools.map((tool, index) => ({
      name: getCategoryIcon(tool.category) + ' ' + tool.name,
      description: tool.description,
      recommended: index < 2, // First two tools are recommended
    })),
    backend: [
      { name: '🔐 Authentication', description: hasAuth ? 'User sign-up, login, password reset required for your app' : 'Optional user accounts for personalization', priority: hasAuth ? 'Required' : 'Optional' },
      { name: '🗄️ Database', description: `Store ${name.toLowerCase()} data, user preferences, and settings`, priority: 'Required' as const },
      { name: '📁 File Storage', description: hasImages ? 'Store images and file uploads from users' : 'Optional file/image storage', priority: hasImages ? 'Required' : 'Optional' },
      { name: '🔒 Row Level Security', description: 'Ensure users can only access their own data', priority: 'Recommended' as const },
      { name: '💳 Payments', description: hasPayments ? 'Stripe integration for subscriptions/payments' : 'Add monetization later', priority: hasPayments ? 'Required' : 'Optional' },
      { name: '📧 Email', description: 'Welcome emails, notifications, password reset', priority: 'Optional' as const },
    ],
    phases: [
      { name: 'Project Setup', week: 'Week 1', tasks: [
        appTypeKey === 'mobile' ? `Create ${name} project in Cursor with React Native/Expo` : `Create ${name} project in Loveable or Bolt`,
        'Set up Supabase backend (database, auth, storage)',
        hasAuth ? 'Configure authentication with email/password' : 'Set up basic data structure',
        'Connect to GitHub for version control',
      ]},
      { name: 'Core Features', week: 'Week 2-3', tasks: [
        hasEcommerce ? 'Build product listing and cart' : hasBooking ? 'Build calendar and booking flow' : hasTracker ? 'Build progress dashboard' : 'Build main dashboard layout',
        ...featureList.slice(0, 2).map(f => `Implement ${f}`),
        hasPayments ? 'Integrate Stripe for payments' : 'Add form validation and error handling',
        hasImages ? 'Set up image upload with Supabase Storage' : 'Add data persistence',
      ]},
      { name: 'Polish & UX', week: 'Week 4', tasks: [
        'Add search and filter functionality',
        appTypeKey === 'mobile' ? 'Optimize for different screen sizes' : 'Improve responsive design',
        'Add loading states and animations',
        hasRealtime ? 'Configure real-time subscriptions' : 'Optimize database queries',
      ]},
      { name: 'Testing & Launch', week: 'Week 5', tasks: [
        'Test all features thoroughly',
        'Fix bugs and edge cases',
        appTypeKey === 'mobile' ? 'Submit to App Store / Play Store' : 'Deploy to Vercel',
        'Set up custom domain and analytics',
      ]},
    ],
    // Recommended AI tool based on app type
    recommendedAiTool: appTypeKey === 'mobile' ? {
      name: 'Cursor AI',
      icon: '🖥️',
      description: 'Best for mobile development with React Native/Expo. Use Cursor to build and refine your mobile app code.',
    } : appTypeKey === 'saas' ? {
      name: 'Cursor AI',
      icon: '🖥️',
      description: 'Best for complex SaaS applications. Use Cursor for building scalable features and integrations.',
    } : {
      name: 'Loveable',
      icon: '💜',
      description: 'Best for web apps. Describe your idea and get a working app instantly. Export to Cursor for advanced edits.',
    },
    // Recommended courses based on app type and features
    recommendedCourses: appTypeKey === 'mobile' ? [
      { title: '📱 Mobile App Fundamentals', description: 'Setting up React Native with Expo' },
      { title: '🔐 Mobile Authentication', description: 'Implementing auth with Supabase in mobile' },
      { title: '💳 In-App Purchases', description: 'Setting up RevenueCat for subscriptions' },
      { title: '📲 App Store Submission', description: 'Publishing to iOS App Store and Google Play' },
    ] : appTypeKey === 'saas' ? [
      { title: '🚀 SaaS Foundations', description: 'Building multi-tenant applications' },
      { title: '🔐 User Authentication', description: 'Supabase auth with roles and permissions' },
      { title: '💳 Stripe Integration', description: 'Subscriptions and billing for SaaS' },
      { title: '📊 Analytics & Dashboards', description: 'Building admin panels and analytics' },
      ...(hasPayments ? [{ title: '💰 Payment Webhooks', description: 'Handling Stripe webhooks securely' }] : []),
    ] : [
      { title: '💜 Loveable Basics', description: 'Building your first app with Loveable' },
      { title: '🖥️ Cursor Editing', description: 'Exporting to Cursor and making advanced edits' },
      { title: '🗄️ Supabase Setup', description: 'Connecting your database and auth' },
      { title: '▲ Deploying to Vercel', description: 'Going live with your web app' },
      ...(hasAuth ? [{ title: '🔐 Authentication Deep Dive', description: 'Advanced auth patterns and security' }] : []),
      ...(hasPayments ? [{ title: '💳 Stripe Checkout', description: 'Adding payments to your web app' }] : []),
    ],
  };
};

const ProjectView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [projectDescription, setProjectDescription] = useState("");
  const [projectFeatures, setProjectFeatures] = useState("");
  const [aiContent, setAiContent] = useState<AIContent | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [promptCopied, setPromptCopied] = useState(false);
  
  const [todos, setTodos] = useState<Array<{ id: number; phase: number; text: string; completed: boolean }>>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projectName, setProjectName] = useState("New Project");
  
  // Inline editing state
  const [editingCard, setEditingCard] = useState<CardKey | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  
  // Draggable state for each card
  type CardKey = "central" | "ideaFeatures" | "appType" | "tools" | "phases" | "backend" | "courses" | "prompt";

  // Note cards state
  interface NoteCard {
    id: string;
    parentCard: CardKey;
    content: string;
    x: number;
    y: number;
  }
  const [notes, setNotes] = useState<NoteCard[]>([]);
  const [draggingNote, setDraggingNote] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const [dragging, setDragging] = useState<CardKey | null>(null);
  const [resizing, setResizing] = useState<CardKey | null>(null);
  const [positions, setPositions] = useState<Record<CardKey, { x: number; y: number }>>({
    // Pipeline Layout - 4 cards per row, left to right flow with generous spacing
    // Row 1: Cards 1-4 (spacing: 560px between cards)
    central: { x: 80, y: 80 },           // 1. Project Overview
    ideaFeatures: { x: 640, y: 80 },     // 2. Ideas & Features
    appType: { x: 1200, y: 80 },         // 3. Type of Application
    tools: { x: 1760, y: 80 },           // 4. Tech Stack & Tools
    // Row 2: Cards 5-8 (vertical gap: 620px)
    backend: { x: 80, y: 700 },          // 5. Backend Features
    phases: { x: 640, y: 700 },          // 6. Phase Building / Roadmap
    courses: { x: 1200, y: 700 },        // 7. Course Videos
    prompt: { x: 1760, y: 700 },         // 8. Cursor Prompt
  });
  const [sizes, setSizes] = useState<Record<CardKey, { width: number; height: number }>>({
    central: { width: 440, height: 480 },
    ideaFeatures: { width: 440, height: 480 },
    appType: { width: 440, height: 480 },
    tools: { width: 440, height: 480 },
    backend: { width: 440, height: 480 },
    phases: { width: 440, height: 480 },
    courses: { width: 440, height: 480 },
    prompt: { width: 440, height: 480 },
  });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(0.5);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Load project data from localStorage or database
  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      
      // Try to load from localStorage first
      const savedPositions = localStorage.getItem(`project-${id}-positions`);
      const savedSizes = localStorage.getItem(`project-${id}-sizes`);
      const savedNotes = localStorage.getItem(`project-${id}-notes`);
      if (savedPositions) {
        try {
          const parsed = JSON.parse(savedPositions) as Partial<typeof positions>;
          setPositions((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Error parsing saved positions:", e);
        }
      }
      if (savedSizes) {
        try {
          const parsed = JSON.parse(savedSizes) as Partial<typeof sizes>;
          setSizes((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Error parsing saved sizes:", e);
        }
      }
      if (savedNotes) {
        try {
          const parsed = JSON.parse(savedNotes) as NoteCard[];
          setNotes(parsed);
        } catch (e) {
          console.error("Error parsing saved notes:", e);
        }
      }

      // Check if ID is a valid UUID (36 characters with dashes)
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (!isValidUuid) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error loading project:', error);
        return;
      }

      if (project) {
        setProjectName(project.name);
        setProjectDescription(project.description || '');
        setProjectFeatures(project.features || '');
        
        // Load AI content from database if exists, otherwise generate it
        const savedAiContent = project.ai_content as AIContent | null;
        let contentToUse: AIContent;
        
        if (savedAiContent && savedAiContent.overview) {
          // Use saved AI content from database
          contentToUse = savedAiContent;
        } else {
          // Generate new AI content based on project data
          contentToUse = generateAIContent(
            project.name,
            project.description || '',
            project.features || ''
          );
        }
        setAiContent(contentToUse);
        
        // Load notes from database if exists
        const savedNotes = project.notes as NoteCard[] | null;
        if (savedNotes && Array.isArray(savedNotes)) {
          setNotes(savedNotes);
        }
        
        // Generate dynamic todos based on AI content
        const dynamicTodos = [
          { id: 1, phase: 1, text: "Define problem statement", completed: false },
          { id: 2, phase: 1, text: "Identify target audience", completed: false },
          { id: 3, phase: 1, text: "Document unique value proposition", completed: false },
          ...contentToUse.features.slice(0, 3).map((f, i) => ({
            id: 4 + i,
            phase: 2,
            text: `Implement ${f.name.replace(/^[^\s]+\s/, '')}`,
            completed: false,
          })),
          { id: 7, phase: 3, text: `Build as ${contentToUse.appType.recommended}`, completed: false },
          { id: 8, phase: 3, text: "Document platform decision", completed: false },
          { id: 9, phase: 4, text: "Choose AI tool (Loveable/Bolt)", completed: false },
          { id: 10, phase: 4, text: "Set up Cursor for editing", completed: false },
          { id: 11, phase: 4, text: "Configure Supabase backend", completed: false },
          ...contentToUse.backend.filter(b => b.priority === 'Required').map((b, i) => ({
            id: 12 + i,
            phase: 5,
            text: `Set up ${b.name.replace(/^[^\s]+\s/, '')}`,
            completed: false,
          })),
          ...contentToUse.phases.map((p, i) => ({
            id: 15 + i,
            phase: 6,
            text: `Complete ${p.name}`,
            completed: false,
          })),
        ];
        setTodos(dynamicTodos);
        
        // Load card positions and sizes
        const cardData = project.card_positions as any;
        if (cardData) {
        if (cardData.positions) {
            setPositions((prev) => ({ ...prev, ...(cardData.positions as Partial<typeof positions>) }));
        } else {
            setPositions((prev) => ({ ...prev, ...(cardData as Partial<typeof positions>) }));
        }
        if (cardData.sizes) {
            setSizes((prev) => ({ ...prev, ...(cardData.sizes as Partial<typeof sizes>) }));
          }
        }
      }
    };

    loadProject();
  }, [id]);

  // Save positions and sizes to localStorage and database with debouncing
  useEffect(() => {
    if (!id) return;

    const saveData = async () => {
      // Always save to localStorage
      localStorage.setItem(`project-${id}-positions`, JSON.stringify(positions));
      localStorage.setItem(`project-${id}-sizes`, JSON.stringify(sizes));

      // Check if ID is a valid UUID before trying to save to database
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (!isValidUuid) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('projects')
        .update({ 
          card_positions: { positions, sizes },
          notes: notes,
          ai_content: aiContent 
        })
        .eq('id', id);

      if (error) {
        console.error('Error saving data:', error);
      }
    };

    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [positions, sizes, notes, aiContent, id]);

  // Track viewport size
  useEffect(() => {
    const updateSize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent, card: CardKey) => {
    setDragging(card);
    setDragStart({
      x: e.clientX - positions[card as keyof typeof positions].x,
      y: e.clientY - positions[card as keyof typeof positions].y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, card: CardKey) => {
    e.stopPropagation();
    setResizing(card);
    setDragStart({ x: e.clientX, y: e.clientY });
    setResizeStart({
      width: sizes[card as keyof typeof sizes].width,
      height: sizes[card as keyof typeof sizes].height,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setPositions((prev) => ({
        ...prev,
        [dragging]: {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        },
      }));
    } else if (resizing) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setSizes((prev) => ({
        ...prev,
        [resizing]: {
          width: Math.max(200, resizeStart.width + deltaX),
          height: Math.max(200, resizeStart.height + deltaY),
        },
      }));
    } else if (draggingNote) {
      // Handle note dragging
      const newX = (e.clientX - dragStart.x) / zoom;
      const newY = (e.clientY - dragStart.y) / zoom;
      setNotes(prevNotes => prevNotes.map(n => 
        n.id === draggingNote ? { ...n, x: newX, y: newY } : n
      ));
    } else if (isPanning) {
      setPanOffset({
        x: panStart.x + (e.clientX - dragStart.x) / zoom,
        y: panStart.y + (e.clientY - dragStart.y) / zoom,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setResizing(null);
    setDraggingNote(null);
    setIsPanning(false);
    // Ensure the latest position and size are saved immediately
    const savedId = id;
    if (savedId) {
      localStorage.setItem(`project-${savedId}-positions`, JSON.stringify(positions));
      localStorage.setItem(`project-${savedId}-sizes`, JSON.stringify(sizes));
      localStorage.setItem(`project-${savedId}-notes`, JSON.stringify(notes));
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only start panning if clicking on the background, not on a card
    const target = e.target as HTMLElement;
    const isCard = target.closest('[data-card]');
    if (!isCard) {
      setIsPanning(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setPanStart(panOffset);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    const newZoom = Math.min(Math.max(0.25, zoom + delta), 2.4);
    setZoom(newZoom);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2.4));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.25));
  };

  const handleResetZoom = () => {
    setZoom(0.75);
    setPanOffset({ x: 0, y: 0 });
  };

  // Generate curved SVG path between two cards
  const getCurvedPath = (from: CardKey, to: CardKey) => {
    const fromPos = positions[from];
    const toPos = positions[to];
    const fromSize = sizes[from];
    const toSize = sizes[to];

    // Calculate edge points (exit from right side of 'from', enter left side of 'to')
    const isVertical = Math.abs(toPos.y - fromPos.y) > Math.abs(toPos.x - fromPos.x);
    
    let x1: number, y1: number, x2: number, y2: number;
    
    if (isVertical) {
      // Vertical connection (going down)
      x1 = fromPos.x + fromSize.width / 2;
      y1 = fromPos.y + fromSize.height;
      x2 = toPos.x + toSize.width / 2;
      y2 = toPos.y;
    } else {
      // Horizontal connection (going right)
      x1 = fromPos.x + fromSize.width;
      y1 = fromPos.y + fromSize.height / 2;
      x2 = toPos.x;
      y2 = toPos.y + toSize.height / 2;
    }

    // Create a curved bezier path
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    // Control points for smooth curve
    const curveOffset = isVertical ? 80 : 60;
    const cx1 = isVertical ? x1 : midX;
    const cy1 = isVertical ? y1 + curveOffset : y1;
    const cx2 = isVertical ? x2 : midX;
    const cy2 = isVertical ? y2 - curveOffset : y2;

    return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  };

  // Render a curved connector line
  const CurvedConnector = ({ from, to }: { from: CardKey; to: CardKey }) => (
    <path
      d={getCurvedPath(from, to)}
      fill="none"
      stroke="rgba(255, 255, 255, 0.8)"
      strokeWidth="4"
      strokeDasharray="16 10"
      strokeLinecap="round"
    />
  );

  const zoomLabel = `${Math.round(zoom * 100)}%`;

  // Toggle inline editing for a specific card
  const toggleEditCard = (cardKey: CardKey) => {
    if (editingCard === cardKey) {
      // Already editing, cancel
      setEditingCard(null);
      setEditFormData({});
    } else {
      // Start editing - prepare form data
      setEditingCard(cardKey);
      
      if (cardKey === 'central' && aiContent) {
        setEditFormData({
          problemStatement: aiContent.overview.problemStatement,
          targetAudience: aiContent.overview.targetAudience,
          uniqueValue: aiContent.overview.uniqueValue,
        });
      } else if (cardKey === 'ideaFeatures' && aiContent) {
        setEditFormData({
          features: aiContent.features.map(f => `${f.name}: ${f.description}`).join('\n'),
        });
      } else if (cardKey === 'appType' && aiContent) {
        setEditFormData({
          recommended: aiContent.appType.recommended,
          reasons: aiContent.appType.reasons.join('\n'),
        });
      } else if (cardKey === 'tools' && aiContent) {
        setEditFormData({
          tools: aiContent.tools.map(t => `${t.name}: ${t.description}`).join('\n'),
        });
      } else if (cardKey === 'backend' && aiContent) {
        setEditFormData({
          backend: aiContent.backend.map(b => `${b.name} (${b.priority}): ${b.description}`).join('\n'),
        });
      } else if (cardKey === 'phases' && aiContent) {
        setEditFormData({
          phases: aiContent.phases.map(p => `${p.name} (${p.week}):\n${p.tasks.map(t => `- ${t}`).join('\n')}`).join('\n\n'),
        });
      } else if (cardKey === 'courses') {
        setEditFormData({
          courses: 'Add your course notes here...',
        });
      }
    }
  };

  // Save inline edits
  const saveCardEdits = (cardKey: CardKey) => {
    if (!aiContent) return;

    const updatedContent = { ...aiContent };

    if (cardKey === 'central') {
      updatedContent.overview = {
        problemStatement: editFormData.problemStatement || '',
        targetAudience: editFormData.targetAudience || '',
        uniqueValue: editFormData.uniqueValue || '',
      };
    } else if (cardKey === 'ideaFeatures') {
      const featureLines = (editFormData.features || '').split('\n').filter((l: string) => l.trim());
      updatedContent.features = featureLines.map((line: string) => {
        const [name, ...descParts] = line.split(':');
        return {
          name: name.trim(),
          description: descParts.join(':').trim(),
          priority: 'Core' as const,
        };
      });
    } else if (cardKey === 'appType') {
      updatedContent.appType = {
        ...updatedContent.appType,
        recommended: editFormData.recommended || '',
        reasons: (editFormData.reasons || '').split('\n').filter((l: string) => l.trim()),
      };
    } else if (cardKey === 'tools') {
      const toolLines = (editFormData.tools || '').split('\n').filter((l: string) => l.trim());
      updatedContent.tools = toolLines.map((line: string, i: number) => {
        const [name, ...descParts] = line.split(':');
        return {
          name: name.trim(),
          description: descParts.join(':').trim(),
          recommended: i < 2,
        };
      });
    } else if (cardKey === 'backend') {
      const backendLines = (editFormData.backend || '').split('\n').filter((l: string) => l.trim());
      updatedContent.backend = backendLines.map((line: string) => {
        const match = line.match(/^(.+?)\s*\((\w+)\):\s*(.+)$/);
        if (match) {
          return {
            name: match[1].trim(),
            priority: match[2] as 'Required' | 'Recommended' | 'Optional',
            description: match[3].trim(),
          };
        }
        return { name: line, description: '', priority: 'Optional' as const };
      });
    } else if (cardKey === 'phases') {
      const phaseBlocks = (editFormData.phases || '').split('\n\n').filter((b: string) => b.trim());
      updatedContent.phases = phaseBlocks.map((block: string) => {
        const lines = block.split('\n');
        const headerMatch = lines[0]?.match(/^(.+?)\s*\((.+?)\):/);
        const tasks = lines.slice(1).map((l: string) => l.replace(/^-\s*/, '').trim()).filter((t: string) => t);
        return {
          name: headerMatch?.[1]?.trim() || 'Phase',
          week: headerMatch?.[2]?.trim() || 'Week 1',
          tasks,
        };
      });
    }

    setAiContent(updatedContent);
    setEditingCard(null);
    setEditFormData({});
    
    toast({
      title: "Saved!",
      description: "Card content has been updated.",
    });
  };

  // Cancel inline editing
  const cancelEdit = () => {
    setEditingCard(null);
    setEditFormData({});
  };

  // Note card functions
  const addNote = (parentCard: CardKey) => {
    const parentPos = positions[parentCard];
    const parentSize = sizes[parentCard];
    const newNote: NoteCard = {
      id: `note-${Date.now()}`,
      parentCard,
      content: 'New note...',
      x: parentPos.x + parentSize.width + 40,
      y: parentPos.y + Math.random() * 100,
    };
    setNotes([...notes, newNote]);
    setEditingNote(newNote.id);
  };

  const updateNoteContent = (noteId: string, content: string) => {
    setNotes(notes.map(n => n.id === noteId ? { ...n, content } : n));
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const handleNoteMouseDown = (e: React.MouseEvent, noteId: string) => {
    // Don't start drag if clicking on textarea or button
    if ((e.target as HTMLElement).closest('textarea') || (e.target as HTMLElement).closest('button')) return;
    e.stopPropagation();
    e.preventDefault();
    setDraggingNote(noteId);
    const note = notes.find(n => n.id === noteId);
    if (note) {
      // Calculate drag start accounting for current note position and zoom
      setDragStart({ x: e.clientX - note.x * zoom, y: e.clientY - note.y * zoom });
    }
  };

  // Get connector path from parent card to note
  const getNoteConnectorPath = (note: NoteCard) => {
    const parentPos = positions[note.parentCard];
    const parentSize = sizes[note.parentCard];
    
    const x1 = parentPos.x + parentSize.width;
    const y1 = parentPos.y + parentSize.height / 2;
    const x2 = note.x;
    const y2 = note.y + 40; // Center of note card
    
    const midX = (x1 + x2) / 2;
    
    return `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
  };

  // Get note border color based on parent card
  const getNoteColor = (parentCard: CardKey) => {
    switch (parentCard) {
      case 'central': return 'border-zinc-500';
      case 'ideaFeatures': return 'border-cyan-500/50';
      case 'appType': return 'border-purple-500/50';
      case 'tools': return 'border-emerald-500/50';
      case 'backend': return 'border-rose-500/50';
      case 'phases': return 'border-amber-500/50';
      case 'courses': return 'border-indigo-500/50';
      default: return 'border-zinc-500';
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const phaseLabels: Record<number, { name: string; color: string }> = {
    1: { name: "Project Overview", color: "text-zinc-400" },
    2: { name: "Ideas & Features", color: "text-cyan-400" },
    3: { name: "Application Type", color: "text-purple-400" },
    4: { name: "Tech Stack", color: "text-emerald-400" },
    5: { name: "Backend Features", color: "text-rose-400" },
    6: { name: "Build Roadmap", color: "text-amber-400" },
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const generateCursorPrompt = () => {
    if (!aiContent) return;

    const prompt = `# Project: ${projectName}

## Overview
**Problem Statement:** ${aiContent.overview.problemStatement}
**Target Audience:** ${aiContent.overview.targetAudience}
**Unique Value:** ${aiContent.overview.uniqueValue}

## Features to Build
${aiContent.features.map(f => `- ${f.name} (${f.priority}): ${f.description}`).join('\n')}

## Application Type
**Recommended:** ${aiContent.appType.recommended}
**Reasons:**
${aiContent.appType.reasons.map(r => `- ${r}`).join('\n')}

## Tech Stack & AI Tools
${aiContent.tools.filter(t => t.recommended).map(t => `- ${t.name}: ${t.description}`).join('\n')}

## Backend Requirements
${aiContent.backend.filter(b => b.priority === 'Required').map(b => `- ${b.name}: ${b.description}`).join('\n')}

## Build Roadmap
${aiContent.phases.map((p, i) => `### Phase ${i + 1}: ${p.name} (${p.week})
${p.tasks.map(t => `- [ ] ${t}`).join('\n')}`).join('\n\n')}

---

## Instructions for Cursor

I want to build this project step by step. Please help me:

1. Start with Phase 1 setup - initialize the project structure
2. Guide me through each feature implementation
3. Help me set up the backend with Supabase
4. Suggest best practices and clean code patterns
5. Help me test and deploy when ready

Let's begin with Phase 1. What files and structure should I create first?`;

    setGeneratedPrompt(prompt);
    return prompt;
  };

  const copyPromptToClipboard = async () => {
    const prompt = generatedPrompt || generateCursorPrompt();
    if (prompt) {
      await navigator.clipboard.writeText(prompt);
      setPromptCopied(true);
      toast({
        title: "Copied!",
        description: "Cursor prompt copied to clipboard",
      });
      setTimeout(() => setPromptCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black via-zinc-950 to-black flex overflow-hidden">
      {/* Back Button */}
      <Button
        size="icon"
        variant="outline"
        className="fixed top-4 left-4 z-50 bg-zinc-900/90 border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-full shadow-md"
        onClick={() => navigate('/projects')}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      {/* Main Canvas Area */}
      <div 
        className="flex-1 relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onMouseDown={handleCanvasMouseDown}
        style={{ 
          cursor: isPanning ? "grabbing" : "grab",
          backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.08) 0, transparent 55%), radial-gradient(circle, rgba(255, 255, 255, 0.18) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 22px 22px"
        }}
      >
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
          <Button
            size="icon"
            variant="outline"
            className="bg-zinc-900/90 border-zinc-700 text-zinc-50/90 hover:bg-zinc-800 rounded-full shadow-md"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="bg-zinc-900/90 border-zinc-700 text-zinc-50/90 hover:bg-zinc-800 rounded-full shadow-md"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-zinc-900/90 border-zinc-700 text-zinc-200 hover:bg-zinc-800 text-[10px] tracking-wide rounded-full px-3"
            onClick={handleResetZoom}
          >
            {zoomLabel}
          </Button>
        </div>

        <div 
          className="absolute inset-0 p-20 transition-transform duration-150 origin-center"
          style={{ 
            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
          onMouseDown={handleCanvasMouseDown}
        >
          {/* Connector lines showing the flow between cards */}
          <svg 
            className="absolute pointer-events-none" 
            style={{ 
              top: 0, 
              left: 0, 
              width: '3000px', 
              height: '2000px',
              overflow: 'visible'
            }}
          >
            {/* Pipeline Row 1: 1 → 2 → 3 → 4 */}
            <CurvedConnector from="central" to="ideaFeatures" />
            <CurvedConnector from="ideaFeatures" to="appType" />
            <CurvedConnector from="appType" to="tools" />
            {/* Vertical connector: 4 → 5 (drop down to second row) */}
            <CurvedConnector from="tools" to="backend" />
            {/* Pipeline Row 2: 5 → 6 → 7 → 8 */}
            <CurvedConnector from="backend" to="phases" />
            <CurvedConnector from="phases" to="courses" />
            <CurvedConnector from="courses" to="prompt" />
            {/* Note connectors */}
            {notes.map(note => (
              <path
                key={`connector-${note.id}`}
                d={getNoteConnectorPath(note)}
                fill="none"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="2"
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Note Cards */}
          {notes.map(note => (
            <div
              key={note.id}
              data-note
              className={`absolute select-none ${draggingNote === note.id ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{
                left: `${note.x}px`,
                top: `${note.y}px`,
                width: '180px',
                zIndex: draggingNote === note.id ? 50 : 25,
              }}
              onMouseDown={(e) => handleNoteMouseDown(e, note.id)}
            >
              <div className={`bg-zinc-900/95 backdrop-blur-sm ${getNoteColor(note.parentCard)} border-2 rounded-lg shadow-lg p-2`}>
                <div className="flex items-center justify-between mb-1">
                  <StickyNote className="h-3 w-3 text-zinc-400" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-zinc-500 hover:text-red-400 hover:bg-red-900/30 rounded"
                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                {editingNote === note.id ? (
                  <Textarea
                    autoFocus
                    value={note.content}
                    onChange={(e) => updateNoteContent(note.id, e.target.value)}
                    onBlur={() => setEditingNote(null)}
                    onKeyDown={(e) => { if (e.key === 'Escape') setEditingNote(null); }}
                    className="bg-zinc-800 border-zinc-600 text-zinc-100 text-xs resize-none p-1"
                    rows={3}
                  />
                ) : (
                  <p 
                    className="text-xs text-zinc-300 cursor-text min-h-[40px]"
                    onClick={(e) => { e.stopPropagation(); setEditingNote(note.id); }}
                  >
                    {note.content}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Project Overview - Central Hub */}
          <div
            data-card
            className="absolute cursor-move"
            style={{
              zIndex: dragging === "central" || resizing === "central" ? 22 : 12,
              left: `${positions.central.x}px`,
              top: `${positions.central.y}px`,
              width: `${sizes.central.width}px`,
              height: `${sizes.central.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, "central")}
          >
            <Card
              className="w-full h-full bg-zinc-950/90 backdrop-blur-xl border-zinc-600/60 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl select-none relative flex flex-col"
              style={{ fontSize: `${Math.max(0.7, sizes.central.width / 280)}rem` }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-200 font-bold text-sm flex-shrink-0">1</div>
                    <div>
                      <p className="text-[0.6em] uppercase tracking-[0.2em] text-zinc-400 mb-1">
                        🎯 Project Overview
                      </p>
                      <CardTitle className="text-xl text-zinc-50 font-bold" style={{ fontSize: "1.1em" }}>
                        {projectName}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full"
                      onClick={(e) => { e.stopPropagation(); addNote('central'); }}
                      title="Add note"
                    >
                      <StickyNote className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full"
                      onClick={(e) => { e.stopPropagation(); toggleEditCard('central'); }}
                      title="Edit card"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-3 text-[0.75em] text-zinc-300 overflow-auto">
                {editingCard === 'central' ? (
                  <>
                    <div className="space-y-1">
                      <p className="text-zinc-400 font-medium text-xs">💡 Problem Statement</p>
                      <Textarea
                        value={editFormData.problemStatement || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, problemStatement: e.target.value })}
                        className="bg-zinc-800 border-zinc-600 text-zinc-100 text-sm resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-400 font-medium text-xs">👥 Target Audience</p>
                      <Textarea
                        value={editFormData.targetAudience || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, targetAudience: e.target.value })}
                        className="bg-zinc-800 border-zinc-600 text-zinc-100 text-sm resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-400 font-medium text-xs">✨ Unique Value</p>
                      <Textarea
                        value={editFormData.uniqueValue || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, uniqueValue: e.target.value })}
                        className="bg-zinc-800 border-zinc-600 text-zinc-100 text-sm resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => saveCardEdits('central')} className="flex-1 bg-green-600 hover:bg-green-700">
                        <Check className="h-3 w-3 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit} className="flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                        <X className="h-3 w-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1 p-2 bg-zinc-900/50 rounded-lg">
                      <p className="text-zinc-400 font-medium">💡 Problem Statement</p>
                      <p className="text-zinc-300 text-[0.9em]">{aiContent?.overview.problemStatement || projectDescription || 'Define the core problem your app solves'}</p>
                    </div>
                    <div className="space-y-1 p-2 bg-zinc-900/50 rounded-lg">
                      <p className="text-zinc-400 font-medium">👥 Target Audience</p>
                      <p className="text-zinc-300 text-[0.9em]">{aiContent?.overview.targetAudience || 'Who will use this app and why they need it'}</p>
                    </div>
                    <div className="space-y-1 p-2 bg-zinc-900/50 rounded-lg">
                      <p className="text-zinc-400 font-medium">✨ Unique Value</p>
                      <p className="text-zinc-300 text-[0.9em]">{aiContent?.overview.uniqueValue || 'What makes this different from existing solutions'}</p>
                    </div>
                  </>
                )}
              </CardContent>
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-zinc-700/90 hover:bg-zinc-500 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, "central")}
                style={{ borderRadius: "0 0 10px 0" }}
              />
            </Card>
          </div>
          {/* Ideas & Features */}
          <div 
            data-card
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'ideaFeatures' || resizing === 'ideaFeatures' ? 20 : 10,
              left: `${positions.ideaFeatures.x}px`,
              top: `${positions.ideaFeatures.y}px`,
              width: `${sizes.ideaFeatures.width}px`,
              height: `${sizes.ideaFeatures.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'ideaFeatures')}
          >
            <Card className="w-full h-full bg-zinc-950/80 backdrop-blur-xl border-cyan-500/35 shadow-[0_0_32px_rgba(34,211,238,0.25)] rounded-2xl select-none relative flex flex-col" style={{ fontSize: `${Math.max(0.6, sizes.ideaFeatures.width / 256)}rem` }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-cyan-500/30 flex items-center justify-center text-cyan-200 font-bold text-sm flex-shrink-0">2</div>
                    <div>
                      <p className="text-[0.6em] uppercase tracking-[0.2em] text-cyan-300/80 mb-1">
                        💡 Ideas &amp; Features
                      </p>
                      <CardTitle className="text-lg text-cyan-300" style={{ textShadow: '0 0 8px rgba(34, 211, 238, 0.8), 0 0 18px rgba(34, 211, 238, 0.6)', fontSize: '1em' }}>Core Features</CardTitle>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-cyan-400 hover:text-cyan-100 hover:bg-cyan-900/50 rounded-full"
                      onClick={(e) => { e.stopPropagation(); addNote('ideaFeatures'); }}
                      title="Add note"
                    >
                      <StickyNote className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-cyan-400 hover:text-cyan-100 hover:bg-cyan-900/50 rounded-full"
                      onClick={(e) => { e.stopPropagation(); toggleEditCard('ideaFeatures'); }}
                      title="Edit card"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                </div>
                <p className="text-xs text-zinc-400 ml-10" style={{ fontSize: '0.75em' }}>Essential features &amp; recommendations</p>
              </CardHeader>
              <CardContent className="space-y-2 flex-1 overflow-auto pr-1">
                {editingCard === 'ideaFeatures' ? (
                  <>
                    <p className="text-xs text-zinc-400">One feature per line (Name: Description)</p>
                    <Textarea
                      value={editFormData.features || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, features: e.target.value })}
                      className="bg-zinc-800 border-zinc-600 text-zinc-100 text-sm resize-none flex-1"
                      rows={8}
                      placeholder="🔐 User Auth: Sign up and login&#10;📊 Dashboard: Main interface"
                    />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => saveCardEdits('ideaFeatures')} className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                        <Check className="h-3 w-3 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit} className="flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                        <X className="h-3 w-3 mr-1" /> Cancel
                      </Button>
                </div>
                  </>
                ) : (
                  <>
                    {aiContent?.features.map((feature, index) => (
                      <div key={index} className={`space-y-1.5 p-2 rounded-lg border ${feature.priority === 'Essential' ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-zinc-900/50 border-zinc-800/50'}`}>
                        <div className={`text-sm font-semibold ${feature.priority === 'Essential' ? 'text-cyan-200' : 'text-zinc-100'}`} style={{ fontSize: '0.875em' }}>{feature.name}</div>
                        <p className="text-xs text-zinc-400" style={{ fontSize: '0.75em' }}>
                          {feature.description}
                        </p>
                        <Badge className={`text-[0.65em] ${feature.priority === 'Essential' ? 'bg-cyan-500/20 text-cyan-300' : feature.priority === 'Core' ? 'bg-zinc-600/50 text-zinc-200' : 'bg-zinc-700/50 text-zinc-300'}`}>{feature.priority}</Badge>
                </div>
                    )) || (
                      <div className="text-zinc-500 text-center py-4">Loading features...</div>
                    )}
                  </>
                )}
              </CardContent>
              <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-cyan-500/80 hover:bg-cyan-400 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, 'ideaFeatures')}
                style={{ borderRadius: '0 0 10px 0' }}
              />
            </Card>
          </div>

          {/* Type of Application */}
          <div 
            data-card
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'appType' || resizing === 'appType' ? 20 : 10,
              left: `${positions.appType.x}px`,
              top: `${positions.appType.y}px`,
              width: `${sizes.appType.width}px`,
              height: `${sizes.appType.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'appType')}
          >
            <Card className="w-full h-full bg-zinc-950/80 backdrop-blur-xl border-purple-500/35 shadow-[0_0_32px_rgba(168,85,247,0.25)] rounded-2xl select-none relative flex flex-col" style={{ fontSize: `${Math.max(0.6, sizes.appType.width / 256)}rem` }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-200 font-bold text-sm flex-shrink-0">3</div>
                    <div>
                      <p className="text-[0.6em] uppercase tracking-[0.2em] text-purple-300/80 mb-1">
                        📱 Application Type
                      </p>
                      <CardTitle className="text-lg text-purple-300" style={{ textShadow: '0 0 8px rgba(192, 132, 252, 0.8), 0 0 18px rgba(192, 132, 252, 0.6)', fontSize: '1em' }}>What to Build &amp; Why</CardTitle>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-purple-400 hover:text-purple-100 hover:bg-purple-900/50 rounded-full"
                      onClick={(e) => { e.stopPropagation(); addNote('appType'); }}
                      title="Add note"
                    >
                      <StickyNote className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-purple-400 hover:text-purple-100 hover:bg-purple-900/50 rounded-full"
                      onClick={(e) => { e.stopPropagation(); toggleEditCard('appType'); }}
                      title="Edit card"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                </div>
                <p className="text-xs text-zinc-400 ml-10" style={{ fontSize: '0.75em' }}>Platform recommendation based on your idea</p>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 overflow-auto pr-1">
                {editingCard === 'appType' ? (
                  <>
                    <div className="space-y-1">
                      <p className="text-zinc-400 font-medium text-xs">Recommended App Type</p>
                      <input
                        type="text"
                        value={editFormData.recommended || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, recommended: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-600 text-zinc-100 text-sm rounded px-2 py-1"
                      />
                </div>
                    <div className="space-y-1">
                      <p className="text-zinc-400 font-medium text-xs">Reasons (one per line)</p>
                      <Textarea
                        value={editFormData.reasons || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, reasons: e.target.value })}
                        className="bg-zinc-800 border-zinc-600 text-zinc-100 text-sm resize-none"
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => saveCardEdits('appType')} className="flex-1 bg-purple-600 hover:bg-purple-700">
                        <Check className="h-3 w-3 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit} className="flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                        <X className="h-3 w-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                      <div className="text-sm font-semibold text-purple-200 mb-2" style={{ fontSize: '0.9em' }}>✅ Recommended: {aiContent?.appType.recommended || 'Web Application'}</div>
                      <p className="text-xs text-zinc-400 mb-2" style={{ fontSize: '0.75em' }}>
                        Best choice for {projectName} because:
                      </p>
                      <ul className="text-xs text-zinc-400 space-y-1" style={{ fontSize: '0.72em' }}>
                        {aiContent?.appType.reasons.map((reason, i) => (
                          <li key={i}>• {reason}</li>
                        )) || (
                          <>
                            <li>• Cross-platform - works on any device</li>
                            <li>• No app store approval needed</li>
                          </>
                        )}
                      </ul>
                </div>
                <div className="space-y-2">
                      <p className="text-xs font-medium text-zinc-300" style={{ fontSize: '0.8em' }}>Other Options:</p>
                      {aiContent?.appType.alternatives.map((alt, i) => (
                        <div key={i} className="p-2 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                          <div className="text-sm font-medium text-zinc-300" style={{ fontSize: '0.85em' }}>{alt.name}</div>
                          <p className="text-xs text-zinc-500" style={{ fontSize: '0.7em' }}>
                            {alt.description}
                  </p>
                </div>
                      )) || (
                        <div className="text-zinc-500 text-center py-2">Loading alternatives...</div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
              <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-purple-500/80 hover:bg-purple-400 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, 'appType')}
                style={{ borderRadius: '0 0 10px 0' }}
              />
            </Card>
          </div>

          {/* Tech Stack & Tools */}
          <div 
            data-card
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'tools' || resizing === 'tools' ? 20 : 10,
              left: `${positions.tools.x}px`,
              top: `${positions.tools.y}px`,
              width: `${sizes.tools.width}px`,
              height: `${sizes.tools.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'tools')}
          >
            <Card className="w-full h-full bg-zinc-950/80 backdrop-blur-xl border-emerald-400/35 shadow-[0_0_32px_rgba(16,185,129,0.25)] rounded-2xl select-none relative flex flex-col" style={{ fontSize: `${Math.max(0.6, sizes.tools.width / 256)}rem` }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-200 font-bold text-sm flex-shrink-0">4</div>
                    <div>
                      <p className="text-[0.6em] uppercase tracking-[0.2em] text-emerald-300/80 mb-1">
                        🤖 AI Coding Tools
                      </p>
                      <CardTitle className="text-lg text-emerald-300" style={{ textShadow: '0 0 8px rgba(52, 211, 153, 0.8), 0 0 18px rgba(52, 211, 153, 0.6)', fontSize: '1em' }}>Build With AI</CardTitle>
                </div>
                </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-emerald-400 hover:text-emerald-100 hover:bg-emerald-900/50 rounded-full"
                      onClick={(e) => { e.stopPropagation(); addNote('tools'); }}
                      title="Add note"
                    >
                      <StickyNote className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-emerald-400 hover:text-emerald-100 hover:bg-emerald-900/50 rounded-full"
                      onClick={(e) => { e.stopPropagation(); toggleEditCard('tools'); }}
                      title="Edit card"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                </div>
                </div>
                <p className="text-xs text-zinc-400 ml-10" style={{ fontSize: '0.75em' }}>Best AI tools to build your app faster</p>
              </CardHeader>
              <CardContent className="space-y-2 flex-1 overflow-auto pr-1">
                {editingCard === 'tools' ? (
                  <>
                    <p className="text-xs text-zinc-400">One tool per line (Name: Description)</p>
                    <Textarea
                      value={editFormData.tools || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, tools: e.target.value })}
                      className="bg-zinc-800 border-zinc-600 text-zinc-100 text-sm resize-none flex-1"
                      rows={8}
                    />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => saveCardEdits('tools')} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                        <Check className="h-3 w-3 mr-1" /> Save
                </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit} className="flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                        <X className="h-3 w-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {aiContent?.tools.map((tool, index) => (
                      <div key={index} className={`p-2 rounded-lg border ${tool.recommended ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-900/50 border-zinc-800/50'}`}>
                        <div className={`text-sm font-${tool.recommended ? 'semibold' : 'medium'} ${tool.recommended ? 'text-emerald-200' : 'text-zinc-200'}`} style={{ fontSize: '0.85em' }}>{tool.name}</div>
                        <p className={`text-xs ${tool.recommended ? 'text-zinc-400' : 'text-zinc-500'}`} style={{ fontSize: '0.7em' }}>
                          {tool.description}
                        </p>
                        {tool.recommended && <Badge className="bg-emerald-500/20 text-emerald-300 text-[0.6em] mt-1">Recommended</Badge>}
                      </div>
                    )) || (
                      <div className="text-zinc-500 text-center py-4">Loading tools...</div>
                    )}
                  </>
                )}
              </CardContent>
              <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-emerald-400/80 hover:bg-emerald-300 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, 'tools')}
                style={{ borderRadius: '0 0 10px 0' }}
              />
            </Card>
          </div>

          {/* Phase Building / Roadmap */}
          <div 
            data-card
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'phases' || resizing === 'phases' ? 20 : 10,
              left: `${positions.phases.x}px`,
              top: `${positions.phases.y}px`,
              width: `${sizes.phases.width}px`,
              height: `${sizes.phases.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'phases')}
          >
            <Card className="w-full h-full bg-zinc-950/80 backdrop-blur-xl border-amber-400/35 shadow-[0_0_32px_rgba(251,191,36,0.25)] rounded-2xl select-none relative flex flex-col" style={{ fontSize: `${Math.max(0.6, sizes.phases.width / 256)}rem` }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-amber-500/30 flex items-center justify-center text-amber-200 font-bold text-sm flex-shrink-0">6</div>
                    <div>
                      <p className="text-[0.6em] uppercase tracking-[0.2em] text-amber-300/80 mb-1">
                        📋 Build Roadmap
                      </p>
                      <CardTitle className="text-lg text-amber-300" style={{ textShadow: '0 0 8px rgba(251, 191, 36, 0.8), 0 0 18px rgba(251, 191, 36, 0.6)', fontSize: '1em' }}>Phase Building</CardTitle>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-amber-400 hover:text-amber-100 hover:bg-amber-900/50 rounded-full"
                      onClick={(e) => { e.stopPropagation(); addNote('phases'); }}
                      title="Add note"
                    >
                      <StickyNote className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-amber-400 hover:text-amber-100 hover:bg-amber-900/50 rounded-full"
                      onClick={(e) => { e.stopPropagation(); toggleEditCard('phases'); }}
                      title="Edit card"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                </div>
                <p className="text-xs text-zinc-400 ml-10" style={{ fontSize: '0.75em' }}>Step-by-step development roadmap</p>
              </CardHeader>
              <CardContent className="space-y-2 flex-1 overflow-auto pr-1">
                {editingCard === 'phases' ? (
                  <>
                    <p className="text-xs text-zinc-400">Phase Name (Week):\n- Task 1\n- Task 2</p>
                    <Textarea
                      value={editFormData.phases || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, phases: e.target.value })}
                      className="bg-zinc-800 border-zinc-600 text-zinc-100 text-sm resize-none flex-1"
                      rows={10}
                    />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => saveCardEdits('phases')} className="flex-1 bg-amber-600 hover:bg-amber-700">
                        <Check className="h-3 w-3 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit} className="flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                        <X className="h-3 w-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {aiContent?.phases.map((phase, index) => (
                      <div key={index} className={`p-2 rounded-lg border ${index === 0 ? 'bg-amber-500/15 border-amber-500/40' : 'bg-zinc-900/50 border-zinc-800/50'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`${index === 0 ? 'text-amber-300' : 'text-zinc-400'} font-bold text-[0.75em]`}>{index + 1}</span>
                          <div className={`text-sm font-${index === 0 ? 'semibold' : 'medium'} ${index === 0 ? 'text-amber-200' : 'text-zinc-200'}`} style={{ fontSize: '0.85em' }}>{phase.name}</div>
                          <Badge className={`text-[0.55em] ml-auto ${index === 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-700/50 text-zinc-300'}`}>{phase.week}</Badge>
                        </div>
                        <ul className={`text-xs space-y-0.5 ml-4 ${index === 0 ? 'text-zinc-400' : 'text-zinc-500'}`} style={{ fontSize: '0.7em' }}>
                          {phase.tasks.map((task, i) => (
                            <li key={i}>☐ {task}</li>
                          ))}
                        </ul>
                      </div>
                    )) || (
                      <div className="text-zinc-500 text-center py-4">Loading phases...</div>
                    )}
                  </>
                )}
              </CardContent>
              <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-amber-400/80 hover:bg-amber-300 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, 'phases')}
                style={{ borderRadius: '0 0 10px 0' }}
              />
            </Card>
                </div>

          {/* Backend Features */}
          <div 
            data-card
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'backend' || resizing === 'backend' ? 20 : 10,
              left: `${positions.backend.x}px`,
              top: `${positions.backend.y}px`,
              width: `${sizes.backend.width}px`,
              height: `${sizes.backend.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'backend')}
          >
            <Card className="w-full h-full bg-zinc-950/80 backdrop-blur-xl border-rose-500/35 shadow-[0_0_32px_rgba(244,63,94,0.25)] rounded-2xl select-none relative flex flex-col" style={{ fontSize: `${Math.max(0.6, sizes.backend.width / 256)}rem` }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-rose-500/30 flex items-center justify-center text-rose-200 font-bold text-sm flex-shrink-0">5</div>
                    <div>
                      <p className="text-[0.6em] uppercase tracking-[0.2em] text-rose-300/80 mb-1">
                        ⚙️ Backend Requirements
                      </p>
                      <CardTitle className="text-lg text-rose-300" style={{ textShadow: '0 0 8px rgba(244, 63, 94, 0.8), 0 0 18px rgba(244, 63, 94, 0.6)', fontSize: '1em' }}>Backend Features</CardTitle>
                </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-rose-400 hover:text-rose-100 hover:bg-rose-900/50 rounded-full"
                      onClick={(e) => { e.stopPropagation(); addNote('backend'); }}
                      title="Add note"
                    >
                      <StickyNote className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-rose-400 hover:text-rose-100 hover:bg-rose-900/50 rounded-full"
                      onClick={(e) => { e.stopPropagation(); toggleEditCard('backend'); }}
                      title="Edit card"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 ml-10" style={{ fontSize: '0.75em' }}>Essential backend services for your app</p>
              </CardHeader>
              <CardContent className="space-y-2 flex-1 overflow-auto pr-1">
                {editingCard === 'backend' ? (
                  <>
                    <p className="text-xs text-zinc-400">Format: Name (Priority): Description</p>
                    <Textarea
                      value={editFormData.backend || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, backend: e.target.value })}
                      className="bg-zinc-800 border-zinc-600 text-zinc-100 text-sm resize-none flex-1"
                      rows={8}
                      placeholder="🔐 Authentication (Required): User sign-up, login"
                    />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => saveCardEdits('backend')} className="flex-1 bg-rose-600 hover:bg-rose-700">
                        <Check className="h-3 w-3 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit} className="flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                        <X className="h-3 w-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {aiContent?.backend.map((item, index) => (
                      <div key={index} className={`p-2 rounded-lg border ${item.priority === 'Required' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-zinc-900/50 border-zinc-800/50'}`}>
                        <div className={`text-sm font-${item.priority === 'Required' ? 'semibold' : 'medium'} ${item.priority === 'Required' ? 'text-rose-200' : 'text-zinc-200'}`} style={{ fontSize: '0.85em' }}>{item.name}</div>
                        <p className={`text-xs ${item.priority === 'Required' ? 'text-zinc-400' : 'text-zinc-500'}`} style={{ fontSize: '0.7em' }}>
                          {item.description}
                        </p>
                        <Badge className={`text-[0.6em] mt-1 ${item.priority === 'Required' ? 'bg-rose-500/20 text-rose-300' : item.priority === 'Recommended' ? 'bg-zinc-600/50 text-zinc-200' : 'bg-zinc-700/50 text-zinc-300'}`}>{item.priority}</Badge>
                </div>
                    )) || (
                      <div className="text-zinc-500 text-center py-4">Loading backend features...</div>
                    )}
                  </>
                )}
              </CardContent>
              <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-rose-500/80 hover:bg-rose-400 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, 'backend')}
                style={{ borderRadius: '0 0 10px 0' }}
              />
            </Card>
          </div>

          {/* Course Videos */}
          <div 
            data-card
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'courses' || resizing === 'courses' ? 20 : 10,
              left: `${positions.courses.x}px`,
              top: `${positions.courses.y}px`,
              width: `${sizes.courses.width}px`,
              height: `${sizes.courses.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'courses')}
          >
            <Card className="w-full h-full bg-zinc-950/80 backdrop-blur-xl border-indigo-500/35 shadow-[0_0_32px_rgba(99,102,241,0.25)] rounded-2xl select-none relative flex flex-col" style={{ fontSize: `${Math.max(0.6, sizes.courses.width / 256)}rem` }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-200 font-bold text-sm flex-shrink-0">7</div>
                    <div>
                      <p className="text-[0.6em] uppercase tracking-[0.2em] text-indigo-300/80 mb-1">
                        🎬 Learning Path
                      </p>
                      <CardTitle className="text-lg text-indigo-300" style={{ textShadow: '0 0 8px rgba(99, 102, 241, 0.8), 0 0 18px rgba(99, 102, 241, 0.6)', fontSize: '1em' }}>Course Videos to Follow</CardTitle>
                </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-indigo-400 hover:text-indigo-100 hover:bg-indigo-900/50 rounded-full"
                      onClick={(e) => { e.stopPropagation(); addNote('courses'); }}
                      title="Add note"
                    >
                      <StickyNote className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-indigo-400 hover:text-indigo-100 hover:bg-indigo-900/50 rounded-full"
                      onClick={(e) => { e.stopPropagation(); toggleEditCard('courses'); }}
                      title="Edit card"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 ml-10" style={{ fontSize: '0.75em' }}>Recommended tutorials for your project</p>
              </CardHeader>
              <CardContent className="space-y-2 flex-1 overflow-auto pr-1">
                {editingCard === 'courses' ? (
                  <>
                    <p className="text-xs text-zinc-400">Add course links or notes</p>
                    <Textarea
                      value={editFormData.courses || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, courses: e.target.value })}
                      className="bg-zinc-800 border-zinc-600 text-zinc-100 text-sm resize-none flex-1"
                      rows={8}
                      placeholder="Add course recommendations or tutorial links here..."
                    />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => saveCardEdits('courses')} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                        <Check className="h-3 w-3 mr-1" /> Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit} className="flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                        <X className="h-3 w-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  </>
                ) : aiContent?.recommendedCourses && aiContent.recommendedCourses.length > 0 ? (
                <div className="space-y-2">
                    {aiContent.recommendedCourses.map((course, index) => (
                      <div key={index} className="p-2 bg-indigo-900/30 rounded-lg border border-indigo-500/20">
                        <p className="text-sm text-indigo-200 font-medium" style={{ fontSize: '0.85em' }}>{course.title}</p>
                        <p className="text-xs text-zinc-400 mt-0.5" style={{ fontSize: '0.7em' }}>{course.description}</p>
                      </div>
                    ))}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/30"
                      onClick={() => navigate('/courses')}
                      style={{ fontSize: '0.8em' }}
                    >
                      View All Courses →
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-zinc-500">
                      <div className="text-4xl mb-3">🎥</div>
                      <p className="text-sm">Course recommendations coming soon</p>
                      <p className="text-xs mt-1 text-zinc-600">Click the pencil to add your own</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-indigo-500/80 hover:bg-indigo-400 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, 'courses')}
                style={{ borderRadius: '0 0 10px 0' }}
              />
            </Card>
          </div>

          {/* Cursor Prompt Generator */}
          <div 
            data-card
            className="absolute cursor-move"
            style={{ 
              zIndex: dragging === 'prompt' || resizing === 'prompt' ? 20 : 10,
              left: `${positions.prompt.x}px`,
              top: `${positions.prompt.y}px`,
              width: `${sizes.prompt.width}px`,
              height: `${sizes.prompt.height}px`,
            }}
            onMouseDown={(e) => handleMouseDown(e, 'prompt')}
          >
            <Card className="w-full h-full bg-zinc-950/80 backdrop-blur-xl border-green-500/35 shadow-[0_0_32px_rgba(34,197,94,0.25)] rounded-2xl select-none relative flex flex-col" style={{ fontSize: `${Math.max(0.6, sizes.prompt.width / 256)}rem` }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-green-500/30 flex items-center justify-center text-green-200 font-bold text-sm flex-shrink-0">8</div>
                    <div>
                      <p className="text-[0.6em] uppercase tracking-[0.2em] text-green-300/80 mb-1">
                        🚀 Start Building
                      </p>
                      <CardTitle className="text-lg text-green-300" style={{ textShadow: '0 0 8px rgba(34, 197, 94, 0.8), 0 0 18px rgba(34, 197, 94, 0.6)', fontSize: '1em' }}>
                        {aiContent?.recommendedAiTool?.name || 'AI'} Prompt
                      </CardTitle>
                </div>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 ml-10" style={{ fontSize: '0.75em' }}>Generate a prompt for {aiContent?.recommendedAiTool?.name || 'your AI tool'}</p>
              </CardHeader>
              <CardContent className="space-y-3 flex-1 overflow-auto pr-1">
                <div className="text-center py-2">
                  <div className="text-4xl mb-3">{aiContent?.recommendedAiTool?.icon || '🖥️'}</div>
                  <p className="text-sm text-zinc-300 mb-2">Ready to build with {aiContent?.recommendedAiTool?.name || 'AI'}?</p>
                  <p className="text-xs text-zinc-500 mb-4">
                    {aiContent?.recommendedAiTool?.description || 'Generate a detailed prompt based on your whiteboard.'}
                  </p>
                </div>
                
                <Button 
                  onClick={copyPromptToClipboard}
                  disabled={!aiContent}
                  className={`w-full py-6 text-base font-semibold transition-all ${
                    promptCopied 
                      ? 'bg-green-600 hover:bg-green-600' 
                      : 'bg-green-500 hover:bg-green-400'
                  } text-white`}
                  style={{ fontSize: '0.9em' }}
                >
                  {promptCopied ? '✓ Copied to Clipboard!' : `📋 Copy ${aiContent?.recommendedAiTool?.name || 'AI'} Prompt`}
                </Button>

                {generatedPrompt && (
                  <div className="mt-3 p-3 bg-zinc-900/80 rounded-lg border border-zinc-700/50 max-h-40 overflow-auto">
                    <p className="text-[0.65em] text-zinc-500 mb-1">Preview:</p>
                    <pre className="text-[0.6em] text-zinc-400 whitespace-pre-wrap font-mono">
                      {generatedPrompt.slice(0, 300)}...
                    </pre>
                  </div>
                )}

                <div className="text-xs text-zinc-500 text-center mt-2" style={{ fontSize: '0.7em' }}>
                  <p>Includes: Project overview, features, tech stack, backend requirements, and build phases</p>
                </div>
              </CardContent>
              <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-green-500/80 hover:bg-green-400 transition-colors"
                onMouseDown={(e) => handleResizeMouseDown(e, 'prompt')}
                style={{ borderRadius: '0 0 10px 0' }}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Reopen Sidebar Button */}
      {!sidebarOpen && (
        <Button
          size="icon"
          variant="outline"
          className="fixed top-4 right-4 z-50 bg-zinc-900/90 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          onClick={() => setSidebarOpen(true)}
        >
          <PanelRightOpen className="h-4 w-4" />
        </Button>
      )}

      {/* To-Do List Sidebar */}
      {sidebarOpen && (
        <div className="w-80 border-l border-zinc-800 bg-zinc-900 flex flex-col">
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-zinc-400">{projectName}</h3>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">✅</span>
              <h2 className="font-semibold text-zinc-100">Project To-Do List</h2>
            </div>
            <p className="text-xs text-zinc-500">
              Track your progress building your app
            </p>
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                <span>{completedCount} of {totalCount} completed</span>
                <span className="font-medium text-zinc-200">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((phase) => (
                <div key={phase}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      phase === 1 ? 'bg-zinc-700 text-zinc-200' :
                      phase === 2 ? 'bg-cyan-500/30 text-cyan-200' :
                      phase === 3 ? 'bg-purple-500/30 text-purple-200' :
                      phase === 4 ? 'bg-emerald-500/30 text-emerald-200' :
                      phase === 5 ? 'bg-rose-500/30 text-rose-200' :
                      'bg-amber-500/30 text-amber-200'
                    }`}>{phase}</div>
                    <span className={`text-xs font-medium ${phaseLabels[phase].color}`}>
                      {phaseLabels[phase].name}
                    </span>
                  </div>
                  <div className="space-y-1 ml-7">
                    {todos.filter(t => t.phase === phase).map((todo) => (
                      <div
                        key={todo.id}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                          todo.completed 
                            ? 'bg-zinc-800/30 opacity-60' 
                            : 'bg-zinc-800/50 hover:bg-zinc-800'
                        }`}
                        onClick={() => toggleTodo(todo.id)}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          todo.completed 
                            ? 'bg-emerald-500 border-emerald-500' 
                            : 'border-zinc-600 hover:border-zinc-400'
                        }`}>
                          {todo.completed && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-xs ${todo.completed ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                          {todo.text}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-zinc-800">
            <div className="text-center">
              {progressPercent === 100 ? (
                <div className="text-emerald-400 font-medium text-sm">
                  🎉 All tasks completed! Ready to launch!
          </div>
              ) : (
                <div className="text-zinc-500 text-xs">
                  Complete all tasks to finish your project
                </div>
              )}
          </div>
        </div>
        </div>
      )}

    </div>
  );
};

export default ProjectView;

