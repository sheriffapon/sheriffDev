import type { ReactNode } from "react"

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-headline font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-foreground to-primary">
        {children}
      </h2>
      <div className="mt-2 w-20 h-1 bg-primary rounded-full" />
    </div>
  )
}
