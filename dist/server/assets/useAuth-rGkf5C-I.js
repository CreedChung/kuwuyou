import { u as useToast, a as useAuthStore } from "./router-CXH_V1gJ.js";
function useAuth() {
  const { toast } = useToast();
  const store = useAuthStore();
  return {
    user: store.user,
    loading: store.loading,
    signUp: (email, password, username) => store.signUp(email, password, username, toast),
    signIn: (email, password) => store.signIn(email, password, toast),
    signInWithProvider: (provider) => store.signInWithProvider(provider, toast),
    signOut: () => store.signOut(toast),
    resetPassword: (email) => store.resetPassword(email, toast),
    updatePassword: (newPassword) => store.updatePassword(newPassword, toast)
  };
}
export {
  useAuth as u
};
