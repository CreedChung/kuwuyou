import { createFileRoute } from '@tanstack/react-router'
import { AdminPageContent } from '@/components/admin/AdminPageContent'
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminPageContent />
    </ProtectedRoute>
  )
}
