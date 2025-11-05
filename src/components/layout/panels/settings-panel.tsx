import { Palette, Sliders, BookText, Moon, Sun, Settings } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useIsMobile } from "@/hooks/use-mobile";
import { useThemeContext } from "@/components/theme-provider";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Settings panel for the secondary sidebar
 * Shows the settings menu categories
 */
export function SettingsPanel() {
  const routerState = useRouterState();
  const isMobile = useIsMobile();
  const { mode, setMode } = useThemeContext();

  // Get settings category from route search params
  const currentMatch = routerState.matches[routerState.matches.length - 1];
  const settingsCategory =
    currentMatch?.search && "category" in currentMatch.search
      ? String(currentMatch.search.category)
      : "general";

  return (
    <>
      <SidebarHeader className="h-10 border-b border-muted p-0">
        <div className="flex w-full h-10 items-center justify-between px-2">
          <span className="text-foreground font-semibold">Settings</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full">
          <div className="p-2">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link
                      to="/settings"
                      search={{ category: "general" }}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted",
                        settingsCategory === "general" && "bg-muted font-medium"
                      )}
                    >
                      <Sliders className="h-4 w-4" />
                      <span className="text-sm">General</span>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link
                      to="/settings"
                      search={{ category: "themes" }}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted",
                        settingsCategory === "themes" && "bg-muted font-medium"
                      )}
                    >
                      <Palette className="h-4 w-4" />
                      <span className="text-sm">Themes</span>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </ScrollArea>
      </SidebarContent>

      {/* Mobile-only footer with navigation buttons */}
      {isMobile && (
        <SidebarFooter className="border-t border-muted">
          <div className="flex justify-between items-center p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <Link
                    to="/notes"
                    activeProps={{
                      className: "bg-accent text-accent-foreground",
                    }}
                    activeOptions={{
                      exact: false,
                    }}
                  >
                    <BookText className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" sideOffset={10}>
                <div className="flex items-center justify-between gap-2">
                  <p>Notes</p>
                  <div className="text-xs text-muted">⌘L</div>
                </div>
              </TooltipContent>
            </Tooltip>

            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setMode(mode === "light" ? "dark" : "light")}
                  >
                    {mode === "dark" ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" sideOffset={10}>
                  <p>Toggle Theme</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link
                      to="/settings"
                      search={{ category: "general" }}
                      activeProps={{
                        className: "bg-accent text-accent-foreground",
                      }}
                      activeOptions={{
                        exact: false,
                      }}
                    >
                      <Settings className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" sideOffset={10}>
                  <div className="flex items-center justify-between gap-2">
                    <p>Settings</p>
                    <div className="text-xs text-muted">⌘,</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </SidebarFooter>
      )}
    </>
  );
}
