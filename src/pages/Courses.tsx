import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Play, BookOpen, Smartphone, Globe, Briefcase, Megaphone } from "lucide-react";

// Course structure from document
interface CourseItem {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
}

interface SubCategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
  courses: CourseItem[];
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  subCategories?: SubCategory[];
  courses?: CourseItem[];
}

// Static course data based on the document
const COURSE_SECTIONS: Section[] = [
  {
    id: "fundamentals",
    title: "Fundamentals",
    icon: <BookOpen className="w-5 h-5" />,
    description: "Essential knowledge to get started",
    color: "from-blue-500 to-cyan-500",
    courses: [
      { id: "fund-1", title: "Basic knowledge you need", description: "Core concepts and terminology you'll use throughout your journey" },
      { id: "fund-2", title: "Why it's a gold mine", description: "Understanding the opportunity and potential of building apps" },
    ],
  },
  {
    id: "build-work-properly",
    title: "Build and Work Properly",
    icon: <BookOpen className="w-5 h-5" />,
    description: "Productivity and mindset for success",
    color: "from-purple-500 to-pink-500",
    courses: [
      { id: "work-1", title: "Deep work & lofi beats", description: "Focus techniques and creating the right environment" },
      { id: "work-2", title: "Schedule & consistency", description: "Building habits and maintaining momentum" },
      { id: "work-3", title: "Mindset", description: "Developing the right mental framework for building" },
      { id: "work-4", title: "Planning and tracking", description: "Setting goals and measuring progress effectively" },
    ],
  },
  {
    id: "how-to-build",
    title: "How to Build",
    icon: <Briefcase className="w-5 h-5" />,
    description: "Technical guides for different app types",
    color: "from-emerald-500 to-green-500",
    subCategories: [
      {
        id: "mobile-app",
        name: "Mobile App",
        icon: <Smartphone className="w-4 h-4" />,
        courses: [
          { id: "mobile-1", title: "Setting up your mobile development environment", description: "Tools and setup for mobile app development" },
          { id: "mobile-2", title: "Building your first mobile app with AI", description: "Step-by-step guide using AI tools" },
          { id: "mobile-3", title: "Publishing to App Store & Play Store", description: "Deployment and submission process" },
          { id: "mobile-4", title: "Mobile monetization strategies", description: "In-app purchases, subscriptions, and ads" },
        ],
      },
      {
        id: "web-app",
        name: "Web App",
        icon: <Globe className="w-4 h-4" />,
        courses: [
          { id: "web-1", title: "Getting started with Loveable", description: "Building your first web app with AI" },
          { id: "web-2", title: "Connecting Supabase backend", description: "Database, auth, and storage setup" },
          { id: "web-3", title: "Deploying to production", description: "Vercel, Netlify, and custom domains" },
          { id: "web-4", title: "Adding payments with Stripe", description: "Monetizing your web application" },
        ],
      },
      {
        id: "saas",
        name: "SaaS",
        icon: <Briefcase className="w-4 h-4" />,
        courses: [
          { id: "saas-1", title: "SaaS architecture basics", description: "Multi-tenant design and best practices" },
          { id: "saas-2", title: "Building subscription systems", description: "Recurring payments and plan management" },
          { id: "saas-3", title: "User management & teams", description: "Organizations, roles, and permissions" },
          { id: "saas-4", title: "Scaling your SaaS", description: "Performance, analytics, and growth" },
        ],
      },
    ],
  },
  {
    id: "how-to-market",
    title: "How to Market",
    icon: <Megaphone className="w-5 h-5" />,
    description: "Getting users and growing your app",
    color: "from-amber-500 to-orange-500",
    courses: [
      { id: "market-1", title: "TikTok & Instagram", description: "Short-form video marketing strategies" },
      { id: "market-2", title: "Reddit", description: "Community-driven growth and authentic engagement" },
      { id: "market-3", title: "YouTube", description: "Long-form content and building authority" },
      { id: "market-4", title: "Paid ads", description: "Facebook, Google, and TikTok advertising" },
    ],
  },
];

