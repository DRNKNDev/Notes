// No React import needed
import { X, Minus, Square } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the window controls style
const controlButtonStyle = "flex items-center justify-center w-3 h-3 rounded-full transition-colors";
const controlIconStyle = "w-2 h-2 opacity-0 group-hover:opacity-100";

interface WindowControlsProps {
  className?: string;
}

export function WindowControls({ className }: WindowControlsProps) {
  const handleClose = () => {
    // @ts-ignore - Tauri API access
    if (window.__TAURI__?.window) {
      // @ts-ignore - Tauri API access
      window.__TAURI__.window.appWindow.close();
    }
  };

  const handleMinimize = () => {
    // @ts-ignore - Tauri API access
    if (window.__TAURI__?.window) {
      // @ts-ignore - Tauri API access
      window.__TAURI__.window.appWindow.minimize();
    }
  };

  const handleMaximize = () => {
    // @ts-ignore - Tauri API access
    if (window.__TAURI__?.window) {
      // @ts-ignore - Tauri API access
      window.__TAURI__.window.appWindow.toggleMaximize();
    }
  };

  return (
    <div className={cn("flex items-center h-full", className)}>
      <div className="flex items-center gap-2 px-2 group">
        <button
          onClick={handleClose}
          className={`${controlButtonStyle} bg-red-500 hover:bg-red-600`}
          aria-label="Close"
        >
          <X className={`${controlIconStyle} text-red-900`} />
        </button>
        <button
          onClick={handleMinimize}
          className={`${controlButtonStyle} bg-yellow-500 hover:bg-yellow-600`}
          aria-label="Minimize"
        >
          <Minus className={`${controlIconStyle} text-yellow-900`} />
        </button>
        <button
          onClick={handleMaximize}
          className={`${controlButtonStyle} bg-green-500 hover:bg-green-600`}
          aria-label="Maximize"
        >
          <Square className={`${controlIconStyle} text-green-900`} />
        </button>
      </div>
    </div>
  );
}
