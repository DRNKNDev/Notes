import { AppSidebar } from "@/components/app-sidebar"
import React, { useState, useEffect } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Define the active item type
export interface ActiveItem {
  title: string
  url: string
  icon: any
  isActive: boolean
}


interface MainLayoutProps {
  children: React.ReactNode
  onActiveItemChange?: (item: ActiveItem) => void
}

export default function MainLayout({ children, onActiveItemChange }: MainLayoutProps) {
  // State to track if we should hide the secondary sidebar (for Journal and Prompt pages)
  const [hideSecondarySidebar, setHideSecondarySidebar] = useState(false)
  // State to track the active item
  const [activeItem, setActiveItem] = useState<ActiveItem | null>(null)
  
  // Pass activeItem to App.tsx if onActiveItemChange is provided
  useEffect(() => {
    if (activeItem && onActiveItemChange) {
      onActiveItemChange(activeItem);
    }
    
    // Update hideSecondarySidebar state based on active item
    if (activeItem) {
      setHideSecondarySidebar(activeItem.title === "Journal" || activeItem.title === "Prompt");
    }
  }, [activeItem, onActiveItemChange])

  return (
    <SidebarProvider
      style={
        {
          // Use a narrower sidebar width when Journal or Prompt is active (no secondary sidebar)
          "--sidebar-width": hideSecondarySidebar ? "48px" : "350px",
          // Add top margin to account for the header bar
          "--sidebar-top": "28px",
        } as React.CSSProperties
      }
    >
      <AppSidebar onActiveItemChange={setActiveItem} />
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 flex h-10 shrink-0 items-center gap-2 border-b bg-background p-2 z-10">
          {!hideSecondarySidebar && (
            <>
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </>
          )}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block text-xs">
                <BreadcrumbLink href="#">All Notes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xs">
                {activeItem?.title === "Journal" ? "Today's Journal" : 
                 activeItem?.title === "Prompt" ? "Prompt your Notes" : activeItem?.title || "Notes"}
              </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex-1 overflow-hidden rounded-br-lg">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
