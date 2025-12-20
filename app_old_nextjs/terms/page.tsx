import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";

export default function TermsPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<div className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
				<h1 className="text-4xl font-bold mb-8">服务条款</h1>

				<div className="prose prose-slate dark:prose-invert max-w-none">
					<p className="text-muted-foreground mb-6">
						最后更新日期：2025年11月23日
					</p>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">1. 接受条款</h2>
						<p className="mb-4">
							欢迎使用库无忧助手。通过访问或使用我们的服务，您同意遵守本服务条款。如果您不同意这些条款，请不要使用我们的服务。
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">2. 服务描述</h2>
						<p className="mb-4">库无忧助手是一款AI助手服务，提供：</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>智能对话和问答功能</li>
							<li>知识库管理和检索</li>
							<li>个性化设置和偏好</li>
							<li>其他相关AI辅助功能</li>
						</ul>
						<p className="mb-4">
							我们保留随时修改、暂停或终止服务的权利，恕不另行通知。
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">3. 用户账户</h2>
						<p className="mb-4">使用某些功能需要注册账户。您需要：</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>提供真实、准确、完整的注册信息</li>
							<li>维护账户信息的准确性</li>
							<li>保护账户密码的安全性</li>
							<li>对账户下的所有活动负责</li>
							<li>发现未经授权使用时立即通知我们</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">4. 使用规则</h2>
						<p className="mb-4">在使用服务时，您同意不得：</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>违反任何适用的法律法规</li>
							<li>侵犯他人的知识产权或其他权利</li>
							<li>上传恶意软件、病毒或有害代码</li>
							<li>发送垃圾信息或进行未经授权的广告</li>
							<li>干扰或破坏服务的正常运行</li>
							<li>试图未经授权访问系统或数据</li>
							<li>收集其他用户的个人信息</li>
							<li>使用服务进行非法或欺诈活动</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">5. 内容所有权</h2>
						<p className="mb-4">
							您保留对您提交内容的所有权。通过使用服务，您授予我们非独占、全球范围、免版税的许可，以便我们：
						</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>存储、处理和显示您的内容</li>
							<li>提供和改进我们的服务</li>
							<li>进行必要的技术操作</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">6. 知识产权</h2>
						<p className="mb-4">
							服务及其原创内容、功能和特性归库无忧助手所有，受国际版权、商标和其他知识产权法律保护。未经明确授权，您不得复制、修改、分发或以其他方式使用我们的知识产权。
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">7. 免责声明</h2>
						<p className="mb-4">服务按"现状"和"可用"基础提供。我们不保证：</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>服务将不间断或无错误</li>
							<li>结果的准确性或可靠性</li>
							<li>满足您的特定需求</li>
							<li>缺陷将被纠正</li>
						</ul>
						<p className="mb-4">您使用服务的风险由您自行承担。</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">8. 责任限制</h2>
						<p className="mb-4">
							在法律允许的最大范围内，库无忧助手不对以下情况承担责任：
						</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>间接、偶然、特殊或后果性损害</li>
							<li>利润、数据或使用机会的损失</li>
							<li>业务中断</li>
							<li>第三方内容或行为</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">9. 赔偿</h2>
						<p className="mb-4">
							您同意赔偿并使库无忧助手免受因以下原因产生的任何索赔、损害、损失、责任和费用：
						</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>您违反本服务条款</li>
							<li>您侵犯第三方的权利</li>
							<li>您使用服务的方式</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">10. 终止</h2>
						<p className="mb-4">
							我们保留在以下情况下暂停或终止您的账户的权利：
						</p>
						<ul className="list-disc pl-6 space-y-2 mb-4">
							<li>违反本服务条款</li>
							<li>长期不活跃</li>
							<li>涉嫌欺诈或非法活动</li>
							<li>其他合理原因</li>
						</ul>
						<p className="mb-4">
							您也可以随时终止使用我们的服务并删除您的账户。
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">11. 争议解决</h2>
						<p className="mb-4">
							本服务条款受中华人民共和国法律管辖。因本条款引起的任何争议应首先通过友好协商解决。如协商不成，应提交至我们所在地有管辖权的人民法院解决。
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">12. 条款修改</h2>
						<p className="mb-4">
							我们保留随时修改本服务条款的权利。重大变更将通过邮件或网站公告通知您。修改后继续使用服务即表示您接受新的条款。
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">13. 可分割性</h2>
						<p className="mb-4">
							如果本条款的任何条款被认定为无效或不可执行，该条款应在必要的最小范围内修改，以使其有效，其余条款将继续完全有效。
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
	);
}
