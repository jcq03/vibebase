import { Home, Lightbulb, Layers, Wrench, Map, MessageSquare, User, FolderKanban } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Ideas", url: "/ideas", icon: Lightbulb },
  { title: "Features", url: "/features", icon: Layers },
  { title: "Tools", url: "/tools", icon: Wrench },
  { title: "Build Plan", url: "/build-plan", icon: Map },
  { title: "Build Assistant", url: "/build-assistant", icon: MessageSquare },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className={open ? "w-64" : "w-14"}>
      <SidebarContent className="pt-8">
        <div className={`px-6 mb-6 ${open ? "block" : "hidden"}`}>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CodeVibez
          </h1>
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"} 
                      className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors"
                      activeClassName="bg-primary text-primary-foreground font-medium"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}