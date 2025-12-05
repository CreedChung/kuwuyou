import { Moon, Sun } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
	return (
		<header className="sticky top-0 z-10 border-b border-border bg-white backdrop-blur">
			<div className="flex h-14 items-center justify-between px-4">
				<div className="flex items-center gap-2">
					<SidebarTrigger className="md:hidden" />
				</div>

				<div className="flex items-center gap-2">
					<button
						id="tutorial-theme-toggle"
						type="button"
						className="rounded-lg p-2 text-black transition-colors hover:bg-accent"
						aria-label="切换主题"
					>
						<Sun className="h-5 w-5 text-black" />
					</button>
				</div>
			</div>
		</header>
	);
}
