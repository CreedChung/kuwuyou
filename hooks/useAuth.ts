import { useAuthStore } from "@/stores/authStore";
import { useToast } from "./use-toast";

/**
 * useAuth hook - 简化认证状态和方法的访问
 */
export function useAuth() {
	const { toast } = useToast();
	const store = useAuthStore();

	return {
		user: store.user,
		loading: store.loading,
		signUp: (email: string, password: string, username: string) =>
			store.signUp(email, password, username, toast),
		signIn: (email: string, password: string) =>
			store.signIn(email, password, toast),
		signInWithProvider: (provider: "google" | "github") =>
			store.signInWithProvider(provider, toast),
		signOut: () => store.signOut(toast),
		resetPassword: (email: string) => store.resetPassword(email, toast),
		updatePassword: (newPassword: string) =>
			store.updatePassword(newPassword, toast),
	};
}