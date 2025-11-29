import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FolderKanban, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "Simple Note Taker",
      description: "An innovative project that builds a simple note taker app with rich text features",
      createdAt: "2024-11-20",
    },
  ]);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  const handleCreateProject = () => {
    if (newProject.name.trim()) {
      const project = {
        id: Date.now().toString(),
        name: newProject.name,
        description: newProject.description,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setProjects([...projects, project]);
      setNewProject({ name: "", description: "" });
      setOpen(false);
      navigate(`/projects/${project.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Projects</h1>
            <p className="text-muted-foreground text-lg">
              Manage your app ideas and build plans
            </p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Start a new app idea and planning session
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Simple Note Taker"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your app idea..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <Button onClick={handleCreateProject} className="w-full">
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderKanban className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Created {project.createdAt}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
