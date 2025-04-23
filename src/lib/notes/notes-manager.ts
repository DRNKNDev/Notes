import * as path from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/plugin-fs";
import { NoteMetadata, Note, StoragePaths } from "./types";
import fm from "front-matter";

/**
 * Generates a description from note content
 * @param content The note content (body content without frontmatter)
 * @param maxLength Maximum length of the description
 * @returns A truncated description
 */
function generateDescription(content: string, maxLength: number = 150): string {
  // Remove markdown formatting for cleaner preview
  const cleanContent = content
    .replace(/\s+/g, ' ')                // Normalize whitespace
    .replace(/#+\s/g, '')               // Remove headings
    .replace(/\*\*|__|~~|\*|_|`/g, '')   // Remove bold, italic, strikethrough, code
    .replace(/!?\[([^\]]*)\]\([^\)]*\)/g, '$1') // Replace links/images with just text
    .replace(/\n+/g, ' ')               // Replace newlines with spaces
    .trim();
  
  // Truncate to maxLength
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  // Find a good breaking point (end of word)
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) { // Only break at word if we're not losing too much text
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Ensures the notes directory exists within the base storage path
 * @param baseStoragePath The base storage directory path
 * @returns The derived storage paths object
 */
export async function ensureNotesDirectory(
  baseStoragePath: string
): Promise<StoragePaths> {
  // Derive the paths
  const notesPath = await path.join(baseStoragePath, "notes");
  const indexPath = await path.join(baseStoragePath, "index.json");

  // Check if notes directory exists, create if not
  try {
    // First check if directory exists
    const exists = await fs.exists(notesPath);
    if (!exists) {
      // Create directory with parent directories
      // Tauri 2 uses mkdir instead of createDir
      await fs.mkdir(notesPath, { recursive: true });
    } else {
      // Directory already exists
    }
  } catch (error) {
    console.error("Error ensuring notes directory:", error);
    throw new Error(`Failed to create notes directory: ${error}`);
  }

  return {
    baseStoragePath,
    notesPath,
    indexPath,
  };
}

/**
 * Lists all notes in the notes directory
 * @param notesPath Path to the notes directory
 * @returns Array of file entries
 */
export async function listNoteFiles(notesPath: string): Promise<any[]> {
  try {
    // Read directory contents
    const entries = await fs.readDir(notesPath);
    // Filter for .md files only
    return entries.filter((entry: any) => {
      return entry.name && entry.name.toLowerCase().endsWith(".md");
    });
  } catch (error) {
    console.error("Error listing note files:", error);
    throw new Error(`Failed to list notes: ${error}`);
  }
}

/**
 * Generates a unique ID for a new note
 * @param title The note title
 * @returns A unique ID based on the title and timestamp
 */
export function generateNoteId(title: string): string {
  const timestamp = Date.now();
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  
  return `${sanitizedTitle}-${timestamp}`;
}

/**
 * Creates a new note file
 * @param paths Storage paths
 * @param title Note title
 * @param content Note content (without front matter)
 * @returns The metadata for the created note
 */
export async function createNoteFile(
  paths: StoragePaths,
  title: string,
  content: string
): Promise<NoteMetadata> {
  const now = new Date().toISOString();
  const id = generateNoteId(title);
  const fileName = `${id}.md`;
  
  // Generate description from content
  const description = generateDescription(content);
  
  // Create the frontmatter content with YAML
  const frontmatterContent = `---
title: "${title}"
createdAt: "${now}"
updatedAt: "${now}"
id: "${id}"
description: "${description.replace(/"/g, '\"')}"
---

${content}`;
  
  // Create the file path
  const filePath = await path.join(paths.notesPath, fileName);
  const relativePath = fileName;
  
  try {
    // Write the file
    await fs.writeTextFile(filePath, frontmatterContent);
    
    // Return the metadata
    return {
      id,
      title,
      createdAt: now,
      updatedAt: now,
      description,
      relativePath,
      filePath,
    };
  } catch (error) {
    console.error("Error creating note file:", error);
    throw new Error(`Failed to create note: ${error}`);
  }
}

/**
 * Reads a note file and parses its metadata and content
 * @param notesPath Path to the notes directory
 * @param fileName Name of the note file
 * @returns The note with metadata and content
 */
export async function readNoteFile(
  notesPath: string,
  fileName: string
): Promise<Note> {
  try {
    const filePath = await path.join(notesPath, fileName);
    const content = await fs.readTextFile(filePath);
    
    // Use front-matter to parse frontmatter
    const parsed = fm(content);
    
    // Extract metadata from frontmatter
    const attributes = parsed.attributes as Record<string, any>;
    const title = attributes.title || "Untitled";
    const createdAt = attributes.createdAt || new Date().toISOString();
    const updatedAt = attributes.updatedAt || createdAt;
    const id = attributes.id || fileName.replace(/\.md$/, "");
    const tags = Array.isArray(attributes.tags) ? attributes.tags : [];
    
    // Get description or generate from content
    let description = attributes.description;
    if (!description) {
      description = generateDescription(parsed.body);
    }
    
    return {
      id,
      title,
      createdAt,
      updatedAt,
      tags,
      description,
      relativePath: fileName,
      filePath,
      content,
      bodyContent: parsed.body.trim(),
    };
  } catch (error) {
    console.error(`Error reading note file ${fileName}:`, error);
    throw new Error(`Failed to read note: ${error}`);
  }
}

/**
 * Updates an existing note file
 * @param paths Storage paths
 * @param noteId ID of the note to update
 * @param newTitle The new title for the note
 * @param bodyContent The new body content for the note (without title or frontmatter)
 * @returns The updated note with full content
 */
export async function updateNoteFile(
  paths: StoragePaths,
  noteId: string,
  newTitle: string,
  bodyContent: string
): Promise<Note> {
  try {
    // Find the note file by ID
    const entries = await listNoteFiles(paths.notesPath);
    const noteFile = entries.find((entry) => 
      entry.name && entry.name.includes(noteId)
    );
    
    if (!noteFile || !noteFile.name) {
      throw new Error(`Note not found: ${noteId}`);
    }
    
    // Read the existing note
    const note = await readNoteFile(paths.notesPath, noteFile.name);
    
    // Update the note
    const now = new Date().toISOString();
    
    // Directly use the provided title and body content
    const updatedTitle = newTitle.trim() || 'Untitled';
    const updatedContent = bodyContent.trim();
    
    // Check if title has changed (compare with original note title)
    const titleChanged = updatedTitle !== note.title;
    
    // Generate a new ID if the title has changed
    const updatedId = titleChanged ? generateNoteId(updatedTitle) : note.id;
    
    // Create frontmatter content with YAML
    let tagsString = '';
    if (note.tags && note.tags.length > 0) {
      tagsString = `tags: [${note.tags.map(tag => `"${tag}"`).join(', ')}]\n`;
    }
    
    // Generate a new description from the updated content
    const updatedDescription = generateDescription(updatedContent);
    
    // Generate the file content with frontmatter
    const fileContent = `---
title: "${updatedTitle}"
createdAt: "${note.createdAt}"
updatedAt: "${now}"
id: "${updatedId}"
description: "${updatedDescription.replace(/"/g, '\"')}"
${tagsString}---

