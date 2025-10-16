import type { ReactNode } from "react"

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center mb-10">
      <h2 className="text-2xl sm:text-3xl font-headline font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-foreground to-primary">
        {children}
      </h2>
      <div className="mt-1.5 w-16 h-0.5 bg-primary rounded-full" />
    </div>
  )
}
