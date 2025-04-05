import { useState, useEffect } from "react";
import "./App.css";
import "./assets/editor.css";
import '@mdxeditor/editor/style.css';
import { MainLayout } from "@/components/layout/MainLayout";
import { MainPage } from "@/pages/MainPage";
import { SearchPage } from "@/pages/SearchPage";
import { PromptPage } from "@/pages/PromptPage";

type Page = 'main' | 'search' | 'prompt';

function App() {
  const [userName] = useState("DRNKNDev");
  const [activePage, setActivePage] = useState<Page>('main');
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Command/Ctrl key is pressed
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'j': // Cmd/Ctrl + J for Main page
            e.preventDefault();
            setActivePage('main');
            break;
          case 'k': // Cmd/Ctrl + K for Search page
            e.preventDefault();
            setActivePage('search');
            break;
          case 'l': // Cmd/Ctrl + L for Prompt page
            e.preventDefault();
            setActivePage('prompt');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const renderPage = () => {
    switch (activePage) {
      case 'main':
        return <MainPage />;
      case 'search':
        return <SearchPage />;
      case 'prompt':
        return <PromptPage />;
      default:
        return <MainPage />;
    }
  };
  
  return (
    <MainLayout userName={userName}>
      {renderPage()}
    </MainLayout>
  );
}

export default App;
