import "./App.css";
import "./assets/editor.css";
import '@mdxeditor/editor/style.css';
import MainLayout from "@/components/layout/MainLayout";
import { MainPage } from "@/pages/MainPage";
import { WindowControls } from "@/components/ui/window-controls";

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden rounded-lg">
      {/* Tauri window controls header */}
      <div 
        className="h-[28px] bg-sidebar text-sidebar-foreground w-full flex items-center justify-between border-b rounded-t-lg"
        data-tauri-drag-region
      >
        <WindowControls className="ml-1" />
        <div className="text-xs px-2 select-none">DRNKN Notes</div>
      </div>
      <MainLayout>
        <MainPage />
      </MainLayout>
    </div>
  );
}

export default App;
