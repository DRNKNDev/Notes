import { Moon, Settings, Sun } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useTheme from "@/hooks/use-theme";
import { Link } from "@tanstack/react-router";

export function SidebarActions() {

  const { theme, setTheme, effectiveTheme } = useTheme();

  const handleThemeChange = () => {
    // Toggle between light and dark only (no system theme)
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const getThemeLabel = () => {
    // Only light and dark themes
    return theme === 'light' ? "Light Theme" : "Dark Theme";
  };

  return (
    <SidebarMenu>
      {/* Theme Toggle with Tooltip */}
      <SidebarMenuItem className="my-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton 
              onClick={handleThemeChange} 
              className="justify-start w-full"
            >
              {effectiveTheme === 'dark' ? (
                <Moon className="size-4 mr-2" />
              ) : (
                <Sun className="size-4 mr-2" />
              )}
              <span className="text-sm font-medium">
                {getThemeLabel()}
              </span>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side="right" align="center" sideOffset={5}>
            <div className="flex items-center justify-between">
              <p>Toggle Theme</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </SidebarMenuItem>

      {/* Settings Button with Tooltip */}
      <SidebarMenuItem className="my-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton 
              asChild
              className="justify-start w-full"
            >
              <Link
                to="/settings"
                search={{ category: 'general' }}
                activeOptions={{
                  includeSearch: false
                }}
                activeProps={{
                  className: "bg-sidebar-accent text-sidebar-accent-foreground",
                }}
              >
                <Settings className="size-4 mr-2" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side="right" align="center" sideOffset={5}>
            <div className="flex items-center justify-between">
              <p>Settings</p>
              <div className="text-xs text-muted ml-2">⌘,</div>
            </div>
          </TooltipContent>
        </Tooltip>
      </SidebarMenuItem>


    </SidebarMenu>
  );
}
