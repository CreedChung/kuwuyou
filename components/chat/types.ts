// 智谱API相关类型定义

// 消息内容类型
export type MessageContentType = 
  | "text" 
  | "image" 
  | "video" 
  | "qa" 
  | "computer_call" 
  | "all_tools"
  | "process_thinking"
  | "process_text";

// 节点事件类型
export type NodeEventType = 
  | "node_processing" 
  | "node_finish" 
  | "tool_processing" 
  | "tool_finish"
  | "loop_processing";

// 工具类型
export type ToolType = "function" | "retrieval" | "web_search";

// 知识库检索工具数据
export interface RetrievalToolData {
  input?: string; // 搜索关键字
  slice_info?: string; // 切片内容(JSON字符串数组)
}

// 联网搜索工具数据
export interface WebSearchData {
  input?: string;
  refer?: string;
  title?: string;
  link?: string;
  content?: string;
  media?: string;
  icon?: string;
}

// 函数调用工具数据
export interface FunctionToolData {
  action_key?: string;
  params?: string;
  output?: string;
}

// 工具调用数据
export interface ToolCallsData {
  type: ToolType;
  tool_calls_data?: RetrievalToolData | FunctionToolData | WebSearchData[];
}

// 思考/推理过程消息
export interface ProcessMessage {
  text: string;
  event: "add" | "finish";
  type: "think" | "text";
}

// QA问答消息
export interface QaMessage {
  call_id: string;
  question: string;
  answer_type: "option" | "input";
  options?: string[];
}

// 图片/视频消息
export interface MediaMessage {
  url: string;
  cover_url?: string;
}

// AllTools消息
export interface AllToolsMessage {
  code?: string;
  files?: string[];
  text?: string;
}

// 消息内容数据
export interface MessageContentData {
  type: MessageContentType;
  msg: string | QaMessage | MediaMessage | AllToolsMessage | ProcessMessage;
  node_id?: string;
  node_name?: string;
}

// 节点事件
export interface NodeEvent {
  node_id: string;
  node_name: string;
  type: NodeEventType;
  content?: string;
  time?: number;
  tool_calls?: ToolCallsData;
}

// Token使用统计
export interface TokenUsage {
  model: string;
  nodeName: string;
  inputTokenCount: number;
  outputTokenCount: number;
  totalTokenCount: number;
}

// 消息类型
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
  error?: string;
  isStreaming?: boolean;
  
  // 智谱API扩展字段
  contentData?: MessageContentData; // 结构化内容
  events?: NodeEvent[]; // 节点执行事件
  thinking?: string; // 思考过程
  references?: KnowledgeReference[]; // 知识库引用
  usage?: TokenUsage[]; // Token使用统计
  analysisResults?: AnalysisItem[]; // 分析结果
  uploadedFileName?: string; // 上传的文件名
}

// 知识库引用
export interface KnowledgeReference {
  content: string; // 引用的文本内容
  source?: string; // 来源（文档名等）
  score?: number; // 相关度分数（0-1之间）
}

// 分析结果项
export interface AnalysisItem {
  origin: string; // 待检测内容中的原句
  reason: string; // 知识库/搜索工具返回的具体依据内容，注明来源
  issueDes: string; // 指出问题的性质、标准缺失或不一致点
  suggestion: string; // 提供修改建议，引用标准条文或行业做法
}

// 会话类型
export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: number;
  messages: Message[];
}

// 智谱API请求消息
export interface ZhipuRequestMessage {
  role: "user" | "assistant";
  content: Array<{
    type: "input" | "upload_file" | "upload_audio" | "upload_image" | "upload_video" | "selection_list";
    value: string;
    key?: string;
  }>;
  call_id?: string;
  type?: "text" | "computer_call" | "qa";
}

// 智谱API流式响应
export interface ZhipuStreamResponse {
  request_id: string;
  conversation_id: string;
  app_id?: string;
  choices: Array<{
    index: number;
    finish_reason?: "stop" | "error";
    delta?: {
      content?: MessageContentData;
      event?: NodeEvent;
    };
    messages?: {
      content?: MessageContentData;
      event?: NodeEvent[];
    };
    usage?: TokenUsage[];
  }>;
  error_msg?: {
    code: string;
    message: string;
  };
}