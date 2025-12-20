import { createFileRoute } from '@tanstack/react-router'
import { KnowledgePageContent } from '@/components/knowledge/KnowledgePageContent'
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export const Route = createFileRoute('/knowledge')({
  component: KnowledgePage,
})

function KnowledgePage() {
  return (
    <ProtectedRoute>
      <KnowledgePageContent />
    </ProtectedRoute>
  )
}
