import { createFileRoute } from '@tanstack/react-router'
import { ChatPageContent } from '@/components/chat/ChatPageContent'
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export const Route = createFileRoute('/chat')({
  component: ChatPage,
})

function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatPageContent />
    </ProtectedRoute>
  )
}
