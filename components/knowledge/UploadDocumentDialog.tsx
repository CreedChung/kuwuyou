"use client";

import { useState } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface UploadDocumentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	knowledgeId: string;
	onUploadSuccess: () => void;
}

export function UploadDocumentDialog({
	open,
	onOpenChange,
	knowledgeId,
	onUploadSuccess,
}: UploadDocumentDialogProps) {
	const { toast } = useToast();
	const [files, setFiles] = useState<File[]>([]);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);

	// 处理文件选择
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			setFiles(selectedFiles);
		}
	};

	// 移除文件
	const removeFile = (index: number) => {
		setFiles(files.filter((_, i) => i !== index));
	};

	// 上传文档
	const handleUpload = async () => {
		if (files.length === 0) {
			toast({
				title: "请选择文件",
				description: "请至少选择一个文件上传",
				variant: "destructive",
			});
			return;
		}

		try {
			setUploading(true);
			setProgress(0);

			const apiKey = process.env.NEXT_PUBLIC_ZHIPU_API_KEY;
			if (!apiKey) {
				toast({
					title: "配置错误",
					description: "请配置智谱 API Key",
					variant: "destructive",
				});
				return;
			}

			// 构建 FormData
			const formData = new FormData();
			files.forEach((file) => {
				formData.append("files", file);
			});

			// 模拟进度
			const progressInterval = setInterval(() => {
				setProgress((prev) => {
					if (prev >= 90) {
						clearInterval(progressInterval);
						return 90;
					}
					return prev + 10;
				});
			}, 200);

			const response = await fetch(`/api/knowledge/upload?id=${knowledgeId}`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
				},
				body: formData,
			});

			clearInterval(progressInterval);
			setProgress(100);

			const data = await response.json();

			if (response.ok && data.code === 200) {
				const successCount = data.data?.successInfos?.length || 0;
				const failCount = data.data?.failedInfos?.length || 0;

				toast({
					title: "上传完成",
					description: `成功上传 ${successCount} 个文件${failCount > 0 ? `, ${failCount} 个文件失败` : ""}`,
				});

				// 如果有失败的文件,显示详细信息
				if (failCount > 0) {
					data.data.failedInfos.forEach((failInfo: any) => {
						console.error(`文件 ${failInfo.fileName} 上传失败: ${failInfo.failReason}`);
					});
				}

				onUploadSuccess();
				handleClose();
			} else {
				toast({
					title: "上传失败",
					description: data.message || "上传文档失败",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("上传文档错误:", error);
			toast({
				title: "上传错误",
				description: "网络错误，请稍后重试",
				variant: "destructive",
			});
		} finally {
			setUploading(false);
		}
	};

	// 关闭对话框
	const handleClose = () => {
		if (!uploading) {
			setFiles([]);
			setProgress(0);
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>上传文档</DialogTitle>
					<DialogDescription>
						支持 txt, doc, pdf, docx, ppt, pptx, md, xls, xlsx, csv 等格式
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{/* 文件选择 */}
					<div className="space-y-2">
						<Label>选择文件</Label>
						<div className="flex items-center gap-2">
							<Input
								type="file"
								multiple
								onChange={handleFileChange}
								disabled={uploading}
								accept=".txt,.doc,.pdf,.docx,.ppt,.pptx,.md,.xls,.xlsx,.csv"
							/>
						</div>
					</div>

					{/* 已选文件列表 */}
					{files.length > 0 && (
						<div className="space-y-2">
							<Label>已选文件 ({files.length})</Label>
							<div className="border rounded-lg divide-y max-h-[200px] overflow-y-auto">
								{files.map((file, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-3 hover:bg-accent/50 transition-colors"
									>
										<div className="flex items-center gap-2 flex-1 min-w-0">
											<FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
											<span className="text-sm truncate">{file.name}</span>
											<span className="text-xs text-muted-foreground flex-shrink-0">
												({(file.size / 1024).toFixed(1)} KB)
											</span>
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => removeFile(index)}
											disabled={uploading}
											className="flex-shrink-0"
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								))}
							</div>
						</div>
					)}

					{/* 上传进度 */}
					{uploading && (
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span>上传进度</span>
								<span>{progress}%</span>
							</div>
							<Progress value={progress} />
						</div>
					)}
				</div>

				{/* 操作按钮 */}
				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={handleClose} disabled={uploading}>
						取消
					</Button>
					<Button onClick={handleUpload} disabled={uploading || files.length === 0}>
						{uploading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								上传中...
							</>
						) : (
							<>
								<Upload className="mr-2 h-4 w-4" />
								开始上传
							</>
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}