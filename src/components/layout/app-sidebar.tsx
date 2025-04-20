import { BookText, Command, PenLine, Plus, Search, Sliders, Palette } from "lucide-react"
import { Link, useMatches, useRouterState } from "@tanstack/react-router"
import { useFullscreen } from "@/hooks/use-fullscreen"
import { useNotesStore } from "@/lib/notes/notes-store"

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
    
  // Commented out unused variable
  // const entryId = isJournalRoute && currentRouteMatch?.routeId.includes('$entryId') && 'entryId' in currentRouteMatch.params
  //   ? String(currentRouteMatch.params.entryId)
  //   : undefined
    
  // Get notes from the store
  const { notes, isLoading, searchResults, searchQuery, createNote, baseStoragePath } = useNotesStore()
  
  // Removed debugging logs to prevent potential re-renders
  
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
                {[
                  {
                    title: "Today's Journal",
                    url: "/journal",
                    icon: PenLine,
                    shortcut: "⌘J",
                  },
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
                      onClick={() => createNote("New Note", "# New Note\n\nWrite your content here...")}
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
                  {searchQuery ? (
                    searchResults.length > 0 ? (
                      searchResults.map((result) => {
                        // Find the actual note from the notes array using the result ID
                        const note = notes.find(n => n.id === result.id);
                        if (!note) return null;
                        return (
                          <Link
                            to="/notes/$noteId"
                            params={{ noteId: note.id }}
                            key={note.id}
                            className={`block rounded-md hover:bg-accent transition-colors ${noteId === note.id ? 'bg-accent' : ''}`}
                          >
                            <div className="p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium truncate">{note.title}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(note.updatedAt || note.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                                </span>
                              </div>
                              <p className="line-clamp-2 text-xs text-muted-foreground">
                                {/* Display a preview of the note content */}
                                {note.title}
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
                        );
                      })
                    ) : (
                      <div className="px-4 py-2 text-sm text-muted-foreground">
                        No results found
                      </div>
                    )
                  ) : isLoading ? (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      Loading notes...
                    </div>
                  ) : notes.length > 0 ? (
                    notes.map((note) => (
                      <Link
                        to="/notes/$noteId"
                        params={{ noteId: note.id }}
                        key={note.id}
                        className={`block rounded-md hover:bg-accent transition-colors ${noteId === note.id ? 'bg-accent' : ''}`}
                      >
                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium truncate">{note.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(note.updatedAt || note.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {/* Display a preview of the note content */}
                            {note.title}
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
                  ) : (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      No notes yet
                    </div>
                  )}
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
