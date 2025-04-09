import * as React from "react"
import { BookText, Command, PenLine, Sparkles } from "lucide-react"

import { NavUser } from "@/components/nav-user"
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
      url: "#",
      icon: Sparkles,
      isActive: false,
    },
    {
      title: "Journal",
      url: "#",
      icon: PenLine,
      isActive: false,
    },
    {
      title: "Notes",
      url: "#",
      icon: BookText,
      isActive: true,
    },
  ],
  notes: [
    {
      title: "Meeting Tomorrow",
      date: "09:34 AM",
      content:
        "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
    },
    {
      title: "Project Update",
      date: "Yesterday",
      content:
        "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
    },
    {
      title: "Weekend Plans",
      date: "2 days ago",
      content:
        "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
    },
    {
      title: "Question about Budget",
      date: "2 days ago",
      content:
        "I've reviewed the budget numbers you sent over.\nCan we set up a quick call to discuss some potential adjustments?",
    },
    {
      title: "Important Announcement",
      date: "1 week ago",
      content:
        "Please join us for an all-hands meeting this Friday at 3 PM.\nWe have some exciting news to share about the company's future.",
    },
    {
      title: "Feedback on Proposal",
      date: "1 week ago",
      content:
        "Thank you for sending over the proposal. I've reviewed it and have some thoughts.\nCould we schedule a meeting to discuss my feedback in detail?",
    },
    {
      title: "New Project Idea",
      date: "1 week ago",
      content:
        "I've been brainstorming and came up with an interesting project concept.\nDo you have time this week to discuss its potential impact and feasibility?",
    },
    {
      title: "Vacation Plans",
      date: "1 week ago",
      content:
        "Just a heads up that I'll be taking a two-week vacation next month.\nI'll make sure all my projects are up to date before I leave.",
    },
    {
      title: "Conference Registration",
      date: "1 week ago",
      content:
        "I've completed the registration for the upcoming tech conference.\nLet me know if you need any additional information from my end.",
    },
    {
      title: "Team Dinner",
      date: "1 week ago",
      content:
        "To celebrate our recent project success, I'd like to organize a team dinner.\nAre you available next Friday evening? Please let me know your preferences.",
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onJournalActive?: (isActive: boolean) => void
}

export function AppSidebar({ onJournalActive, ...props }: AppSidebarProps) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])

  // Notify parent component when Journal is active
  React.useEffect(() => {
    if (onJournalActive) {
      onJournalActive(activeItem?.title === "Journal")
    }
  }, [activeItem, onJournalActive])
  const [notes, setNotes] = React.useState(data.notes)
  const { setOpen } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row rounded-bl-lg"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
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
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        // Notify parent about Journal state change
                        if (onJournalActive) {
                          onJournalActive(item.title === "Journal")
                        }

                        const note = data.notes.sort(() => Math.random() - 0.5)
                        setNotes(
                          note.slice(
                            0,
                            Math.max(5, Math.floor(Math.random() * 10) + 1),
                          ),
                        )
                        setOpen(true)
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2 my-2 rounded-md"
                    >
                      <item.icon className="size-5" />
                      <span>{item.title}</span>
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
      {/* Hide the secondary sidebar when Journal is active */}
      {activeItem?.title !== "Journal" && (
        <Sidebar collapsible="none" className="hidden flex-1 md:flex">
          <SidebarHeader className="gap-3.5 border-b p-4">
            <div className="flex w-full items-center justify-between">
              <div className="text-foreground text-base font-medium">
                {activeItem?.title}
              </div>
            </div>
            <SidebarInput placeholder="Search..." />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup className="px-0">
              <SidebarGroupContent className="space-y-1 px-2 py-1">
                {notes.map((note) => (
                  <a
                    href="#"
                    key={note.title}
                    className="block rounded-md hover:bg-accent/50 transition-colors"
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
                  </a>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      )}
    </Sidebar>
  )
}
