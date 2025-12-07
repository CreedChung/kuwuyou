"use client";

import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step, TooltipRenderProps } from "react-joyride";
import { hasTutorialCompleted, markTutorialCompleted } from "@/utils/tutorialManager";

interface ChatTutorialProps {
  onComplete?: () => void;
}

// 自定义 Tooltip 组件，完全控制按钮文字
function CustomTooltip({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep,
}: TooltipRenderProps) {
  return (
    <div {...tooltipProps} style={{
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      padding: '1.25rem',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 0 2px hsl(var(--primary))',
      maxWidth: '400px',
    }}>
      {step.title && (
        <div style={{
          color: '#1a1a1a',
          fontSize: '1.125rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
        }}>
          {step.title}
        </div>
      )}
      <div style={{
        color: '#1a1a1a',
        fontSize: '0.9375rem',
        lineHeight: '1.6',
        padding: '0.5rem 0',
      }}>
        {step.content}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem',
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {index > 0 && (
            <button
              {...backProps}
              style={{
                color: '#666666',
                background: 'none',
                border: 'none',
                padding: '0.5rem 1rem',
                fontSize: '0.9375rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              上一步
            </button>
          )}
          {continuous && !isLastStep && (
            <button
              {...primaryProps}
              style={{
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.625rem 1.25rem',
                fontSize: '0.9375rem',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                cursor: 'pointer',
              }}
            >
              下一步
            </button>
          )}
          {isLastStep && (
            <button
              {...primaryProps}
              style={{
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.625rem 1.25rem',
                fontSize: '0.9375rem',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                cursor: 'pointer',
              }}
            >
              完成
            </button>
          )}
        </div>
        <button
          {...skipProps}
          style={{
            color: '#666666',
            background: 'none',
            border: 'none',
            padding: '0.5rem 1rem',
            fontSize: '0.9375rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          跳过
        </button>
      </div>
    </div>
  );
}

export function ChatTutorial({ onComplete }: ChatTutorialProps) {
  const [runTutorial, setRunTutorial] = useState(false);

  useEffect(() => {
    // 检查用户是否已经完成过新手教程
    if (!hasTutorialCompleted()) {
      // 延迟一点时间再显示教程，让页面先加载完成
      const timer = setTimeout(() => {
        setRunTutorial(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      // 标记教程已完成
      markTutorialCompleted();
      setRunTutorial(false);
      onComplete?.();
    }
  };

  const steps: Step[] = [
    {
      target: "body",
      content: (
        <div className="space-y-2">
          <h2 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>欢迎使用库无忧助手！</h2>
          <p className="text-sm" style={{ color: '#4a4a4a' }}>
            让我们快速了解一下如何使用这个智能助手。
          </p>
        </div>
      ),
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tutorial="sidebar"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold" style={{ color: '#1a1a1a' }}>对话历史</h3>
          <p className="text-sm" style={{ color: '#4a4a4a' }}>
            这里显示您的所有对话记录，点击可以切换到不同的对话。
          </p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tutorial="new-conversation"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold" style={{ color: '#1a1a1a' }}>新建对话</h3>
          <p className="text-sm" style={{ color: '#4a4a4a' }}>
            点击这里可以开始一个全新的对话。
          </p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tutorial="knowledge-base"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold" style={{ color: '#1a1a1a' }}>知识库管理</h3>
          <p className="text-sm" style={{ color: '#4a4a4a' }}>
            在这里可以管理您的知识库，上传文档让助手学习。
          </p>
        </div>
      ),
      placement: "right",
    },
    {
      target: '[data-tutorial="input-area"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold" style={{ color: '#1a1a1a' }}>输入区域</h3>
          <p className="text-sm" style={{ color: '#4a4a4a' }}>
            在这里输入您的问题，支持文本输入和语音输入。
          </p>
        </div>
      ),
      placement: "top",
    },
    {
      target: '[data-tutorial="file-upload"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold" style={{ color: '#1a1a1a' }}>文件上传</h3>
          <p className="text-sm" style={{ color: '#4a4a4a' }}>
            点击这里可以上传文件（支持 TXT、MD、DOC、DOCX、PDF 格式）。
          </p>
        </div>
      ),
      placement: "top",
    },
    {
      target: '[data-tutorial="voice-input"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold" style={{ color: '#1a1a1a' }}>语音输入</h3>
          <p className="text-sm" style={{ color: '#4a4a4a' }}>
            点击麦克风图标可以使用语音输入，再次点击停止录音。
          </p>
        </div>
      ),
      placement: "top",
    },
    {
      target: '[data-tutorial="web-search"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold" style={{ color: '#1a1a1a' }}>联网搜索</h3>
          <p className="text-sm" style={{ color: '#4a4a4a' }}>
            开启后，助手会从互联网搜索相关信息来回答您的问题。
          </p>
        </div>
      ),
      placement: "top",
    },
    {
      target: '[data-tutorial="knowledge-search"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold" style={{ color: '#1a1a1a' }}>知识库检索</h3>
          <p className="text-sm" style={{ color: '#4a4a4a' }}>
            开启后，助手会从您的知识库中检索相关内容。
          </p>
        </div>
      ),
      placement: "top",
    },
    {
      target: '[data-tutorial="deep-thinking"]',
      content: (
        <div className="space-y-2">
          <h3 className="font-semibold" style={{ color: '#1a1a1a' }}>深度思考</h3>
          <p className="text-sm" style={{ color: '#4a4a4a' }}>
            开启后，助手会展示详细的思考过程，帮助您理解答案的来源。
          </p>
        </div>
      ),
      placement: "top",
    },
    {
      target: "body",
      content: (
        <div className="space-y-2">
          <h2 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>准备就绪！</h2>
          <p className="text-sm" style={{ color: '#4a4a4a' }}>
            现在您可以开始使用库无忧助手了。祝您使用愉快！
          </p>
        </div>
      ),
      placement: "center",
    },
  ];

  return (
    <Joyride
      steps={steps}
      run={runTutorial}
      continuous
      showProgress={false}
      showSkipButton
      callback={handleJoyrideCallback}
      disableOverlayClose={false}
      disableCloseOnEsc={false}
      hideCloseButton
      spotlightClicks={false}
      tooltipComponent={CustomTooltip}
      styles={{
        options: {
          overlayColor: "rgba(0, 0, 0, 0.7)", // 更深的遮罩，突出提示框
          zIndex: 10000,
        },
      }}
      floaterProps={{
        disableAnimation: false,
        styles: {
          arrow: {
            length: 8,
            spread: 16,
          },
          floater: {
            filter: 'drop-shadow(0 10px 40px rgba(0, 0, 0, 0.3))',
          },
        },
      }}
    />
  );
}
