const TUTORIAL_STORAGE_KEY = "chat-tutorial-completed";
function hasTutorialCompleted() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(TUTORIAL_STORAGE_KEY) === "true";
}
function markTutorialCompleted() {
  if (typeof window === "undefined") return;
  localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
}
function resetTutorial() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TUTORIAL_STORAGE_KEY);
}
export {
  hasTutorialCompleted as h,
  markTutorialCompleted as m,
  resetTutorial as r
};
