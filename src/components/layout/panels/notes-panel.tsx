import { Plus, Search, BookText, Moon, Sun, Settings } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useNotesStore } from "@/lib/notes/notes-store";
import { useIsMobile } from "@/hooks/use-mobile";
import { useThemeContext } from "@/components/theme-provider";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatNoteDate } from "@/lib/utils";

interface NotesPanelProps {
  setSearchOpen?: (open: boolean) => void;
}

/**
 * Notes panel for the secondary sidebar
 * Shows the list of notes with search and create actions
 */
export function NotesPanel({ setSearchOpen }: NotesPanelProps) {
  const routerState = useRouterState();
  const isMobile = useIsMobile();
  const { mode, setMode } = useThemeContext();
  const { notes, isLoading, searchResults, searchQuery, createNote } =
    useNotesStore();

  // Get current note ID from route params
  const currentMatch = routerState.matches[routerState.matches.length - 1];
  const noteId =
    currentMatch?.params && "noteId" in currentMatch.params
      ? String(currentMatch.params.noteId)
      : undefined;

  return (
    <>
      <SidebarHeader className="h-10 border-b border-muted p-0">
        <div className="flex w-full h-10 items-center justify-between px-2">
          <span className="text-foreground font-semibold">Notes</span>

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
                  onClick={() =>
                    createNote("New Note", "# New Note\n\nWrite your content here...")
                  }
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
            <SidebarGroupContent className="flex flex-col gap-2">
              {searchQuery ? (
                // Show search results
                searchResults.length > 0 ? (
                  searchResults.map((result) => {
                    const note = notes.find((n) => n.id === result.ref);
                    if (!note) return null;
                    return (
                      <Link
                        to="/notes/$noteId"
                        params={{ noteId: note.id }}
                        key={note.id}
                        className={cn(
                          "block rounded-md hover:bg-accent transition-colors",
                          noteId === note.id && "bg-accent"
                        )}
                      >
                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {note.title.length > 35
                                ? `${note.title.substring(0, 25)}...`
                                : note.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatNoteDate(note.updatedAt || note.createdAt)}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {typeof note === "object" &&
                            note !== null &&
                            "bodyContent" in note
                              ? String(note.bodyContent).substring(0, 100) +
                                (String(note.bodyContent).length > 100 ? "..." : "")
                              : note.description || (
                                  <span className="italic">No preview available</span>
                                )}
                          </p>
                          {note.tags && note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {note.tags.map((tag) => (
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
                    <p className="text-xs">
                      Try different keywords or check your spelling
                    </p>
                  </div>
                )
              ) : isLoading ? (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Loading notes...
                </div>
              ) : notes.length > 0 ? (
                // Show all notes
                notes.map((note) => (
                  <Link
                    to="/notes/$noteId"
                    params={{ noteId: note.id }}
                    key={note.id}
                    className={cn(
                      "block rounded-md hover:bg-accent transition-colors",
                      noteId === note.id && "bg-accent"
                    )}
                  >
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {note.title.length > 35
                            ? `${note.title.substring(0, 25)}...`
                            : note.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatNoteDate(note.updatedAt || note.createdAt)}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {note.description || (
                          <span className="italic">No description</span>
                        )}
                      </p>
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {note.tags.map((tag) => (
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
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

            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setMode(mode === "light" ? "dark" : "light")}
                  >
                    {mode === "dark" ? (
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

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link
                      to="/settings"
                      search={{ category: "general" }}
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
    </>
  );
}
