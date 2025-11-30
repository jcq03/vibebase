import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle2, ChevronDown, Play } from "lucide-react";

interface Course {
  id: string;
  title: string;
  section: string;
  description: string | null;
  video_url: string | null;
  order_index: number;
}

interface UserProgress {
  course_id: string;
  completed: boolean;
}

const SECTIONS = ["Fundamentals", "Build Work Properly", "How to Build", "How to Market"];

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .order("section")
        .order("order_index");

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

      // Fetch user progress if logged in
      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from("user_course_progress")
          .select("course_id, completed")
          .eq("user_id", user.id);

        if (progressError) throw progressError;
        setProgress(progressData || []);
      }
    } catch (error: any) {
      toast({
        title: "Error loading courses",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCourseCompletion = async (courseId: string, currentlyCompleted: boolean) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to track your progress",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentlyCompleted) {
        // Delete progress
        const { error } = await supabase
          .from("user_course_progress")
          .delete()
          .eq("user_id", userId)
          .eq("course_id", courseId);

        if (error) throw error;

        setProgress(progress.filter(p => p.course_id !== courseId));
      } else {
        // Insert or update progress
        const { error } = await supabase
          .from("user_course_progress")
          .upsert({
            user_id: userId,
            course_id: courseId,
            completed: true,
            completed_at: new Date().toISOString(),
          });

        if (error) throw error;

        setProgress([...progress.filter(p => p.course_id !== courseId), { course_id: courseId, completed: true }]);
      }
    } catch (error: any) {
      toast({
        title: "Error updating progress",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isCourseCompleted = (courseId: string) => {
    return progress.some(p => p.course_id === courseId && p.completed);
  };

  const getSectionProgress = (section: string) => {
    const sectionCourses = courses.filter(c => c.section === section);
    const completedCount = sectionCourses.filter(c => isCourseCompleted(c.id)).length;
    return sectionCourses.length > 0 ? (completedCount / sectionCourses.length) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Courses</h1>
        <p className="text-muted-foreground">Track your learning progress across all sections</p>
      </div>

      <Accordion type="multiple" className="space-y-4">
        {SECTIONS.map((section) => {
          const sectionCourses = courses.filter(c => c.section === section);
          const sectionProgress = getSectionProgress(section);
          
          return (
            <AccordionItem key={section} value={section} className="border rounded-xl overflow-hidden">
              <Card className="border-0 rounded-xl">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <CardHeader className="p-0 w-full">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">{section}</CardTitle>
                        {sectionProgress === 100 && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {sectionCourses.filter(c => isCourseCompleted(c.id)).length} / {sectionCourses.length} completed
                      </CardDescription>
                    </div>
                    <Progress value={sectionProgress} className="mt-3" />
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {sectionCourses.map((course) => {
                        const completed = isCourseCompleted(course.id);
                        return (
                          <Collapsible key={course.id}>
                            <div className="rounded-lg border bg-card">
                              <div className="flex items-start gap-3 p-4">
                                <Checkbox
                                  checked={completed}
                                  onCheckedChange={() => toggleCourseCompletion(course.id, completed)}
                                  className="mt-1"
                                />
                                <CollapsibleTrigger className="flex items-center justify-between w-full text-left group">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h3 className={`font-medium ${completed ? 'line-through text-muted-foreground' : ''}`}>
                                        {course.title}
                                      </h3>
                                      {course.video_url && (
                                        <Play className="w-4 h-4 text-primary" />
                                      )}
                                    </div>
                                    {course.description && (
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {course.description}
                                      </p>
                                    )}
                                  </div>
                                  <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 ml-2 shrink-0" />
                                </CollapsibleTrigger>
                              </div>
                              <CollapsibleContent>
                                <div className="px-4 pb-4 pt-0">
                                  {course.video_url ? (
                                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                                      <iframe
                                        src={course.video_url}
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      />
                                    </div>
                                  ) : (
                                    <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                                      <p className="text-muted-foreground">No video available</p>
                                    </div>
                                  )}
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        );
                      })}
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default Courses;
