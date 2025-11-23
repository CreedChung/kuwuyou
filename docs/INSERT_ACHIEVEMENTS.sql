-- 插入默认成就数据
INSERT INTO achievements (code, name, description, icon) VALUES
  ('first_chat', '新手上路', '完成首次对话', '🎉'),
  ('message_100', '健谈者', '发送超过 100 条消息', '💬'),
  ('early_user', '早期用户', '加入早期体验计划', '⭐'),
  ('streak_7', '连续使用 7 天', '保持活跃使用', '🔥')
ON CONFLICT (code) DO NOTHING;