import { BookText, Command } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarActions } from "./sidebar-actions";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

/**
 * Primary sidebar - Icon-based navigation (48px width)
 * Always visible on desktop, hidden on mobile
 */
export function PrimarySidebar() {
  const { setOpen } = useSidebar();
  const isMobile = useIsMobile();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Don't render on mobile (mobile uses secondary sidebar footer for navigation)
  if (isMobile) {
    return null;
  }

  const navItems = [
    {
      title: "Notes",
      url: "/notes",
      icon: BookText,
      shortcut: "⌘L",
    },
    // Uncomment when journal is fully implemented
    // {
    //   title: "Today's Journal",
    //   url: "/journal",
    //   icon: PenLine,
    //   shortcut: "⌘J",
    // },
  ];

  return (
    <Sidebar
      collapsible="none"
      className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r border-muted"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <span className="sr-only">DRNKN Notes</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-1.5 md:px-0">
            <SidebarMenu className="space-y-4">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    size="lg"
                    asChild
                    className="md:h-8 md:p-0"
                    tooltip={{
                      children: (
                        <div className="flex items-center justify-between">
                          <div>{item.title}</div>
                          {item.shortcut && (
                            <div className="text-xs text-muted ml-2">
                              {item.shortcut}
                            </div>
                          )}
                        </div>
                      ),
                    }}
                  >
                    <Link
                      to={item.url}
                      activeProps={{
                        className:
                          "bg-sidebar-accent text-sidebar-accent-foreground",
                      }}
                      activeOptions={{
                        exact: false,
                      }}
                      onClick={(e) => {
                        // If we're already on this route, don't navigate
                        if (currentPath.startsWith(item.url)) {
                          e.preventDefault();
                        }

                        // Open the sidebar
                        setOpen(true);
                      }}
                    >
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                        <item.icon className="size-4" />
                      </div>
                      <span className="sr-only">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarActions />
      </SidebarFooter>
    </Sidebar>
  );
}