${updatedContent}`;
    
    // Determine file paths
    const oldFilePath = note.filePath;
    let newFilePath = oldFilePath;
    let newRelativePath = note.relativePath;
    
    // If title changed, create a new file name
    if (titleChanged) {
      const newFileName = `${updatedId}.md`;
      newRelativePath = newFileName;
      newFilePath = await path.join(paths.notesPath, newFileName);
    }
    
    // Write to the new file path
    await fs.writeTextFile(newFilePath, fileContent);
    
    // If the file path changed, delete the old file
    if (titleChanged && oldFilePath !== newFilePath) {
      try {
        await fs.remove(oldFilePath);
      } catch (deleteError) {
        console.warn(`Warning: Could not delete old file ${oldFilePath}:`, deleteError);
        // Continue even if delete fails
      }
    }
    
    // Return the updated note with full content
    return {
      ...note,
      id: updatedId,
      title: updatedTitle,
      updatedAt: now,
      description: updatedDescription,
      relativePath: newRelativePath,
      filePath: newFilePath,
      content: fileContent,
      bodyContent: updatedContent,
    };
  } catch (error) {
    console.error("Error updating note file:", error);
    throw new Error(`Failed to update note: ${error}`);
  }
}

/**
 * Deletes a note file
 * @param paths Storage paths
 * @param noteId ID of the note to delete
 * @returns True if successful
 */
export async function deleteNoteFile(
  paths: StoragePaths,
  noteId: string
): Promise<boolean> {
  try {
    // Find the note file by ID
    const entries = await listNoteFiles(paths.notesPath);
    const noteFile = entries.find((entry) => 
      entry.name && entry.name.includes(noteId)
    );
    
    if (!noteFile || !noteFile.name) {
      throw new Error(`Note not found: ${noteId}`);
    }
    
    // Delete the file
    const filePath = await path.join(paths.notesPath, noteFile.name);
    await fs.remove(filePath);
    
    return true;
  } catch (error) {
    console.error("Error deleting note file:", error);
    throw new Error(`Failed to delete note: ${error}`);
  }
}
