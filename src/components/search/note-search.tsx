import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { useNotesStore } from '@/lib/notes/notes-store'
import { Note, NoteMetadata } from '@/lib/notes/types'
import { Search, FileText, Loader2 } from 'lucide-react'

interface NoteSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NoteSearch({ open, onOpenChange }: NoteSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null)
  const [localLoading, setLocalLoading] = useState(false)
  const navigate = useNavigate()
  
  // Get notes and search functionality from our store
  const { 
    notes, 
    searchNotes: performSearch,
    searchResults,
    isLoading: storeLoading,
    baseStoragePath
  } = useNotesStore()
  
  // Combined loading state
  const isLoading = storeLoading || localLoading
  
  // Debounced search function to avoid excessive searches
  const debouncedSearch = useCallback((query: string) => {
    // Clear any existing debounce timer
    if (searchDebounce) {
      clearTimeout(searchDebounce)
    }
    
    // Set local loading state
    setLocalLoading(true)
    
    // Create a new debounce timer
    const timer = setTimeout(async () => {
      if (query.trim().length > 0) {
        await performSearch(query)
      }
      setLocalLoading(false)
    }, 500) // 500ms debounce
    
    setSearchDebounce(timer)
  }, [performSearch])
  
  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      debouncedSearch(searchQuery)
    } else {
      // Clear search results when query is empty
      setLocalLoading(false)
      // Reset search in the store to show all notes
      performSearch('')
    }
    
    // Cleanup function to clear the timeout
    return () => {
      if (searchDebounce) {
        clearTimeout(searchDebounce)
        setLocalLoading(false)
      }
    }
  }, [searchQuery, debouncedSearch, performSearch]);
  
  // Filtering logic to handle content search
  const filteredNotes = useMemo(() => {
    // If no search query, show all notes
    if (!searchQuery.trim()) {
      return notes;
    }
    
    // If we have search results, filter notes by them
    if (searchResults.length > 0) {
      // Create a map of result IDs for faster lookup
      const resultIds = new Set(searchResults.map(result => result.ref));
      
      // Filter notes by checking if their ID is in the results
      return notes.filter(note => resultIds.has(note.id));
    }
    
    // If no search results but we have a query, return empty array
    return [];
  }, [notes, searchResults, searchQuery]);
  
  // Add custom filter to Command component to search in both title and content
  const customFilter = useCallback((value: string, search: string) => {
    if (!search.trim()) return 1;
    search = search.toLowerCase();
    value = value.toLowerCase();
    
    // Exact match gets highest priority
    if (value.includes(search)) return 1;
    
    // Partial word matches get medium priority
    if (value.split(' ').some(word => word.startsWith(search))) return 0.5;
    
    // No match
    return 0;
  }, []);

  // Handle keyboard shortcut (⌘K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, onOpenChange])

  // Handle note selection
  const handleSelectNote = (noteId: string) => {
    navigate({ to: `/notes/${noteId}` })
    onOpenChange(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} hideCloseButton>
      <Command filter={customFilter}>
      <div className="relative">
        <CommandInput 
          placeholder="Search notes by title or content..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="pr-8"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>
      <CommandList className="max-h-[400px] overflow-auto">
        {!baseStoragePath ? (
          <CommandEmpty>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="mb-2 font-medium">No notes directory set</p>
              <p className="text-sm text-muted-foreground">
                Please select a storage directory in Settings
              </p>
            </div>
          </CommandEmpty>
        ) : isLoading || localLoading ? (
          <CommandEmpty>
            <div className="flex items-center justify-center py-6">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          </CommandEmpty>
        ) : (searchQuery.trim().length > 0 && filteredNotes.length === 0) ? (
          <CommandEmpty>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="mb-2 font-medium">No matching notes found</p>
              <p className="text-sm text-muted-foreground">
                Try different keywords or check your spelling
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Searching for: "{searchQuery}"
              </p>
            </div>
          </CommandEmpty>
        ) : (
          <CommandGroup heading={`${searchQuery.trim() ? 'Search results' : 'All Notes'} (${filteredNotes.length})`}>
            {filteredNotes.map((note: Note | NoteMetadata) => (
              <CommandItem
                key={note.id}
                value={`${note.title} ${typeof note === 'object' && note !== null && 'bodyContent' in note ? note.bodyContent : note.description || ''}`}
                onSelect={() => handleSelectNote(note.id)}
                className="flex flex-col items-start w-full"
              >
                <div className="flex items-center w-full">
                  <span className="font-medium">{note.title}</span>
                  {note.tags && note.tags.length > 0 && (
                    <div className="ml-auto flex gap-1 shrink-0">
                      {note.tags.map((tag: string) => (
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
                {/* Show a preview of the content */}
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {/* Access content safely - notes from metadata won't have bodyContent */}
                  {typeof note === 'object' && note !== null && 'bodyContent' in note ? 
                    String(note.bodyContent).substring(0, 150) + (String(note.bodyContent).length > 150 ? '...' : '') : 
                    (note.description || 'No preview available')}
                </p>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
      </Command>
    </CommandDialog>
  )
}
