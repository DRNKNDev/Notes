import { useState, useCallback } from 'react';

export interface ParsedMarkdown {
  title: string;
  content: string;
  fullMarkdown: string;
}

/**
 * Hook to manage markdown with enforced H1 title
 * Handles parsing, updating, and enforcing H1 title at the top of markdown content
 */
export function useMarkdownTitle(initialMarkdown: string = '') {
  // Parse the initial markdown to extract title and content
  const initialParsed = parseMarkdownWithTitle(initialMarkdown);
  
  // State for the combined markdown and the last valid title
  const [markdown, setMarkdown] = useState<string>(initialParsed.fullMarkdown);
  const [lastValidTitle, setLastValidTitle] = useState<string>(initialParsed.title);

  /**
   * Parse markdown to extract title and content
   */
  const parseMarkdown = useCallback((markdownText: string): ParsedMarkdown => {
    return parseMarkdownWithTitle(markdownText, lastValidTitle);
  }, [lastValidTitle]);

  /**
   * Update markdown content, ensuring H1 title is preserved
   */
  const updateMarkdown = useCallback((newMarkdown: string) => {
    const titleRegex = /^# (.*)\n?/; // Matches '# Title' possibly followed by newline
    
    if (titleRegex.test(newMarkdown)) {
      // H1 is present, update normally
      const parsed = parseMarkdownWithTitle(newMarkdown);
      setLastValidTitle(parsed.title);
      setMarkdown(newMarkdown);
      return parsed;
    } else {
      // H1 is missing, reconstruct and enforce
      const correctedTitle = lastValidTitle || 'Untitled';
      const correctedMarkdown = `# ${correctedTitle}\n\n${newMarkdown.trim()}`;
      setMarkdown(correctedMarkdown);
      
      return {
        title: correctedTitle,
        content: newMarkdown.trim(),
        fullMarkdown: correctedMarkdown
      };
    }
  }, [lastValidTitle]);

  return {
    markdown,
    title: lastValidTitle,
    updateMarkdown,
    parseMarkdown
  };
}

/**
 * Parse markdown to extract title and content
 * This is a pure function that doesn't depend on state
 */
export function parseMarkdownWithTitle(markdown: string, fallbackTitle: string = 'Untitled'): ParsedMarkdown {
  const titleRegex = /^# (.*)\n?/; // Matches '# Title' possibly followed by newline
  const match = markdown.match(titleRegex);
  
  if (match) {
    const title = match[1].trim();
    // Content is everything after the first line break, or empty if no line break
    const contentStartIndex = markdown.indexOf('\n');
    const content = contentStartIndex !== -1 ? 
      markdown.substring(contentStartIndex + 1).trim() : 
      '';
    
    return { 
      title, 
      content, 
      fullMarkdown: markdown 
    };
  } else {
    // If no H1 found, treat the whole thing as content, title is fallback
    const content = markdown.trim();
    const fullMarkdown = `# ${fallbackTitle}\n\n${content}`;
    
    return { 
      title: fallbackTitle, 
      content, 
      fullMarkdown 
    };
  }
}
