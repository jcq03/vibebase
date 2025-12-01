import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const appIdeas = [
  {
    idea: "Task Management App",
    description: "A collaborative project management tool for remote teams with real-time updates and time tracking",
    features: ["Kanban boards", "Time tracking", "Team collaboration"]
  },
  {
    idea: "Fitness Tracker",
    description: "Personal fitness app with workout plans, nutrition tracking, and progress analytics",
    features: ["Workout logging", "Calorie counter", "Progress charts"]
  },
  {
    idea: "Recipe Organizer",
    description: "Digital cookbook to save, organize, and share your favorite recipes with meal planning",
    features: ["Recipe search", "Meal planner", "Shopping lists"]
  },
  {
    idea: "Budget Manager",
    description: "Personal finance app to track expenses, set budgets, and analyze spending habits",
    features: ["Expense tracking", "Budget alerts", "Financial reports"]
  },
  {
    idea: "Language Learning Platform",
    description: "Interactive app for learning new languages with gamification and daily practice",
    features: ["Flashcards", "Speaking practice", "Progress tracking"]
  },
  {
    idea: "Meditation Guide",
    description: "Mindfulness and meditation app with guided sessions and relaxation techniques",
    features: ["Guided meditations", "Timer", "Daily reminders"]
  },
  {
    idea: "Habit Tracker",
    description: "Build better habits with daily tracking, streaks, and motivational insights",
    features: ["Daily check-ins", "Streak counter", "Habit analytics"]
  },
  {
    idea: "Book Club Manager",
    description: "Organize virtual book clubs with reading schedules and discussion forums",
    features: ["Reading lists", "Discussion boards", "Member management"]
  },
  {
    idea: "Pet Care Assistant",
    description: "Track your pet's health, vet appointments, and daily care routines",
    features: ["Vet reminders", "Health records", "Care schedules"]
  },
  {
    idea: "Home Inventory",
    description: "Catalog your belongings for insurance, moving, or organization purposes",
    features: ["Item photos", "Value tracking", "Room organization"]
  }
];

const Ideas = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">30+ Ready Ideas</h1>
          <p className="text-muted-foreground text-lg">
            Explore curated app ideas to kickstart your next project
          </p>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">App Idea</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[300px]">Key Features</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appIdeas.map((app, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{app.idea}</TableCell>
                  <TableCell>{app.description}</TableCell>
                  <TableCell>
                    <ul className="space-y-1">
                      {app.features.map((feature, idx) => (
                        <li key={idx} className="text-sm">• {feature}</li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Ideas;