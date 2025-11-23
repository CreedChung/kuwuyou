import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
	title: "库无忧助手",
	description: "您的智能AI助手",
	icons: {
		icon: "/logo.jpg",
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
					<Script
						src="//unpkg.com/react-grab/dist/index.global.js"
						crossOrigin="anonymous"
						strategy="beforeInteractive"
						data-enabled="true"
					/>
				)}
			</head>
			<body className="antialiased">
				{children}
				<Toaster />
			</body>
		</html>
	);
}