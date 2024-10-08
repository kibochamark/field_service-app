"use client"
import { Button } from "@/shadcn/ui/button"
import { AlertTriangle } from "lucide-react"

export default function ErrorComponent({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full px-4 py-8 bg-card rounded-lg shadow-lg text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          Oops! Something went wrong
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          We apologize for the inconvenience. Our team has been notified and is working on resolving the issue.
        </p>
        {error.message && (
          <p className="mt-4 text-sm text-destructive border border-destructive rounded-md p-2">
            Error details: {error.message}
          </p>
        )}
        <div className="mt-6">
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          If the problem persists, please contact our support team.
        </p>
      </div>
    </div>
  )
}