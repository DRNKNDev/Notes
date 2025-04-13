import { createFileRoute, Navigate } from "@tanstack/react-router";
import { format } from "date-fns";

// This route creates a new journal entry with the current date
// and redirects to it automatically
export const Route = createFileRoute('/journal')({  
  component: JournalRedirect
});

function JournalRedirect() {
  // Generate today's date in a readable format
  const today = new Date();
  const formattedDate = format(today, "yyyy-MM-dd");
  
  // Create a unique ID for today's journal entry
  // Using the date as the ID ensures we get the same entry for the same day
  const journalEntryId = formattedDate;
  
  return (
    // Redirect to today's journal entry
    <Navigate to="/journal/$entryId" params={{ entryId: journalEntryId }} />
  );
}