const Courses = () => {
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id || null);

    // Load from localStorage for now
    const saved = localStorage.getItem('course-progress');
    if (saved) {
      setCompletedCourses(new Set(JSON.parse(saved)));
    }
  };

  const toggleCourse = (courseId: string) => {
    const newCompleted = new Set(completedCourses);
    if (newCompleted.has(courseId)) {
      newCompleted.delete(courseId);
    } else {
      newCompleted.add(courseId);
    }
    setCompletedCourses(newCompleted);
    localStorage.setItem('course-progress', JSON.stringify([...newCompleted]));
    
    if (!completedCourses.has(courseId)) {
      toast({
        title: "Progress saved!",
        description: "Course marked as complete",
      });
    }
  };

  const getSectionProgress = (section: Section) => {
    let total = 0;
    let completed = 0;
    
    if (section.courses) {
      total += section.courses.length;
      completed += section.courses.filter(c => completedCourses.has(c.id)).length;
    }
    if (section.subCategories) {
      section.subCategories.forEach(sub => {
        total += sub.courses.length;
        completed += sub.courses.filter(c => completedCourses.has(c.id)).length;
      });
    }
    
    return { total, completed, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const totalProgress = () => {
    let total = 0;
    let completed = 0;
    COURSE_SECTIONS.forEach(section => {
      const progress = getSectionProgress(section);
      total += progress.total;
      completed += progress.completed;
    });
    return { total, completed, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const overall = totalProgress();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Course Library</h1>
          <p className="text-muted-foreground mb-4">Master the skills to build and launch your apps</p>
          
          {/* Overall Progress */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {overall.completed} / {overall.total} lessons completed
                </span>
              </div>
              <Progress value={overall.percentage} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {overall.percentage === 100 ? "🎉 Congratulations! You've completed all courses!" : `${Math.round(overall.percentage)}% complete`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course Sections */}
        <Accordion type="multiple" defaultValue={["fundamentals"]} className="space-y-4">
          {COURSE_SECTIONS.map((section) => {
            const progress = getSectionProgress(section);
            
            return (
              <AccordionItem key={section.id} value={section.id} className="border rounded-xl overflow-hidden">
                <Card className="border-0">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    <CardHeader className="p-0 w-full">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center text-white`}>
                            {section.icon}
                          </div>
                          <div className="text-left">
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                            <CardDescription className="text-sm mt-0.5">{section.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {progress.percentage === 100 && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {progress.completed}/{progress.total}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={progress.percentage} className="mt-4" />
                    </CardHeader>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-4">
                      {/* Direct courses (no subcategories) */}
                      {section.courses && (
                        <div className="space-y-2">
                          {section.courses.map((course) => (
                            <div
                              key={course.id}
                              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                                completedCourses.has(course.id) 
                                  ? 'bg-green-500/10 border-green-500/30' 
                                  : 'bg-card hover:bg-accent/50'
                              }`}
                            >
                              <Checkbox
                                checked={completedCourses.has(course.id)}
                                onCheckedChange={() => toggleCourse(course.id)}
                                className="mt-0.5"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className={`font-medium ${completedCourses.has(course.id) ? 'line-through text-muted-foreground' : ''}`}>
                                    {course.title}
                                  </h4>
                                  {course.videoUrl && <Play className="w-4 h-4 text-primary" />}
                                </div>
                                {course.description && (
                                  <p className="text-sm text-muted-foreground mt-0.5">{course.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Subcategories */}
                      {section.subCategories && (
                        <div className="space-y-4">
                          {section.subCategories.map((subCat) => {
                            const subCompleted = subCat.courses.filter(c => completedCourses.has(c.id)).length;
                            return (
                              <div key={subCat.id} className="border rounded-lg overflow-hidden">
                                <div className="bg-muted/50 px-4 py-3 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {subCat.icon}
                                    <span className="font-medium">{subCat.name}</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {subCompleted}/{subCat.courses.length}
                                  </Badge>
                                </div>
                                <div className="p-2 space-y-1">
                                  {subCat.courses.map((course) => (
                                    <div
                                      key={course.id}
                                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                                        completedCourses.has(course.id) 
                                          ? 'bg-green-500/10' 
                                          : 'hover:bg-accent/50'
                                      }`}
                                    >
                                      <Checkbox
                                        checked={completedCourses.has(course.id)}
                                        onCheckedChange={() => toggleCourse(course.id)}
                                        className="mt-0.5"
                                      />
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <h4 className={`font-medium text-sm ${completedCourses.has(course.id) ? 'line-through text-muted-foreground' : ''}`}>
                                            {course.title}
                                          </h4>
                                          {course.videoUrl && <Play className="w-3 h-3 text-primary" />}
                                        </div>
                                        {course.description && (
                                          <p className="text-xs text-muted-foreground mt-0.5">{course.description}</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Coming Soon Note */}
        <Card className="mt-6 bg-muted/50">
          <CardContent className="py-4 text-center">
            <p className="text-muted-foreground text-sm">
              🎬 Video content coming soon! Check back regularly for new lessons.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Courses;
