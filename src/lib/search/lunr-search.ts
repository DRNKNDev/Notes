import * as fs from "@tauri-apps/plugin-fs";
import { Note, SearchResult, StoragePaths } from "../notes/types";

// We'll use dynamic imports for lunr since it's a third-party library
// This allows us to handle the case where the package isn't installed yet
type LunrIndex = any;
type LunrBuilder = any;

/**
 * Creates a new Lunr search index from the provided notes
 * @param notes Array of notes to index
 * @returns The created Lunr index
 */
export async function createSearchIndex(notes: Note[]): Promise<LunrIndex> {
  try {
    // Dynamically import lunr
    const lunr = await import("lunr");
    
    // Create a new index
    const index = lunr.default(function (this: LunrBuilder) {
      // Define the fields to index
      this.field("title", { boost: 10 }); // Title is more important, so boost it
      this.field("content");
      
      // Add a reference field (the note ID)
      this.ref("id");
      
      // Add each note to the index
      notes.forEach((note) => {
        this.add({
          id: note.id,
          title: note.title,
          content: note.bodyContent,
        });
      });
    });
    
    return index;
  } catch (error) {
    console.error("Error creating search index:", error);
    throw new Error(`Failed to create search index: ${error}`);
  }
}

/**
 * Saves the Lunr index to a file
 * @param index The Lunr index to save
 * @param indexPath Path to save the index to
 */
export async function saveSearchIndex(
  index: LunrIndex,
  indexPath: string
): Promise<void> {
  try {
    // Serialize the index to JSON
    const serialized = JSON.stringify(index);
    
    // Write to the file
    await fs.writeTextFile(indexPath, serialized);
    console.log(`Search index saved to: ${indexPath}`);
  } catch (error) {
    console.error("Error saving search index:", error);
    throw new Error(`Failed to save search index: ${error}`);
  }
}

/**
 * Loads a Lunr index from a file
 * @param indexPath Path to the index file
 * @returns The loaded Lunr index, or null if the file doesn't exist
 */
export async function loadSearchIndex(indexPath: string): Promise<LunrIndex | null> {
  try {
    // Check if the index file exists
    const exists = await fs.exists(indexPath);
    if (!exists) {
      console.log(`Search index not found at: ${indexPath}`);
      return null;
    }
    
    // Read the file
    const serialized = await fs.readTextFile(indexPath);
    
    // Deserialize the index
    const lunr = await import("lunr");
    const index = lunr.default.Index.load(JSON.parse(serialized));
    
    console.log(`Search index loaded from: ${indexPath}`);
    return index;
  } catch (error) {
    console.error("Error loading search index:", error);
    // Return null instead of throwing, so we can fallback to creating a new index
    return null;
  }
}

/**
 * Performs a search using the Lunr index
 * @param index The Lunr index to search
 * @param query The search query
 * @returns Array of search results
 */
export async function searchNotes(
  index: LunrIndex,
  query: string
): Promise<SearchResult[]> {
  if (!index) {
    return [];
  }
  
  try {
    // Perform the search
    const results = index.search(query);
    return results as SearchResult[];
  } catch (error) {
    console.error("Error searching notes:", error);
    // Return empty results on error
    return [];
  }
}

/**
 * Updates the search index when a note is added, updated, or deleted
 * @param paths Storage paths
 * @param notes Current notes array
 * @param index Current Lunr index (or null if none exists)
 * @param operation The operation performed (add, update, delete)
 * @param noteId The ID of the affected note
 * @returns The updated Lunr index
 */
export async function updateSearchIndex(
  paths: StoragePaths,
  notes: Note[],
  _index: LunrIndex | null,
  _operation: "add" | "update" | "delete",
  _noteId: string
): Promise<LunrIndex> {
  // For simplicity, we'll rebuild the entire index
  // In a production app, you might want to optimize this for large collections
  const newIndex = await createSearchIndex(notes);
  
  // Save the updated index
  await saveSearchIndex(newIndex, paths.indexPath);
  
  return newIndex;
}
