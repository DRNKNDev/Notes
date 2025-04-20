import { Plus, Palette, Sliders, Search, BookText, Moon, Sun, Settings } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { useNotesStore } from "@/lib/notes/notes-store"
import { useIsMobile } from "@/hooks/use-mobile"
import { useThemeContext } from "@/components/theme-provider"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
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
  
  // Check if we're on mobile
  const isMobile = useIsMobile()
  
  // Get theme context for theme toggle
  const { mode, setMode } = useThemeContext()
  
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
                      variant={searchQuery ? "secondary" : "ghost"}
                      size="icon" 
                      className={cn(
                        "h-7 w-7",
                        searchQuery && "bg-accent text-accent-foreground"
                      )}
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
                        // Find the actual note from the notes array using the result ref
                        const note = notes.find(n => n.id === result.ref);
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
                                {/* Display note content as preview */}
                                {typeof note === 'object' && note !== null && 'bodyContent' in note ? 
                                  String(note.bodyContent).substring(0, 100) + (String(note.bodyContent).length > 100 ? '...' : '') : 
                                  (note.description || <span className="italic">No preview available</span>)}
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
                      <div className="p-3 text-sm text-muted-foreground">
                        <p className="mb-2">No results found for "{searchQuery}"</p>
                        <p className="text-xs">Try different keywords or check your spelling</p>
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
          
          {/* Mobile-only footer with navigation buttons */}
          {isMobile && (
            <SidebarFooter className="border-t border-muted">
              <div className="flex justify-between items-center p-2">
                {/* Left side - Notes button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <Link
                        to="/notes"
                        activeProps={{
                          className: "bg-accent text-accent-foreground",
                        }}
                        activeOptions={{
                          exact: false,
                        }}
                      >
                        <BookText className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" sideOffset={10}>
                    <div className="flex items-center justify-between gap-2">
                      <p>Notes</p>
                      <div className="text-xs text-muted">⌘L</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
                
                {/* Right side - Theme toggle and Settings */}
                <div className="flex gap-1">
                  {/* Theme toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
                      >
                        {mode === 'dark' ? (
                          <Moon className="h-4 w-4" />
                        ) : (
                          <Sun className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" sideOffset={10}>
                      <p>Toggle Theme</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  {/* Settings button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <Link
                          to="/settings"
                          search={{ category: 'general' }}
                          activeProps={{
                            className: "bg-accent text-accent-foreground",
                          }}
                          activeOptions={{
                            exact: false,
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" sideOffset={10}>
                      <div className="flex items-center justify-between gap-2">
                        <p>Settings</p>
                        <div className="text-xs text-muted">⌘,</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </SidebarFooter>
          )}
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
          
          {/* Mobile-only footer with navigation buttons */}
          {isMobile && (
            <SidebarFooter className="border-t border-muted">
              <div className="flex justify-between items-center p-2">
                {/* Left side - Notes button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <Link
                        to="/notes"
                        activeProps={{
                          className: "bg-accent text-accent-foreground",
                        }}
                        activeOptions={{
                          exact: false,
                        }}
                      >
                        <BookText className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" sideOffset={10}>
                    <div className="flex items-center justify-between gap-2">
                      <p>Notes</p>
                      <div className="text-xs text-muted">⌘L</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
                
                {/* Right side - Theme toggle and Settings */}
                <div className="flex gap-1">
                  {/* Theme toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
                      >
                        {mode === 'dark' ? (
                          <Moon className="h-4 w-4" />
                        ) : (
                          <Sun className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" sideOffset={10}>
                      <p>Toggle Theme</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  {/* Settings button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <Link
                          to="/settings"
                          search={{ category: 'general' }}
                          activeProps={{
                            className: "bg-accent text-accent-foreground",
                          }}
                          activeOptions={{
                            exact: false,
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" sideOffset={10}>
                      <div className="flex items-center justify-between gap-2">
                        <p>Settings</p>
                        <div className="text-xs text-muted">⌘,</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </SidebarFooter>
          )}
        </Sidebar>
      )}
    </>
  );
}
