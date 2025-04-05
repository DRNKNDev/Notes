import { ReactNode } from "react"

interface MainLayoutProps {
  children: ReactNode
  userName: string
}

export function MainLayout({ children, userName }: MainLayoutProps) {
  return (
    <div className="fixed inset-0 p-8 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-muted-foreground/70 text-xs">
            Hi{" "}
            <a
              href="#"
              className="text-muted-foreground/70 hover:text-muted-foreground transition-colors"
            >
              {userName}
            </a>
            ,
          </p>
          <p className="text-muted-foreground/70 text-xs">
            You have{" "}
            <a
              href="#"
              className="text-muted-foreground/70 hover:text-muted-foreground transition-colors"
            >
              13 ongoing tasks
            </a>
          </p>
        </div>
        <a
          href="#"
          className="text-muted-foreground/70 hover:text-muted-foreground transition-colors text-sm"
        >
          April 4, 2025
        </a>
      </div>
      <div className="flex-grow overflow-hidden">{children}</div>
    </div>
  )
}
