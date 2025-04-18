import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { FileText } from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

// Import our notes store
import { useNotesStore } from '@/lib/notes/notes-store'

interface NoteSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NoteSearch({ open, onOpenChange }: NoteSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  
  // Get notes and search functionality from our store
  const { 
    notes, 
    searchNotes: performSearch,
    searchResults,
    isLoading,
    baseStoragePath
  } = useNotesStore()
  
  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      performSearch(searchQuery);
    }
  }, [searchQuery, performSearch]);
  
  // Determine which notes to display
  const filteredNotes = searchQuery.trim().length > 0 ? 
    // If we have a search query, use the search results to filter notes
    notes.filter(note => searchResults.some(result => result.id === note.id)) :
    // Otherwise show all notes
    notes

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
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search notes..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
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
        ) : isLoading ? (
          <CommandEmpty>
            <div className="flex items-center justify-center py-6">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          </CommandEmpty>
        ) : filteredNotes.length === 0 ? (
          <CommandEmpty>No notes found.</CommandEmpty>
        ) : (
          <CommandGroup heading={searchQuery ? `Search results (${filteredNotes.length})` : 'All Notes'}>
            {filteredNotes.map((note) => (
              <CommandItem
                key={note.id}
                onSelect={() => handleSelectNote(note.id)}
                className="flex flex-col items-start w-full"
              >
                <div className="flex items-center w-full">
                  <span className="font-medium">{note.title}</span>
                  {note.tags && note.tags.length > 0 && (
                    <div className="ml-auto flex gap-1 shrink-0">
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
                {/* Show a preview of the content */}
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {/* Access content safely - notes from metadata won't have bodyContent */}
                  {typeof note === 'object' && note !== null && 'bodyContent' in note ? 
                    String(note.bodyContent) : ''}
                </p>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
