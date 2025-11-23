// 知识库类型定义
export interface Knowledge {
	id: string;
	name: string;
	description: string;
	icon: string;
	background: string;
	embedding_id: number;
	document_size: number;
	length: number;
	word_num: number;
}

// 背景颜色映射
export const backgroundColors: Record<string, string> = {
	blue: "bg-blue-500/10 border-blue-500/20",
	green: "bg-green-500/10 border-green-500/20",
	purple: "bg-purple-500/10 border-purple-500/20",
	orange: "bg-orange-500/10 border-orange-500/20",
	red: "bg-red-500/10 border-red-500/20",
	yellow: "bg-yellow-500/10 border-yellow-500/20",
	pink: "bg-pink-500/10 border-pink-500/20",
	indigo: "bg-indigo-500/10 border-indigo-500/20",
};

// 图标映射
export const iconMap: Record<string, string> = {
	book: "📚",
	file: "📄",
	folder: "📁",
	star: "⭐",
	heart: "❤️",
	rocket: "🚀",
	bulb: "💡",
	flag: "🚩",
};

// 格式化数字工具函数
export const formatNumber = (num: number): string => {
	if (num >= 10000) {
		return `${(num / 10000).toFixed(1)}万`;
	}
	return num.toLocaleString();
};