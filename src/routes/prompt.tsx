import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatContainer } from "@/components/ui/chat-container";
import { Message, MessageContent } from "@/components/ui/message";
import { PromptInput, PromptInputTextarea } from "@/components/ui/prompt-input";
import { ResponseStream } from "@/components/ui/response-stream";

// Route for the Prompt page
export const Route = createFileRoute('/prompt')({  
  component: PromptPage
});

interface MessageType {
  role: "user" | "assistant";
  content: string;
}

function PromptPage() {
  const [prompt, setPrompt] = useState("");
  const [isChatMode, setIsChatMode] = useState(true);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: "assistant" as const,
      content: "Hello! Ask me anything about your notes."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    
    // Add user message to chat
    const newMessages = [
      ...messages,
      { role: "user" as const, content: prompt }
    ];
    
    setMessages(newMessages);
    setPrompt("");
    setIsLoading(true);
    
    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "assistant" as const,
          content: "I'm analyzing your notes to provide a helpful response. This is a placeholder response that would be replaced with actual AI functionality in a production version."
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatContainer className="h-full p-4">
          <div className="space-y-4 mb-4">
          {messages.map((message, index) => (
            <Message
              key={index}
              className={message.role === "assistant" ? "justify-start" : "justify-end"}
            >
              {message.role === "assistant" ? (
                <div className="rounded-lg p-2 text-foreground bg-muted prose break-words whitespace-normal">
                  <ResponseStream 
                    textStream={message.content} 
                    mode="typewriter" 
                    speed={40}
                  />
                </div>
              ) : (
                <MessageContent
                  className="bg-primary text-primary-foreground"
                >
                  {message.content}
                </MessageContent>
              )}
            </Message>
          ))}
          {isLoading && (
            <Message className="justify-start">
              <div className="rounded-lg p-2 text-foreground bg-secondary prose break-words whitespace-normal">
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse">Thinking</div>
                  <div className="animate-bounce">•</div>
                  <div className="animate-bounce delay-75">•</div>
                  <div className="animate-bounce delay-150">•</div>
                </div>
              </div>
            </Message>
          )}
          </div>
        </ChatContainer>
      </div>

      <div className="h-42 p-4">
        <PromptInput 
          value={prompt} 
          onValueChange={setPrompt} 
          isLoading={isLoading} 
          onSubmit={handleSubmit}
          className="rounded-lg"
        >
          <div className="flex w-full flex-col gap-2">
            <PromptInputTextarea 
              placeholder="Ask about your notes..."
              className="mb-1"
            />
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setPrompt(prev => `${prev}@`)}
                  className="h-8 px-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  @
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setPrompt(prev => `${prev}#`)}
                  className="h-8 px-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  #
                </Button>
              </div>
              
              <Button 
                type="button" 
                onClick={handleSubmit} 
                disabled={isLoading || !prompt.trim()}
                size="sm"
              >
                <CornerDownLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </PromptInput>
      </div>
    </div>
  );
}
