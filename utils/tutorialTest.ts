/**
 * 新手教程功能测试脚本
 * 
 * 在浏览器控制台运行此脚本来测试教程功能
 */

// 测试工具函数
const TutorialTest = {
    // 检查教程是否完成
    checkStatus() {
        const completed = localStorage.getItem('chat-tutorial-completed');
        console.log('📊 教程状态:', completed === 'true' ? '已完成 ✅' : '未完成 ❌');
        return completed === 'true';
    },

    // 重置教程
    reset() {
        localStorage.removeItem('chat-tutorial-completed');
        console.log('🔄 教程已重置，刷新页面后将重新显示');
    },

    // 标记为已完成
    markCompleted() {
        localStorage.setItem('chat-tutorial-completed', 'true');
        console.log('✅ 教程已标记为完成');
    },

    // 检查所有教程元素是否存在
    checkElements() {
        const elements = [
            'sidebar',
            'new-conversation',
            'knowledge-base',
            'input-area',
            'file-upload',
            'voice-input',
            'web-search',
            'knowledge-search',
            'deep-thinking'
        ];

        console.log('🔍 检查教程元素...\n');

        elements.forEach(id => {
            const element = document.querySelector(`[data-tutorial="${id}"]`);
            if (element) {
                console.log(`✅ ${id}: 找到`);
            } else {
                console.log(`❌ ${id}: 未找到`);
            }
        });
    },

    // 显示帮助信息
    help() {
        console.log(`
📚 新手教程测试工具

可用命令:
  TutorialTest.checkStatus()    - 检查教程完成状态
  TutorialTest.reset()          - 重置教程
  TutorialTest.markCompleted()  - 标记教程为已完成
  TutorialTest.checkElements()  - 检查所有教程元素
  TutorialTest.help()           - 显示此帮助信息

使用示例:
  1. 检查状态: TutorialTest.checkStatus()
  2. 重置教程: TutorialTest.reset()
  3. 刷新页面查看教程
    `);
    }
};

// 自动显示帮助
TutorialTest.help();

// 导出到全局
if (typeof window !== 'undefined') {
    (window as any).TutorialTest = TutorialTest;
}

export default TutorialTest;
