/**
 * Types for the notes management system
 */

/**
 * Metadata for a note, extracted from the front matter
 */
export interface NoteMetadata {
  /** Unique identifier for the note */
  id: string;
  /** Title of the note */
  title: string;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
  /** Optional tags array */
  tags?: string[];
  /** Relative file path within the notes directory */
  relativePath: string;
  /** Full file path to the note */
  filePath: string;
}

/**
 * A complete note with metadata and content
 */
export interface Note extends NoteMetadata {
  /** The full content of the note, including front matter */
  content: string;
  /** The content of the note without front matter */
  bodyContent: string;
}

/**
 * Search result from Lunr
 */
export interface SearchResult {
  /** The note ID that matched */
  id: string;
  /** The search score (higher is better match) */
  score: number;
  /** The matched terms and their positions */
  matchData: {
    metadata: Record<string, Record<string, { position: number[][] }>>;
  };
}

/**
 * Paths for the notes storage
 */
export interface StoragePaths {
  /** Base storage directory selected by the user */
  baseStoragePath: string;
  /** Path to the notes subdirectory */
  notesPath: string;
  /** Path to the index.json file */
  indexPath: string;
}
