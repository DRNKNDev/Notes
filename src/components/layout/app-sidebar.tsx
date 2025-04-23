import { BookText, Command } from "lucide-react"
import { Link, useRouterState } from "@tanstack/react-router"
import { useFullscreen } from "@/hooks/use-fullscreen"
import { useIsMobile } from "@/hooks/use-mobile"

import { SidebarActions } from "@/components/layout/sidebar-actions"
import { AppSidebarSecondary } from "@/components/layout/app-sidebar-secondary"
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
} from "@/components/ui/sidebar"

// Import the search component
import { NoteSearch } from "@/components/search/note-search"
import { useState } from "react"

export function AppSidebar() {
  // We only need the setOpen function from useSidebar
  const { setOpen } = useSidebar()
  
  // Get fullscreen state
  const { isFullscreen } = useFullscreen()
  
  // Check if we're on mobile
  const isMobile = useIsMobile()
  
  // Get current router state to check route parameters
  const routerState = useRouterState()
  const currentRouteMatch = routerState.matches[routerState.matches.length - 1]
  const currentPath = currentRouteMatch?.pathname || "/"
  
  // Determine if we're on notes, journal, or settings route
  const isNotesRoute = currentPath.startsWith("/notes")
  const isJournalRoute = currentPath.startsWith("/journal")
  const isPromptRoute = currentPath.startsWith("/prompt")
  const isSettingsRoute = currentPath.startsWith("/settings")
  
  // Get settings category from URL or default to "general"
  const settingsCategory = isSettingsRoute && currentRouteMatch?.search && 'category' in currentRouteMatch.search
    ? String(currentRouteMatch.search.category)
    : "general"
  
  // State for search dialog
  const [searchOpen, setSearchOpen] = useState(false)
  
  // Extract route parameters if available
  const noteId = isNotesRoute && currentRouteMatch?.routeId.includes('$noteId') && 'noteId' in currentRouteMatch.params
    ? String(currentRouteMatch.params.noteId)
    : undefined

  // If in fullscreen mode, don't render the sidebar
  if (isFullscreen) {
    return null;
  }
  
  return (
    <>
      {/* Search dialog */}
      <NoteSearch open={searchOpen} onOpenChange={setSearchOpen} />
      
      <Sidebar
        collapsible="icon"
        className="overflow-hidden *:data-[sidebar=sidebar]:flex-row rounded-bl-lg"
      >
        {/* This is the first sidebar - hide on mobile */}
        {/* We disable collapsible and adjust width to icon. */}
        {/* This will make the sidebar appear as icons. */}
        {!isMobile && (
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
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium text-white">Acme Inc</span>
                      <span className="truncate text-xs text-gray-400">Enterprise</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent className="px-1.5 md:px-0">
                <SidebarMenu className="space-y-4">
                  {[
                    // {
                    //   title: "Today's Journal",
                    //   url: "/journal",
                    //   icon: PenLine,
                    //   shortcut: "⌘J",
                    // },
                    {
                      title: "Notes",
                      url: "/notes",
                      icon: BookText,
                      shortcut: "⌘L",
                    },
                  ].map((item) => (
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
                              <div className="text-xs text-muted ml-2">{item.shortcut}</div>
                            )}
                          </div>
                        )
                        }}
                      >
                        <Link
                          to={item.url}
                          activeProps={{
                            className: "bg-sidebar-accent text-sidebar-accent-foreground",
                          }}
                          activeOptions={{
                            exact: false,
                          }}
                          onClick={(e) => {
                            // If we're already on this route, don't navigate
                            if (currentPath.startsWith(item.url)) {
                              e.preventDefault();
                            }
                            
                            // Just open the sidebar
                            setOpen(true)
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
        )}

        {/* This is the second sidebar */}
        {/* Hide the secondary sidebar when Prompt or Journal is active */}
        {!isPromptRoute && !isJournalRoute && (
          <AppSidebarSecondary 
            currentPath={currentPath}
            noteId={noteId}
            settingsCategory={settingsCategory}
            setSearchOpen={setSearchOpen}
          />
        )}
      </Sidebar>
    </>
  );
}
