import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Database, Search, Sparkles } from "lucide-react";

interface TutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TutorialModal({ open, onOpenChange }: TutorialModalProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "欢迎使用库无忧助手",
      description: "您的智能知识管理与问答助手，助您高效处理工作。",
      icon: <Sparkles className="w-16 h-16 text-primary mb-2" />,
    },
    {
      title: "智能对话",
      description: "支持多轮对话，上下文理解，以及智能联网搜索，为您提供准确的答案。",
      icon: <MessageSquare className="w-16 h-16 text-primary mb-2" />,
    },
    {
      title: "知识库管理",
      description: "您可以上传文档构建专属知识库，助手将基于知识库内容进行精准回答。",
      icon: <Database className="w-16 h-16 text-primary mb-2" />,
    },
    {
      title: "深度检索",
      description: "结合联网搜索与本地知识库，全方位分析问题，提供有理有据的回答。",
      icon: <Search className="w-16 h-16 text-primary mb-2" />,
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onOpenChange(false);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-6">
        <DialogHeader className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full">
            {steps[step].icon}
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            {steps[step].title}
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2 max-w-[350px]">
            {steps[step].description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center py-8">
          <div className="flex gap-3">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  index === step ? "bg-primary w-8" : "bg-muted hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between items-center gap-4 w-full">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={step === 0}
              className={`w-[100px] ${step === 0 ? "invisible" : ""}`}
            >
              上一步
            </Button>
            <Button onClick={handleNext} className="w-[100px]">
              {step === steps.length - 1 ? "开始使用" : "下一步"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
