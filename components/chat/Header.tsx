import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
	const [isDark, setIsDark] = useState(true);

	useEffect(() => {
		// Check initial theme
		const savedTheme = localStorage.getItem("theme");
		const isDarkMode =
			savedTheme === "dark" ||
			(!savedTheme && document.documentElement.classList.contains("dark"));
		setIsDark(isDarkMode);
	}, []);

	const toggleTheme = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);
		if (newIsDark) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	};

	return (
		<header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-14 items-center justify-between px-4">
				<div className="flex items-center gap-2">
					<SidebarTrigger className="md:hidden" />
				</div>

				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={toggleTheme}
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
