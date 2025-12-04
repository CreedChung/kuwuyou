import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useThemeStore } from "@/stores/themeStore";

export function Header() {
	const { isDark, toggleDarkMode, theme, applyTheme } = useThemeStore();

	useEffect(() => {
		applyTheme(theme, isDark);
	}, [theme, isDark, applyTheme]);

	return (
		<header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-14 items-center justify-between px-4">
				<div className="flex items-center gap-2">
					<SidebarTrigger className="md:hidden" />
				</div>

				<div className="flex items-center gap-2">
					<button
						id="tutorial-theme-toggle"
						type="button"
						onClick={toggleDarkMode}
						className="rounded-lg p-2 text-foreground transition-colors hover:bg-accent"
						aria-label="切换主题"
					>
						{isDark ? (
							<Sun className="h-5 w-5" />
						) : (
							<Moon className="h-5 w-5" />
						)}
					</button>
				</div>
			</div>
		</header>
	);
}
