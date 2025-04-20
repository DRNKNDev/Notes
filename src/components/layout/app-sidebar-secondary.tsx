import { Plus, Palette, Sliders, Search } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useNotesStore } from "@/lib/notes/notes-store"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { cn, formatNoteDate } from "@/lib/utils"

type AppSidebarSecondaryProps = {
  currentPath: string;
  noteId?: string;
  settingsCategory?: string;
  setSearchOpen?: (open: boolean) => void;
}

export function AppSidebarSecondary({ 
  currentPath, 
  noteId,
  settingsCategory = "general",
  setSearchOpen
}: AppSidebarSecondaryProps) {
  // Determine if we're on notes, settings route
  const isNotesRoute = currentPath.startsWith("/notes")
  const isSettingsRoute = currentPath.startsWith("/settings")
  
  // Get notes from the store
  const { notes, isLoading, searchResults, searchQuery, createNote } = useNotesStore()
  
  return (
    <>
      {isNotesRoute && (
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
                      onClick={() => {
                        if (setSearchOpen) {
                          setSearchOpen(true);
                        }
                      }}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={10}>
                    <div className="flex items-center justify-between gap-2">
                      <p>Search</p>
                      <div className="text-xs text-muted">⌘K</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
                
                {/* Create new note button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => createNote("New Note", "# New Note\n\nWrite your content here...")}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="center" sideOffset={10}>
                    <div className="flex items-center justify-between gap-2">
                      <p>New Note</p>
                      <div className="text-xs text-muted">⌘N</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea className="h-full">
              <SidebarGroup>
                <SidebarGroupContent>
                  {searchQuery ? (
                    // Show search results
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
                                  {formatNoteDate(note.updatedAt || note.createdAt)}
                                </span>
                              </div>
                              <p className="line-clamp-2 text-xs text-muted-foreground">
                                {/* Display note description as preview */}
                                {note.description || (
                                  <span className="italic">No description</span>
                                )}
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
                    // Loading state
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      Loading notes...
                    </div>
                  ) : notes.length > 0 ? (
                    // Show all notes
                    notes.map(note => (
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
                              {formatNoteDate(note.updatedAt || note.createdAt)}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {/* Display note description as preview */}
                            {note.description || (
                              <span className="italic">No description</span>
                            )}
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
    </>
  );
}
