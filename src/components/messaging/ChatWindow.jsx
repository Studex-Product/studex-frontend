import React, { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import { Video, Phone, Send, Smile, Paperclip, ArrowLeft } from "lucide-react";
import Verified from "@/assets/icons/check-verified.svg";

const ChatWindow = ({ conversation, onBack, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    // Call the function passed from the parent to update the state
    onSendMessage(newMessage);

    setNewMessage("");
  };

  if (!conversation) return null;

  return (
    <div className="flex flex-col h-full w-full bg-gray-50/50">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 md:hidden cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="relative">
            <img
              src={conversation.participant.avatar}
              alt={conversation.participant.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">
                {conversation.participant.name}
              </p>
              {conversation.isVerified && (
                <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                  <img src={Verified} alt="Verified" className="w-3 h-3" />
                </span>
              )}
            </div>
            {conversation.participant.isOnline ? (
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                <p className="text-sm text-gray-500">Online</p>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-gray-500 border-2 border-white" />
                <p className="text-sm text-gray-500">Offline</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer">
            <Video size={20} />
          </button>
          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 cursor-pointer">
            <Phone size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="text-center text-sm text-gray-400">Mon, 08 Sept</div>
        {conversation.messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="button"
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <Smile size={20} />
          </button>
          <button
            type="button"
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <Paperclip size={20} />
          </button>
          <button
            type="submit"
            disabled={newMessage.trim() === ""}
            className={`p-3 rounded-lg transition-colors ${
              newMessage.trim() === ""
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
            }`}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;