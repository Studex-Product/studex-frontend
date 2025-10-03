import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ChatWindow from "@/components/messaging/ChatWindow";
import Inbox from "@/components/messaging/Inbox";
import {
  conversations as mockConversations,
  currentUserId,
} from "@/sample-data/messages";
import { Search, MoreVertical } from "lucide-react";
import DoubleChatBubble from "@/assets/icons/double-chat-bubble.svg";

const MessagesPage = () => {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  // This function handles the logic of adding a new message to our state
  const handleSendMessage = (text) => {
    if (!selectedConversationId) return;

    const newMessage = {
      id: Date.now(), // Use a timestamp for a unique ID for demo
      senderId: currentUserId,
      text,
      timestamp: new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(new Date()),
      readStatus: "sent",
    };

    // Find the conversation and add the new message to it
    const updatedConversations = conversations.map((convo) => {
      if (convo.id === selectedConversationId) {
        return { ...convo, messages: [...convo.messages, newMessage] };
      }
      return convo;
    });

    setConversations(updatedConversations);
  };

  return (
    <DashboardLayout>
      <div className="h-screen md:p-6 md:bg-purple-50">
        <div className="h-full bg-white md:rounded-lg flex overflow-hidden">
          {/* Left Panel: Inbox List */}
          <div
            className={`w-full md:max-w-sm border-r border-gray-200 flex-col ${
              selectedConversationId ? "hidden md:flex" : "flex"
            }`}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Messages</h1>
                <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                  <MoreVertical size={20} />
                </button>
              </div>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex-1 p-2 overflow-y-auto space-y-1">
              {conversations.map((convo) => (
                <Inbox
                  key={convo.id}
                  conversation={convo}
                  isSelected={selectedConversationId === convo.id}
                  onClick={() => setSelectedConversationId(convo.id)}
                />
              ))}
            </div>
          </div>

          {/* Right Panel: Chat Window or Empty State */}
          <div
            className={`w-full flex-col ${
              selectedConversationId ? "flex" : "hidden md:flex"
            }`}
          >
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-center p-4">
                <div>
                  <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <img
                      src={DoubleChatBubble}
                      alt="No Messages"
                      className="w-10 h-10"
                    />
                  </div>
                  <h2 className="text-xl font-semibold">No Message yet</h2>
                  <p className="text-gray-500 mt-1 max-w-xs mx-auto">
                    Check your inbox or start by exploring items in the
                    marketplace or finding a roommate.
                  </p>
                </div>
              </div>
            ) : (
              <ChatWindow
                key={selectedConversationId}
                conversation={selectedConversation}
                onBack={() => setSelectedConversationId(null)}
                onSendMessage={handleSendMessage}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
