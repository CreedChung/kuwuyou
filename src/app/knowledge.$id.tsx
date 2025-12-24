import { createFileRoute, useParams, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowLeft, Plus, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { KnowledgeDocument } from '@/components/knowledge/DocumentTypes'
import { DocumentList } from '@/components/knowledge/DocumentList'
import { KnowledgePagination } from '@/components/knowledge'
import { UploadDocumentDialog } from '@/components/knowledge/UploadDocumentDialog'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const Route = createFileRoute('/knowledge/$id')({
  component: KnowledgeDocumentsPage,
})

function KnowledgeDocumentsPage() {
  return (
    <ProtectedRoute>
      <KnowledgeDocumentsContent />
    </ProtectedRoute>
  )
}

function KnowledgeDocumentsContent() {
  const { id: knowledgeId } = useParams({ from: '/knowledge/$id' })
  const navigate = useNavigate()
  const { toast } = useToast()

  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const fetchDocuments = async (page: number = 1, word: string = '', isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      
      const params = new URLSearchParams({
        knowledge_id: knowledgeId,
        page: page.toString(),
        size: '20',
      })
      if (word) params.append('word', word)

      const response = await fetch(`/api/knowledge/documents?${params.toString()}`)
      const data = await response.json()

      if (response.ok && data.code === 200) {
        setDocuments(data.data.list || [])
        setTotal(data.data.total || 0)
      } else {
        toast({ title: '获取失败', description: data.message || '获取文档列表失败', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: '请求错误', description: '网络错误，请稍后重试', variant: 'destructive' })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDocuments(currentPage, searchQuery)
  }, [currentPage])

  const handleSearch = () => {
    setCurrentPage(1)
    fetchDocuments(1, searchQuery, false)
  }

  const handleRefresh = () => {
    fetchDocuments(currentPage, searchQuery, true)
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border/40 bg-background/95 backdrop-blur">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/knowledge' })} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                返回知识库列表
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="搜索文档名称..."
                  className="max-w-md"
                />
                <Button onClick={handleSearch}>搜索</Button>
              </div>
              <Badge variant="secondary" className="h-10 px-4">共 {total} 个文档</Badge>
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                刷新
              </Button>
              <Button className="gap-2" onClick={() => setUploadDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                上传文档
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <DocumentList
            loading={loading}
            refreshing={refreshing}
            documents={documents}
            searchQuery={searchQuery}
            onDocumentClick={(doc) => console.log('点击文档:', doc)}
          />
        </div>

        {!loading && (
          <KnowledgePagination
            currentPage={currentPage}
            total={total}
            pageSize={20}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <UploadDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        knowledgeId={knowledgeId}
        onUploadSuccess={() => fetchDocuments(currentPage, searchQuery, true)}
      />
    </div>
  )
}
