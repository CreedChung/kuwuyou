/**
 * 分析结果展示组件
 * 用于展示规范检查的分析结果
 */

import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, FileText, Lightbulb } from "lucide-react";
import { AnalysisItem } from "./types";

interface AnalysisResultProps {
  results: AnalysisItem[];
}

export function AnalysisResult({ results }: AnalysisResultProps) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <FileText className="h-4 w-4 text-primary" />
        <span>规范检查结果 ({results.length} 项)</span>
      </div>

      <div className="space-y-3">
        {results.map((item, index) => (
          <Card key={index} className="p-4 space-y-3 border-l-4 border-l-orange-500">
            {/* 原句 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                    原句
                  </span>
                </div>
                {item.location && (
                  <span className="text-xs font-mono font-bold bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded border border-orange-200 dark:border-orange-800">
                    位置: {item.location}
                  </span>
                )}
              </div>
              <p className="text-sm bg-orange-50 dark:bg-orange-950/30 p-2 rounded border border-orange-200 dark:border-orange-800">
                {item.origin}
              </p>
            </div>

            {/* 依据 */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  依据
                </span>
              </div>
              <p className="text-sm bg-blue-50 dark:bg-blue-950/30 p-2 rounded border border-blue-200 dark:border-blue-800">
                {item.reason}
              </p>
            </div>

            {/* 问题描述 */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                  问题描述
                </span>
              </div>
              <p className="text-sm bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200 dark:border-red-800">
                {item.issueDes}
              </p>
            </div>

            {/* 修改建议 */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                  修改建议
                </span>
              </div>
              <p className="text-sm bg-green-50 dark:bg-green-950/30 p-2 rounded border border-green-200 dark:border-green-800">
                {item.suggestion}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}