import { Moon, Settings, Sun } from "lucide-react";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import useTheme from "@/hooks/use-theme";

export function SidebarActions() {

  const { theme, setTheme, effectiveTheme } = useTheme();

  const handleThemeChange = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeLabel = () => {
    if (theme === 'light') return "Light Theme";
    if (theme === 'dark') return "Dark Theme";
    return "System Theme";
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
              onClick={() => {}} 
              className="justify-start w-full"
            >
              <Settings className="size-4 mr-2" />
              <span className="text-sm font-medium">Settings</span>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side="right" align="center" sideOffset={5}>
            <div className="flex items-center justify-between">
              <p>Settings</p>
              <div className="text-xs text-muted-foreground ml-2">⌘,</div>
            </div>
          </TooltipContent>
        </Tooltip>
      </SidebarMenuItem>


    </SidebarMenu>
  );
}
