import { BookText, Command, PenLine, Plus, Search, Settings, Sliders, Palette } from "lucide-react"
import { Link, useMatches, useRouterState } from "@tanstack/react-router"
import { useFullscreen } from "@/hooks/use-fullscreen"

import { SidebarActions } from "@/components/layout/sidebar-actions"
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
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

import { cn } from "@/lib/utils"

// This is sample data
const data = {
  navMain: [
    // {
    //   title: "Prompt",
    //   url: "/prompt",
    //   icon: Sparkles,
    //   shortcut: "⌘/",
    //   shortcutKeys: ["meta", "/"],
    // },
    {
      title: "Today's Journal",
      url: "/journal",
      icon: PenLine,
      shortcut: "⌘J",
      shortcutKeys: ["meta", "j"],
    },
    {
      title: "Notes",
      url: "/notes",
      icon: BookText,
      shortcut: "⌘L",
      shortcutKeys: ["meta", "l"],
    },
  ],
  notes: [
    {
      id: "1",
      title: "Meeting Tomorrow",
      date: "09:34 AM",
      tags: ["work", "meeting"],
      content:
        "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
    },
    {
      id: "2",
      title: "Project Update",
      date: "Yesterday",
      tags: ["work", "project"],
      content:
        "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
    },
    {
      id: "3",
      title: "Weekend Plans",
      date: "2 days ago",
      tags: ["personal", "weekend"],
      content:
        "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
    },
    {
      id: "4",
      title: "Question about Budget",
      date: "2 days ago",
      tags: ["work", "finance"],
      content:
        "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
    },
    {
      id: "5",
      title: "Important Announcement",
      date: "1 week ago",
      tags: ["work", "announcement"],
      content:
        "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
    },
    {
      id: "6",
      title: "Feedback on Proposal",
      date: "1 week ago",
      tags: ["work", "feedback"],
      content:
        "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
    },
    {
      id: "7",
      title: "New Project Idea",
      date: "1 week ago",
      tags: ["work", "idea"],
      content:
        "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
    },
    {
      id: "8",
      title: "Vacation Plans",
      date: "1 week ago",
      tags: ["personal", "vacation"],
      content:
        "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
    },
    {
      id: "9",
      title: "Conference Registration",
      date: "1 week ago",
      tags: ["work", "conference"],
      content:
        "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
    },
    {
      id: "10",
      title: "Team Dinner",
      date: "1 week ago",
      tags: ["work", "social"],
      content:
        "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
    },
  ],
}

// Import the search component
import { NoteSearch } from "@/components/search/note-search"
import { useState } from "react"

export function AppSidebar() {
  const matches = useMatches()
  // We only need the setOpen function from useSidebar
  const { setOpen } = useSidebar()
  
  // Get fullscreen state
  const { isFullscreen } = useFullscreen()
  
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
    
  const entryId = isJournalRoute && currentRouteMatch?.routeId.includes('$entryId') && 'entryId' in currentRouteMatch.params
    ? String(currentRouteMatch.params.entryId)
    : undefined
  
  // We don't need the notes state anymore since we're using data.notes directly
  // and conditionally rendering based on the route

  // Note: Keyboard shortcuts will be handled in a dedicated hook in Phase 3

  // Note: The activeItem state and notification to parent have been removed
  // as we now use Tanstack Router for navigation state

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
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
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
                {data.navMain.map((item) => (
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
                        className={cn(
                          matches.some((match) => match.routeId.includes(item.url)) &&
                            "bg-accent/50",
                        )}
                        onClick={() => {
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

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      {/* Hide the secondary sidebar when Prompt or Journal is active */}
      {!isPromptRoute && !isJournalRoute && !isSettingsRoute && (
        <Sidebar
          collapsible="none"
          className="flex-1"
        >
          <SidebarHeader className="h-10 border-b border-muted p-0">
            <div className="flex w-full h-10 items-center justify-between px-2">
              {/* Notes title on left */}
              <span className="text-foreground font-semibold">
                Notes
              </span>
              {/* Action buttons on right */}
              <div className="flex items-center gap-1">
                {/* Search button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      aria-label="Search Notes"
                      onClick={() => setSearchOpen(true)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={5}>
                    <div className="flex items-center justify-between">
                      <p>Search</p>
                      <div className="text-xs text-muted ml-2">⌘K</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
                
                {/* New Note button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      aria-label="New Note"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={5}>
                    <div className="flex items-center justify-between">
                      <p>New Note</p>
                      <div className="text-xs text-muted ml-2">⌘N</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea className="h-full">
              <SidebarGroup className="px-0">
                <SidebarGroupContent className="space-y-1 px-2 py-1">
                  {data.notes.map((note) => (
                      <Link
                        to="/notes/$noteId"
                        params={{ noteId: note.id || "1" }}
                        key={note.title}
                        className={`block rounded-md hover:bg-accent transition-colors ${noteId === (note.id || "1") ? 'bg-accent' : ''}`}
                      >
                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{note.title}</span>
                            <span className="text-xs text-muted-foreground">{note.date}</span>
                          </div>
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {note.content}
                          </p>
                          {/* Tags */}
                          {note.tags && note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {note.tags.map(tag => (
                                <span 
                                  key={tag} 
                                  className="text-xs bg-muted px-1.5 py-0.5 rounded-md text-muted-foreground"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))
                  }
                </SidebarGroupContent>
              </SidebarGroup>
            </ScrollArea>
          </SidebarContent>
        </Sidebar>
      )}
      {isSettingsRoute && (
        <Sidebar
          collapsible="none"
          className="flex-1"
        >
          <SidebarHeader className="h-10 border-b border-muted p-0">
            <div className="flex w-full h-10 items-center justify-between px-2">
              {/* Settings title on left */}
              <span className="text-foreground font-semibold">
                Settings
              </span>
              {/* Action buttons could go here if needed */}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea className="h-full">
              <div className="p-2">
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <Link
                          to="/settings"
                          search={{ category: 'general' }}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-md hover:bg-muted",
                            settingsCategory === "general" && "bg-muted font-medium"
                          )}
                        >
                          <Sliders className="h-4 w-4" />
                          <span className="text-sm">General</span>
                        </Link>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <Link
                          to="/settings"
                          search={{ category: 'themes' }}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-md hover:bg-muted",
                            settingsCategory === "themes" && "bg-muted font-medium"
                          )}
                        >
                          <Palette className="h-4 w-4" />
                          <span className="text-sm">Themes</span>
                        </Link>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </div>
            </ScrollArea>
          </SidebarContent>
        </Sidebar>
      )}
    </Sidebar>
  </>
  );
}
