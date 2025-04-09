import { AppSidebar } from "@/components/app-sidebar"
import { useState } from "react"
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


interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  // State to track if Journal is active (will be updated by AppSidebar)
  const [isJournalActive, setIsJournalActive] = useState(false)

  return (
    <SidebarProvider
      style={
        {
          // Use a narrower sidebar width when Journal is active (no secondary sidebar)
          "--sidebar-width": isJournalActive ? "48px" : "350px",
          // Add top margin to account for the header bar
          "--sidebar-top": "28px",
        } as React.CSSProperties
      }
    >
      <AppSidebar onJournalActive={setIsJournalActive} />
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 flex h-10 shrink-0 items-center gap-2 border-b bg-background p-2 z-10">
          {!isJournalActive && (
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
                <BreadcrumbPage className="text-xs">{isJournalActive ? "Today's Journal" : "Notes"}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex-1 overflow-auto rounded-br-lg">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
