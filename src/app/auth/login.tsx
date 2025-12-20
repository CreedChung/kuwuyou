import { createFileRoute } from '@tanstack/react-router'
import { LoginPageContent } from '@/components/auth/LoginPageContent'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  return <LoginPageContent />
}
