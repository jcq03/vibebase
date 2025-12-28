import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfDay, endOfDay, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Plus, Users, Video, Clock, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Call {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  meeting_link: string | null;
  max_participants: number;
  google_calendar_event_id: string | null;
  user_id: string;
  participant_count?: number;
  is_joined?: boolean;
}

// Admin email - only this user can schedule calls
const ADMIN_EMAIL = "jordancquirk@gmail.com";

const LiveCalls = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calls, setCalls] = useState<Call[]>([]);
  const [daysCalls, setDaysCalls] = useState<Call[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("10");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user?.id || null);
      setCurrentUserEmail(user?.email || null);
      setIsAdmin(user?.email === ADMIN_EMAIL);
    };
    getUser();
  }, []);

  useEffect(() => {
    fetchCalls();
  }, [selectedDate]);

  const fetchCalls = async () => {
    const startOfDayTime = startOfDay(selectedDate).toISOString();
    const endOfDayTime = endOfDay(selectedDate).toISOString();

    const { data: callsData, error } = await supabase
      .from("calls")
      .select(`
        *,
        call_participants(count)
      `)
      .gte("start_time", startOfDayTime)
      .lte("start_time", endOfDayTime)
      .order("start_time", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch calls",
        variant: "destructive",
      });
      return;
    }

    // Check which calls the user has joined
    const callsWithParticipation = await Promise.all(
      (callsData || []).map(async (call) => {
        const { data: participation } = await supabase
          .from("call_participants")
          .select("id")
          .eq("call_id", call.id)
          .eq("user_id", currentUser || "")
          .single();

        return {
          ...call,
          participant_count: call.call_participants?.[0]?.count || 0,
          is_joined: !!participation,
        };
      })
    );

    setDaysCalls(callsWithParticipation);
  };

  const fetchAllCalls = async () => {
    const { data, error } = await supabase
      .from("calls")
      .select("*")
      .gte("start_time", new Date().toISOString())
      .order("start_time", { ascending: true });

    if (!error && data) {
      setCalls(data);
    }
  };

  useEffect(() => {
    fetchAllCalls();
  }, []);

  const createCall = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to create a call",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("calls").insert({
      user_id: currentUser,
      title,
      description,
      start_time: startTime,
      end_time: endTime,
      meeting_link: meetingLink,
      max_participants: parseInt(maxParticipants),
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create call",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Call created successfully",
    });

    // Reset form
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setMeetingLink("");
    setMaxParticipants("10");
    setIsCreateDialogOpen(false);

    // Refresh calls
    fetchCalls();
    fetchAllCalls();
  };

  const joinCall = async (callId: string) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to join a call",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("call_participants").insert({
      call_id: callId,
      user_id: currentUser,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to join call",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "You've joined the call",
    });

    fetchCalls();
  };

  const leaveCall = async (callId: string) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from("call_participants")
      .delete()
      .eq("call_id", callId)
      .eq("user_id", currentUser);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to leave call",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "You've left the call",
    });

    fetchCalls();
  };

  const getDaysWithCalls = () => {
    const daysWithCalls = new Set();
    calls.forEach((call) => {
      const callDate = format(parseISO(call.start_time), "yyyy-MM-dd");
      daysWithCalls.add(callDate);
    });
    return daysWithCalls;
  };

  const daysWithCalls = getDaysWithCalls();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Live Calls
            </h1>
            <p className="text-muted-foreground">Schedule and join weekly calls with the community</p>
          </div>

          {isAdmin && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Schedule Call
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule a New Call</DialogTitle>
                <DialogDescription>
                  Create a call that others can join. Add Google Meet, Zoom, or any other meeting link.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={createCall} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Call Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Weekly Team Sync"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What will you discuss?"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="meetingLink">Meeting Link (Optional)</Label>
                  <Input
                    id="meetingLink"
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                  />
                </div>

                <div>
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    min="2"
                    max="100"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Call</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          )}
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Calls</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                  <CardDescription>Click a date to see scheduled calls</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                    modifiers={{
                      hasCall: (date) => daysWithCalls.has(format(date, "yyyy-MM-dd")),
                    }}
                    modifiersStyles={{
                      hasCall: {
                        fontWeight: "bold",
                        textDecoration: "underline",
                      },
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Calls on {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
                  <CardDescription>
                    {daysCalls.length === 0 ? "No calls scheduled for this day" : `${daysCalls.length} call(s) scheduled`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {daysCalls.map((call) => (
                      <Card key={call.id} className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-1">{call.title}</h3>
                              {call.description && (
                                <p className="text-sm text-muted-foreground mb-3">{call.description}</p>
                              )}
                              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {format(parseISO(call.start_time), "h:mm a")} - {format(parseISO(call.end_time), "h:mm a")}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {call.participant_count || 0} / {call.max_participants} participants
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {call.meeting_link && (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a href={call.meeting_link} target="_blank" rel="noopener noreferrer">
                                  <Video className="h-4 w-4 mr-2" />
                                  Join Meeting
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </Button>
                            )}

                            {call.is_joined ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => leaveCall(call.id)}
                              >
                                Leave Call
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => joinCall(call.id)}
                                disabled={(call.participant_count || 0) >= call.max_participants}
                              >
                                {(call.participant_count || 0) >= call.max_participants ? "Full" : "Join Call"}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Google Calendar Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your Google Calendar to automatically sync your calls and get reminders.
                </p>
                <Button variant="outline" disabled>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect Google Calendar (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Upcoming Calls</CardTitle>
                <CardDescription>Browse all scheduled calls across all dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calls.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No upcoming calls scheduled</p>
                  ) : (
                    calls.map((call) => (
                      <Card key={call.id} className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-1">{call.title}</h3>
                              {call.description && (
                                <p className="text-sm text-muted-foreground mb-3">{call.description}</p>
                              )}
                              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="h-4 w-4" />
                                  {format(parseISO(call.start_time), "MMM d, yyyy")}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {format(parseISO(call.start_time), "h:mm a")}
                                </div>
                              </div>
                            </div>
                            {call.meeting_link && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={call.meeting_link} target="_blank" rel="noopener noreferrer">
                                  <Video className="h-4 w-4 mr-2" />
                                  Join
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LiveCalls;