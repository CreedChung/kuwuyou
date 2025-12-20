"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import {
	Knowledge,
	KnowledgeSidebar,
	KnowledgeSearchBar,
	KnowledgeList,
	KnowledgePagination,
} from "@/components/knowledge";

export default function KnowledgePage() {
	return (
		<ProtectedRoute>
			<KnowledgePageContent />
		</ProtectedRoute>
	);
}

function KnowledgePageContent() {
	const [knowledgeList, setKnowledgeList] = useState<Knowledge[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [selectedKnowledge, setSelectedKnowledge] = useState<Knowledge | null>(null);
	const { toast } = useToast();

	// 获取知识库列表
	const fetchKnowledgeList = async (page: number = 1) => {
		try {
			setLoading(true);

			const response = await fetch(`/api/knowledge?page=${page}&size=10`);

			const data = await response.json();

			if (response.ok && data.code === 200) {
				setKnowledgeList(data.data.list || []);
				setTotal(data.data.total || 0);
				console.log("✅ 成功获取知识库列表:", data.data);
			} else {
				toast({
					title: "获取失败",
					description: data.message || "获取知识库列表失败",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("获取知识库列表错误:", error);
			toast({
				title: "请求错误",
				description: "网络错误，请稍后重试",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchKnowledgeList(currentPage);
	}, [currentPage]);

	// 过滤知识库
	const filteredKnowledgeList = knowledgeList.filter((knowledge) =>
		knowledge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		knowledge.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="flex h-screen bg-background">
			{/* 左侧边栏 */}
			<KnowledgeSidebar 
				total={total} 
				currentCount={filteredKnowledgeList.length} 
			/>

			{/* 右侧内容区域 */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* 顶部搜索栏 */}
				<KnowledgeSearchBar
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
				/>

				{/* 知识库列表 */}
				<div className="flex-1 overflow-y-auto p-6">
					<KnowledgeList
						loading={loading}
						knowledgeList={filteredKnowledgeList}
						searchQuery={searchQuery}
						onKnowledgeClick={setSelectedKnowledge}
					/>
				</div>

				{/* 分页 */}
				{!loading && (
					<KnowledgePagination
						currentPage={currentPage}
						total={total}
						pageSize={10}
						onPageChange={setCurrentPage}
					/>
				)}
			</div>
		</div>
	);
}