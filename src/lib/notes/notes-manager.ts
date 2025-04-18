import * as path from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/plugin-fs";
import { NoteMetadata, Note, StoragePaths } from "./types";

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
      console.log(`Notes directory created at: ${notesPath}`);
    } else {
      console.log(`Notes directory already exists at: ${notesPath}`);
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
  
  // Create the front matter
  const frontMatter = `---
title: "${title}"
createdAt: "${now}"
updatedAt: "${now}"
id: "${id}"
---

`;

  // Combine front matter and content
  const fullContent = `${frontMatter}${content}`;
  
  // Create the file path
  const filePath = await path.join(paths.notesPath, fileName);
  const relativePath = fileName;
  
  try {
    // Write the file
    await fs.writeTextFile(filePath, fullContent);
    
    // Return the metadata
    return {
      id,
      title,
      createdAt: now,
      updatedAt: now,
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
    
    // TODO: Use gray-matter to parse front matter
    // For now, we'll use a simple regex approach
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (!frontMatterMatch) {
      throw new Error(`Invalid note format: ${fileName}`);
    }
    
    const [, frontMatter, bodyContent] = frontMatterMatch;
    
    // Parse front matter
    const titleMatch = frontMatter.match(/title:\s*"([^"]*)"/);
    const createdAtMatch = frontMatter.match(/createdAt:\s*"([^"]*)"/);
    const updatedAtMatch = frontMatter.match(/updatedAt:\s*"([^"]*)"/);
    const idMatch = frontMatter.match(/id:\s*"([^"]*)"/);
    const tagsMatch = frontMatter.match(/tags:\s*\[(.*)\]/);
    
    const title = titleMatch ? titleMatch[1] : "Untitled";
    const createdAt = createdAtMatch ? createdAtMatch[1] : new Date().toISOString();
    const updatedAt = updatedAtMatch ? updatedAtMatch[1] : createdAt;
    const id = idMatch ? idMatch[1] : fileName.replace(/\.md$/, "");
    
    let tags: string[] = [];
    if (tagsMatch && tagsMatch[1]) {
      tags = tagsMatch[1]
        .split(",")
        .map((tag: string) => tag.trim().replace(/^"(.*)"$/, "$1"))
        .filter(Boolean);
    }
    
    return {
      id,
      title,
      createdAt,
      updatedAt,
      tags,
      relativePath: fileName,
      filePath,
      content,
      bodyContent: bodyContent.trim(),
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
 * @param title New title (optional)
 * @param content New content (without front matter)
 * @returns The updated note metadata
 */
export async function updateNoteFile(
  paths: StoragePaths,
  noteId: string,
  title?: string,
  content?: string
): Promise<NoteMetadata> {
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
    const updatedTitle = title || note.title;
    const updatedContent = content !== undefined ? content : note.bodyContent;
    
    // Create updated front matter
    const frontMatter = `---
title: "${updatedTitle}"
createdAt: "${note.createdAt}"
updatedAt: "${now}"
id: "${note.id}"
${note.tags && note.tags.length > 0 ? `tags: [${note.tags.map(tag => `"${tag}"`).join(", ")}]` : ""}
---

`;

    // Combine front matter and content
    const fullContent = `${frontMatter}${updatedContent}`;
    
    // Write the updated file
    await fs.writeTextFile(note.filePath, fullContent);
    
    // Return the updated metadata
    return {
      ...note,
      title: updatedTitle,
      updatedAt: now,
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
