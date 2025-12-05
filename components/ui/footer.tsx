import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FooterProps {
	logo: React.ReactNode;
	brandName: string;
	socialLinks: Array<{
		href: string;
		label: string;
		icon: React.ReactNode;
	}>;
	mainLinks?: Array<{
		href: string;
		label: string;
	}>;
	legalLinks: Array<{
		href: string;
		label: string;
	}>;
	copyright: {
		text: string;
		license?: string;
	};
}

export function Footer({
	logo,
	brandName,
	socialLinks,
	legalLinks,
	copyright,
}: FooterProps) {
	return (
		<footer className="pb-6 pt-16 lg:pb-8 lg:pt-24 bg-white">
			<div className="px-4 lg:px-8">
				<div className="md:flex md:items-start md:justify-between">
					<ul className="flex list-none mt-6 md:mt-0 space-x-3">
						{socialLinks.map((link) => (
							<li key={`social-${link.href}-${link.label}`}>
								<Button
									variant="secondary"
									size="icon"
									className="h-10 w-10 rounded-full"
									asChild
								>
									<Link href={link.href} target="_blank" aria-label={link.label}>
										{link.icon}
									</Link>
								</Button>
							</li>
						))}
					</ul>
				</div>
				<div className="border-t mt-6 pt-6 md:mt-4 md:pt-8">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div className="flex items-center space-x-3">
							{logo}
							<span className="text-sm font-medium text-black">
								{brandName}
							</span>
						</div>
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							{legalLinks.length > 0 && (
								<div className="flex items-center gap-2">
									{legalLinks.map((link, index) => (
										<div
											key={`legal-${link.href}`}
											className="flex items-center gap-2"
										>
											<Link
												href={link.href}
												className="hover:text-foreground transition-colors"
											>
												{link.label}
											</Link>
											{index < legalLinks.length - 1 && <span>·</span>}
										</div>
									))}
								</div>
							)}
							<div className="whitespace-nowrap text-black">
								<div className="text-black">{copyright.text}</div>
								{copyright.license && <div className="text-black">{copyright.license}</div>}
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
