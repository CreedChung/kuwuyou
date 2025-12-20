import { createFileRoute } from '@tanstack/react-router'
import { Footer } from "@/components/ui/footer"
import { Header } from "@/components/ui/header"

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">隐私政策</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            最后更新日期：2025年11月23日
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. 信息收集</h2>
            <p className="mb-4">
              我们致力于保护您的隐私。当您使用库无忧助手时，我们可能会收集以下信息：
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>账户信息：包括用户名、邮箱地址等注册信息</li>
              <li>使用数据：您与服务的交互记录、对话历史等</li>
              <li>设备信息：设备类型、操作系统、浏览器信息等</li>
              <li>日志信息：访问时间、IP地址等技术日志</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. 信息使用</h2>
            <p className="mb-4">我们收集的信息将用于：</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>提供、维护和改进我们的服务</li>
              <li>个性化您的用户体验</li>
              <li>与您沟通服务更新和重要通知</li>
              <li>确保服务安全和防止欺诈行为</li>
              <li>进行数据分析以优化产品功能</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. 信息共享</h2>
            <p className="mb-4">
              我们不会出售、出租或交易您的个人信息。我们仅在以下情况下共享信息：
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>获得您的明确同意</li>
              <li>为提供服务所必需的第三方服务提供商</li>
              <li>遵守法律法规或响应合法的政府要求</li>
              <li>保护我们的权利、财产或安全</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. 数据安全</h2>
            <p className="mb-4">
              我们采取合理的技术和组织措施来保护您的个人信息安全，包括：
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>使用加密技术保护数据传输</li>
              <li>实施访问控制和权限管理</li>
              <li>定期进行安全审计和漏洞扫描</li>
              <li>建立数据备份和灾难恢复机制</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Cookie 使用</h2>
            <p className="mb-4">
              我们使用Cookie和类似技术来改善用户体验。您可以通过浏览器设置管理Cookie偏好，但这可能影响某些功能的使用。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. 您的权利</h2>
            <p className="mb-4">您对个人信息享有以下权利：</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>访问和查看您的个人信息</li>
              <li>更正不准确的个人信息</li>
              <li>删除您的个人信息</li>
              <li>导出您的数据</li>
              <li>撤回同意或反对处理</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. 儿童隐私</h2>
            <p className="mb-4">
              我们的服务不面向13岁以下儿童。如果我们发现收集了儿童的个人信息，将立即删除。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. 政策更新</h2>
            <p className="mb-4">
              我们可能会不时更新本隐私政策。重大变更将通过邮件或网站通知的方式告知您。继续使用服务即表示您接受更新后的政策。
            </p>
          </section>
        </div>
      </div>
      <Footer
        logo={
          <img
            src="/logo.jpg"
            alt="库无忧助手"
            className="h-10 w-10 object-contain"
          />
        }
        brandName="库无忧助手"
        socialLinks={[]}
        mainLinks={[]}
        legalLinks={[]}
        copyright={{
          text: "© 2025 库无忧助手",
          license: "保留所有权利",
        }}
      />
    </div>
  )
}
