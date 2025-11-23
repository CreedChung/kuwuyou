// 文档类型定义
export interface KnowledgeDocument {
	id: string;
	knowledge_type: number;
	custom_separator: string[];
	sentence_size: number;
	length: number;
	word_num: number;
	name: string;
	url: string;
	embedding_stat: number;
	failInfo?: {
		embedding_code: number;
		embedding_msg: string;
	};
}

// 向量化状态映射
export const embeddingStatusMap: Record<number, { label: string; color: string }> = {
	0: { label: "待处理", color: "bg-gray-500" },
	1: { label: "处理中", color: "bg-blue-500" },
	2: { label: "已完成", color: "bg-green-500" },
	3: { label: "失败", color: "bg-red-500" },
};

// 文档切片类型映射
export const knowledgeTypeMap: Record<number, string> = {
	1: "智能切片",
	2: "自定义切片",
};