import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

export function PromptPage() {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = () => {
    if (!prompt.trim()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setResponse(
        "This is a simulated AI response to your prompt. In a real implementation, this would connect to an AI service to generate content based on your input.",
      )
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">AI Prompt</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Enter a prompt to generate content for your notes.
        </p>

        <div className="flex gap-2">
          <Textarea
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-grow min-h-[100px]"
          />
          <Button
            onClick={handleSubmit}
            disabled={!prompt.trim() || isLoading}
            className="self-start"
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      {response && (
        <div className="flex-grow">
          <h3 className="text-md font-medium mb-2">Generated Content</h3>
          <div className="border border-border rounded-md p-4 bg-muted/30">
            <p className="text-sm whitespace-pre-wrap">{response}</p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setResponse("")}
              className="mr-2"
            >
              Clear
            </Button>
            <Button>Use in Note</Button>
          </div>
        </div>
      )}
    </div>
  )
}
