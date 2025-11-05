/**
 * Layout configuration types
 * Defines how the layout should behave for different routes
 */

export type SecondarySidebarContent = "notes" | "settings" | null;

export interface LayoutConfig {
  /** Whether to show the primary sidebar (icon sidebar) */
  showPrimarySidebar: boolean;

  /** Whether to show the secondary sidebar (content sidebar) */
  showSecondarySidebar: boolean;

  /** What content to show in the secondary sidebar */
  secondarySidebarContent: SecondarySidebarContent;

  /** Whether the header should be visible */
  showHeader: boolean;

  /** Whether we're in distraction-free mode (hides all UI) */
  isDistractionFree: boolean;
}

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  showPrimarySidebar: true,
  showSecondarySidebar: true,
  secondarySidebarContent: null,
  showHeader: true,
  isDistractionFree: false,
};

/**
 * Determines layout configuration based on the current route path
 */
export function getLayoutConfig(pathname: string): LayoutConfig {
  // Prompt page - no sidebars
  if (pathname.startsWith("/prompt")) {
    return {
      showPrimarySidebar: true,
      showSecondarySidebar: false,
      secondarySidebarContent: null,
      showHeader: true,
      isDistractionFree: false,
    };
  }

  // Journal pages - no secondary sidebar
  if (pathname.startsWith("/journal")) {
    return {
      showPrimarySidebar: true,
      showSecondarySidebar: false,
      secondarySidebarContent: null,
      showHeader: true,
      isDistractionFree: false,
    };
  }

  // Notes pages - show notes in secondary sidebar
  if (pathname.startsWith("/notes")) {
    return {
      showPrimarySidebar: true,
      showSecondarySidebar: true,
      secondarySidebarContent: "notes",
      showHeader: true,
      isDistractionFree: false,
    };
  }

  // Settings pages - show settings menu in secondary sidebar
  if (pathname.startsWith("/settings")) {
    return {
      showPrimarySidebar: true,
      showSecondarySidebar: true,
      secondarySidebarContent: "settings",
      showHeader: true,
      isDistractionFree: false,
    };
  }

  // Default configuration
  return DEFAULT_LAYOUT_CONFIG;
}
