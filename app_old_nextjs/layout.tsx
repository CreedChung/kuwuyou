import type { Metadata } from "next";
// import Script from "next/script"; // TODO: 迁移到 TanStack Start
import { Toaster } from "@/components/ui/toaster";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import "./globals.css";

export const metadata: Metadata = {
	title: "库无忧助手",
	description: "您的智能AI助手",
	icons: {
		icon: "/icon.jpg",
		shortcut: "/icon.jpg",
		apple: "/icon.jpg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="zh-CN" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								// 固定使用白天模式，移除 dark 类
								document.documentElement.classList.remove('dark');
							})();
						`,
					}}
				/>
				{process.env.NODE_ENV === "development" && (
					<>
						<Script
							src="https://unpkg.com/react-scan/dist/auto.global.js"
							strategy="beforeInteractive"
						/>
						<Script
							src="//unpkg.com/react-grab/dist/index.global.js"
							crossOrigin="anonymous"
							strategy="beforeInteractive"
							data-enabled="true"
						/>
					</>
				)}
			</head>
			<body className="antialiased">
				<AuthInitializer>
					{children}
				</AuthInitializer>
				<Toaster />
			</body>
		</html>
	);
}