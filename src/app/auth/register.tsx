import { createFileRoute } from '@tanstack/react-router'
import { RegisterPageContent } from '@/components/auth/RegisterPageContent'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return <RegisterPageContent />
}
