import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

// Sample data - in a real app, this would come from your data store
const notes = [
  { 
    id: '1', 
    title: 'Meeting Tomorrow', 
    tags: ['work', 'meeting'],
    content: 'Hi team, just a reminder about our meeting tomorrow at 10 AM. Please come prepared with your project updates.'
  },
  { 
    id: '2', 
    title: 'Project Update', 
    tags: ['work', 'project'],
    content: 'Thanks for the update. The progress looks great so far. Let\'s schedule a call to discuss the next steps.'
  },
  { 
    id: '3', 
    title: 'Weekend Plans', 
    tags: ['personal', 'weekend'],
    content: 'Hey everyone! I\'m thinking of organizing a team outing this weekend. Would you be interested in a hiking trip or a beach day?'
  },
  { 
    id: '4', 
    title: 'Question about Budget', 
    tags: ['work', 'finance'],
    content: 'I\'ve reviewed the budget numbers you sent over. Can we set up a quick call to discuss some potential adjustments?'
  },
  { 
    id: '5', 
    title: 'Important Announcement', 
    tags: ['work', 'announcement'],
    content: 'Please join us for an all-hands meeting this Friday at 3 PM. We have some exciting news to share about the company\'s future.'
  },
  { 
    id: '6', 
    title: 'Feedback on Proposal', 
    tags: ['work', 'feedback'],
    content: 'Thank you for sending over the proposal. I\'ve reviewed it and have some thoughts. Could we schedule a meeting to discuss my feedback in detail?'
  },
  { 
    id: '7', 
    title: 'New Project Idea', 
    tags: ['work', 'idea'],
    content: 'I\'ve been brainstorming and came up with an interesting project concept. Do you have time this week to discuss its potential impact and feasibility?'
  },
  { 
    id: '8', 
    title: 'Vacation Plans', 
    tags: ['personal', 'vacation'],
    content: 'Just a heads up that I\'ll be taking a two-week vacation next month. I\'ll make sure all my projects are up to date before I leave.'
  },
  { 
    id: '9', 
    title: 'Conference Registration', 
    tags: ['work', 'conference'],
    content: 'I\'ve completed the registration for the upcoming tech conference. Let me know if you need any additional information from my end.'
  },
  { 
    id: '10', 
    title: 'Team Dinner', 
    tags: ['work', 'social'],
    content: 'To celebrate our recent project success, I\'d like to organize a team dinner. Are you available next Friday evening? Please let me know your preferences.'
  },
]

interface NoteSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NoteSearch({ open, onOpenChange }: NoteSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    const matchesTitle = note.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = note.tags.some(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    )
    const matchesContent = note.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesTitle || matchesTags || matchesContent
  })

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
        <CommandEmpty>No notes found.</CommandEmpty>
        <CommandGroup heading="Notes">
          {filteredNotes.map((note) => (
            <CommandItem
              key={note.id}
              onSelect={() => handleSelectNote(note.id)}
              className="flex flex-col items-start w-full"
            >
              <div className="flex items-center w-full">
                <span className="font-medium">{note.title}</span>
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
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {note.content}
              </p>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
