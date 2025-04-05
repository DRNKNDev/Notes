import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])

  const handleSearch = () => {
    // Mock search results for now
    setSearchResults([
      {
        id: 1,
        title: "Getting Started with DRNKN Notes",
        date: "2025-04-04",
        excerpt: "A guide to using DRNKN Notes...",
      },
      {
        id: 2,
        title: "Markdown Cheatsheet",
        date: "2025-04-03",
        excerpt: "Quick reference for Markdown syntax...",
      },
      {
        id: 3,
        title: "Keyboard Shortcuts",
        date: "2025-04-02",
        excerpt: "Boost your productivity with these shortcuts...",
      },
    ])
  }

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="space-y-4">
        {searchResults.length > 0 ? (
          searchResults.map((result) => (
            <div
              key={result.id}
              className="border border-border p-4 rounded-md"
            >
              <h3 className="text-lg font-medium">{result.title}</h3>
              <p className="text-xs text-muted-foreground">{result.date}</p>
              <p className="mt-2 text-sm">{result.excerpt}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {searchQuery
              ? "No results found. Try a different search term."
              : "Enter a search term to find notes."}
          </p>
        )}
      </div>
    </div>
  )
}
