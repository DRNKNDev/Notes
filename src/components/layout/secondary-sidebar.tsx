import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { NoteSearch } from "@/components/search/note-search";
import { NotesPanel } from "./panels/notes-panel";
import { SettingsPanel } from "./panels/settings-panel";
import type { SecondarySidebarContent } from "@/types/layout";

interface SecondarySidebarProps {
  content: SecondarySidebarContent;
}

/**
 * Secondary sidebar - Content sidebar (350px width)
 * Shows different content based on the current route
 */
export function SecondarySidebar({ content }: SecondarySidebarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Global search dialog */}
      <NoteSearch open={searchOpen} onOpenChange={setSearchOpen} />

      <Sidebar collapsible="none" className="flex-1">
        {content === "notes" && <NotesPanel setSearchOpen={setSearchOpen} />}
        {content === "settings" && <SettingsPanel />}
      </Sidebar>
    </>
  );
}
