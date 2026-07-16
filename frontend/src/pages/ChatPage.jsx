import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ChatView from '../features/chat/ChatView';

export default function ChatPage() {
  const context = useOutletContext();
  
  return (
    <ChatView
      isActive={true}
      messages={context.messages}
      isTyping={context.isTyping}
      chatInput={context.chatInput}
      onChatInputChange={context.setChatInput}
      onSendMessage={context.handleSendMessage}
      onQuickChipClick={context.handleSendMessage}
      onBotClick={context.handleBotClick}
    />
  );
}
