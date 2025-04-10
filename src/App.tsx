import "./App.css";
import "./assets/editor.css";
import '@mdxeditor/editor/style.css';
import MainLayout from "@/components/layout/MainLayout";
import { MainPage } from "@/pages/MainPage";
import { PromptPage } from "@/pages/PromptPage";
import { WindowControls } from "@/components/ui/window-controls";
import { useState } from "react";
import { ActiveItem } from "@/components/layout/MainLayout";

function App() {
  const [activeItem, setActiveItem] = useState<ActiveItem | null>(null);

  // Function to render the appropriate page based on the active item
  const renderPage = () => {
    if (activeItem?.title === "Prompt") {
      return <PromptPage />;
    }
    return <MainPage />;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden rounded-lg">
      {/* Tauri window controls header */}
      <div 
        className="h-[28px] bg-sidebar text-sidebar-foreground w-full flex items-center justify-between border-b rounded-t-lg"
        data-tauri-drag-region
      >
        <WindowControls className="ml-1" />
        <div className="text-xs font-semibold px-2 select-none">DRNKN Notes</div>
      </div>
      <MainLayout onActiveItemChange={setActiveItem}>
        {renderPage()}
      </MainLayout>
    </div>
  );
}

export default App;
