"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { KnowledgeDocument } from "@/components/knowledge/DocumentTypes";
import { DocumentList } from "@/components/knowledge/DocumentList";
import { KnowledgePagination } from "@/components/knowledge";
import { UploadDocumentDialog } from "@/components/knowledge/UploadDocumentDialog";

export default function KnowledgeDocumentsPage() {
	const params = useParams();
	const router = useRouter();
	const knowledgeId = params.id as string;
	const { toast } = useToast();

	const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [knowledgeName, setKnowledgeName] = useState("");
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

	// 获取文档列表
	const fetchDocuments = async (page: number = 1, word: string = "") => {
		try {
			setLoading(true);

			const apiKey = process.env.ZHIPU_API_KEY;

			if (!apiKey) {
				toast({
					title: "配置错误",
					description: "请配置智谱 API Key",
					variant: "destructive",
				});
				return;
			}

			const params = new URLSearchParams({
				knowledge_id: knowledgeId,
				page: page.toString(),
				size: "20",
			});

			if (word) {
				params.append("word", word);
			}

			const response = await fetch(`/api/knowledge/documents?${params.toString()}`, {
				headers: {
					Authorization: `Bearer ${apiKey}`,
				},
			});

			const data = await response.json();

			if (response.ok && data.code === 200) {
				setDocuments(data.data.list || []);
				setTotal(data.data.total || 0);
				console.log("✅ 成功获取文档列表:", data.data);
			} else {
				toast({
					title: "获取失败",
					description: data.message || "获取文档列表失败",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("获取文档列表错误:", error);
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
		fetchDocuments(currentPage, searchQuery);
	}, [currentPage]);

	// 处理搜索
	const handleSearch = () => {
		setCurrentPage(1);
		fetchDocuments(1, searchQuery);
	};

	// 上传成功后刷新列表
	const handleUploadSuccess = () => {
		fetchDocuments(currentPage, searchQuery);
	};

	// 过滤文档（本地过滤，用于即时反馈）
	const filteredDocuments = documents;

	return (
		<div className="flex h-screen bg-background">
			{/* 主内容区 */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* 顶部导航栏 */}
				<div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="p-4">
						<div className="flex items-center gap-3 mb-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => router.push("/knowledge")}
								className="gap-2"
							>
								<ArrowLeft className="h-4 w-4" />
								返回知识库列表
							</Button>
						</div>

						<div className="flex items-center gap-3">
							<div className="flex-1 flex items-center gap-2">
								<Input
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleSearch()}
									placeholder="搜索文档名称..."
									className="max-w-md"
								/>
								<Button onClick={handleSearch}>搜索</Button>
							</div>
							<Badge variant="secondary" className="h-10 px-4">
								共 {total} 个文档
							</Badge>
							<Button
								className="gap-2"
								onClick={() => setUploadDialogOpen(true)}
							>
								<Plus className="h-4 w-4" />
								上传文档
							</Button>
						</div>
					</div>
				</div>

				{/* 文档列表 */}
				<div className="flex-1 overflow-y-auto p-6">
					<DocumentList
						loading={loading}
						documents={filteredDocuments}
						searchQuery={searchQuery}
						onDocumentClick={(doc) => {
							console.log("点击文档:", doc);
							// 这里可以添加查看文档详情的逻辑
						}}
					/>
				</div>

				{/* 分页 */}
				{!loading && (
					<KnowledgePagination
						currentPage={currentPage}
						total={total}
						pageSize={20}
						onPageChange={setCurrentPage}
					/>
				)}
			</div>

			{/* 上传对话框 */}
			<UploadDocumentDialog
				open={uploadDialogOpen}
				onOpenChange={setUploadDialogOpen}
				knowledgeId={knowledgeId}
				onUploadSuccess={handleUploadSuccess}
			/>
		</div>
	);
}