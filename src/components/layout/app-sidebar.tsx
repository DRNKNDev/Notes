import { BookText, Command, PenLine, Sparkles } from "lucide-react"
import { Link, useMatches, useRouterState } from "@tanstack/react-router"

import { NavUser } from "@/components/layout/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"

import { cn } from "@/lib/utils"

// This is sample data
const data = {
  user: {
    name: "DRNKNDev",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Prompt",
      url: "/prompt",
      icon: Sparkles,
      shortcut: "⌘/",
      shortcutKeys: ["meta", "/"],
    },
    {
      title: "Journal",
      url: "/journal",
      icon: PenLine,
      shortcut: "⌘J",
      shortcutKeys: ["meta", "j"],
    },
    {
      title: "Notes",
      url: "/notes",
      icon: BookText,
      shortcut: "⌘B",
      shortcutKeys: ["meta", "b"],
    },
  ],
  notes: [
    {
      id: "1",
      title: "Meeting Tomorrow",
      date: "09:34 AM",
      content:
        "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
    },
    {
      id: "2",
      title: "Project Update",
      date: "Yesterday",
      content:
        "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
    },
    {
      id: "3",
      title: "Weekend Plans",
      date: "2 days ago",
      content:
        "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
    },
    {
      id: "4",
      title: "Question about Budget",
      date: "2 days ago",
      content:
        "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
    },
    {
      id: "5",
      title: "Important Announcement",
      date: "1 week ago",
      content:
        "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
    },
    {
      id: "6",
      title: "Feedback on Proposal",
      date: "1 week ago",
      content:
        "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
    },
    {
      id: "7",
      title: "New Project Idea",
      date: "1 week ago",
      content:
        "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
    },
    {
      id: "8",
      title: "Vacation Plans",
      date: "1 week ago",
      content:
        "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
    },
    {
      id: "9",
      title: "Conference Registration",
      date: "1 week ago",
      content:
        "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
    },
    {
      id: "10",
      title: "Team Dinner",
      date: "1 week ago",
      content:
        "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
    },
  ],
}

export function AppSidebar() {
  const matches = useMatches()
  // We only need the setOpen function from useSidebar
  const { setOpen } = useSidebar()
  
  // Get current router state to check route parameters
  const routerState = useRouterState()
  const currentRouteMatch = routerState.matches[routerState.matches.length - 1]
  const currentPath = currentRouteMatch?.pathname || "/"
  
  // Determine if we're on notes or journal route
  const isNotesRoute = currentPath.startsWith("/notes")
  const isJournalRoute = currentPath.startsWith("/journal")
  const isPromptRoute = currentPath.startsWith("/prompt")
  
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

  return (
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
                              <div className="text-xs text-muted-foreground ml-2">{item.shortcut}</div>
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
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      {/* Hide the secondary sidebar when Prompt or Journal is active */}
      {!isPromptRoute && !isJournalRoute && (
        <Sidebar
          collapsible="none"
          className="flex-1 border-r border-muted"
        >
          <SidebarHeader className="gap-3.5 border-b border-muted p-4">
            <div className="flex w-full items-center justify-between">
              <div className="text-foreground text-base font-medium">
                {isNotesRoute ? "Notes" : "Journal"}
              </div>
            </div>
            <SidebarInput placeholder="Search..." />
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea className="h-full">
              <SidebarGroup className="px-0">
                <SidebarGroupContent className="space-y-1 px-2 py-1">
                  {isNotesRoute ? (
                    // Notes list
                    data.notes.map((note) => (
                      <Link
                        to="/notes/$noteId"
                        params={{ noteId: note.id || "1" }}
                        key={note.title}
                        className={`block rounded-md hover:bg-accent/50 transition-colors ${noteId === (note.id || "1") ? 'bg-accent/50' : ''}`}
                      >
                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{note.title}</span>
                            <span className="text-xs text-muted-foreground">{note.date}</span>
                          </div>
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {note.content}
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    // Journal entries list
                    [
                      {
                        id: "1",
                        title: "Today's Journal",
                        date: "Today",
                        content: "Started working on the new feature. Made good progress with the UI components.",
                      },
                      {
                        id: "2",
                        title: "Yesterday's Journal",
                        date: "Yesterday",
                        content: "Had a productive meeting with the team. Discussed the roadmap for the next quarter.",
                      },
                      {
                        id: "3",
                        title: "Weekly Reflection",
                        date: "3 days ago",
                        content: "This week was challenging but rewarding. Completed the major milestone for the project.",
                      },
                      {
                        id: "4",
                        title: "Monthly Review",
                        date: "2 weeks ago",
                        content: "Looking back at this month's accomplishments. Proud of the team's progress.",
                      }
                    ].map((entry) => (
                      <Link
                        to="/journal/$entryId"
                        params={{ entryId: entry.id }}
                        key={entry.id}
                        className={`block rounded-md hover:bg-accent/50 transition-colors ${entryId === entry.id ? 'bg-accent/50' : ''}`}
                      >
                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{entry.title}</span>
                            <span className="text-xs text-muted-foreground">{entry.date}</span>
                          </div>
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {entry.content}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </SidebarGroupContent>
              </SidebarGroup>
            </ScrollArea>
          </SidebarContent>
        </Sidebar>
      )}
    </Sidebar>
  )
}
