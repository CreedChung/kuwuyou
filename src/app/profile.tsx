import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, BarChart3, Calendar, Loader2, Mail, Save, Trophy, User } from 'lucide-react'
import { useId, useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import { getProfile, updateProfile, type ProfileData, type StatsData, type AchievementData } from '@/services/ProfileService'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

type ProfileSection = 'basic' | 'stats' | 'achievements'

const sidebarItems = [
  { id: 'basic' as const, label: '基本信息', icon: User },
  { id: 'stats' as const, label: '使用统计', icon: BarChart3 },
  { id: 'achievements' as const, label: '成就徽章', icon: Trophy },
]

function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  )
}

function ProfilePageContent() {
  const usernameId = useId()
  const emailId = useId()
  const { toast } = useToast()
  const { user, initialized, initialize } = useAuthStore()

  const [activeSection, setActiveSection] = useState<ProfileSection>('basic')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState<ProfileData>({ id: '', username: '用户', email: 'user@example.com', joinDate: '2024-01-01' })
  const [stats, setStats] = useState<StatsData>({ conversationCount: 0, messageCount: 0, activeDays: 0 })
  const [achievements, setAchievements] = useState<AchievementData[]>([])
  const [editedProfile, setEditedProfile] = useState(profile)

  useEffect(() => {
    if (!initialized) initialize()
  }, [initialized, initialize])

  useEffect(() => {
    const loadProfile = async () => {
      if (!initialized) return
      setLoading(true)
      const data = await getProfile()
      if (data) {
        setProfile(data.profile)
        setEditedProfile(data.profile)
        setStats(data.stats)
        setAchievements(data.achievements)
      }
      setLoading(false)
    }
    loadProfile()
  }, [user, initialized])

  const handleSave = async () => {
    setSaving(true)
    const result = await updateProfile({ username: editedProfile.username })
    if (result.success) {
      setProfile(editedProfile)
      setIsEditing(false)
      toast({ title: '保存成功', description: '您的资料已更新' })
    } else {
      toast({ title: '保存失败', description: result.error || '更新资料失败', variant: 'destructive' })
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 border-r border-border/40 bg-muted/30 flex flex-col">
        <div className="p-4 border-b border-border/40">
          <Link to="/chat">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 hover:bg-muted">
              <ArrowLeft className="h-4 w-4" />
              <span>返回聊天</span>
            </Button>
          </Link>
        </div>
        <div className="px-4 py-6">
          <h1 className="text-xl font-semibold">个人资料</h1>
        </div>
        <nav className="flex-1 px-2 pb-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeSection === item.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-8">
          {activeSection === 'basic' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">基本信息</h2>
                  <p className="text-sm text-muted-foreground">管理你的个人资料</p>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline">编辑资料</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={() => { setEditedProfile(profile); setIsEditing(false) }} variant="outline" size="sm" disabled={saving}>取消</Button>
                    <Button onClick={handleSave} size="sm" disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {saving ? '保存中...' : '保存'}
                    </Button>
                  </div>
                )}
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5" />个人资料</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Avatar className="h-20 w-20 border-4 border-primary/20">
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary/60">
                      {profile.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {!isEditing ? (
                    <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                      <div><p className="text-xs text-muted-foreground">用户名</p><p className="text-sm font-medium">{profile.username}</p></div>
                      <div><p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />邮箱</p><p className="text-sm font-medium">{profile.email}</p></div>
                      <div><p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />加入日期</p><p className="text-sm font-medium">{profile.joinDate}</p></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={usernameId}>用户名</Label>
                        <Input id={usernameId} value={editedProfile.username} onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={emailId}>邮箱</Label>
                        <Input id={emailId} value={editedProfile.email} disabled className="bg-muted" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'stats' && (
            <div className="space-y-6">
              <div><h2 className="text-2xl font-bold mb-2">使用统计</h2></div>
              <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5" />统计数据</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-6 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="text-3xl font-bold text-primary">{stats.conversationCount}</div>
                      <div className="text-sm text-muted-foreground mt-2">对话数</div>
                    </div>
                    <div className="text-center p-6 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="text-3xl font-bold text-primary">{stats.messageCount}</div>
                      <div className="text-sm text-muted-foreground mt-2">消息数</div>
                    </div>
                    <div className="text-center p-6 rounded-lg bg-primary/5 border border-primary/10">
                      <div className="text-3xl font-bold text-primary">{stats.activeDays}</div>
                      <div className="text-sm text-muted-foreground mt-2">使用天数</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'achievements' && (
            <div className="space-y-6">
              <div><h2 className="text-2xl font-bold mb-2">成就徽章</h2></div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Trophy className="h-5 w-5" />我的成就</CardTitle>
                  <CardDescription>已解锁 {achievements.length} 个成就</CardDescription>
                </CardHeader>
                <CardContent>
                  {achievements.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {achievements.map((a) => (
                        <div key={a.id} className="p-4 rounded-lg bg-muted/50 border flex items-center gap-3">
                          <div className="text-2xl">{a.icon}</div>
                          <div><p className="text-sm font-medium">{a.name}</p><p className="text-xs text-muted-foreground">{a.description}</p></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Trophy className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">暂无成就</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
