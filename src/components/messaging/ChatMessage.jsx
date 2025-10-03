import React from "react";
import { currentUserId } from "@/sample-data/messages";
import { Check, CheckCheck } from "lucide-react";

const ChatMessage = ({ message }) => {
  const isOutgoing = message.senderId === currentUserId;

  const getReadStatusIcon = () => {
    if (!isOutgoing) return null;
    if (message.readStatus === "read") {
      return <CheckCheck size={16} className="text-blue-500" />;
    }
    if (message.readStatus === "delivered") {
      return <CheckCheck size={16} className="text-gray-400" />;
    }
    return <Check size={16} className="text-gray-400" />;
  };

  return (
    <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md rounded-2xl p-3 ${
          isOutgoing
            ? "bg-[#ECDAFB] text-gray-900 rounded-br-none"
            : "bg-gray-100 border border-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        {message.type === "image" && (
          <img
            src={message.imageUrl}
            alt="attachment"
            className="rounded-lg mb-2 max-w-xs"
          />
        )}
        <p className="text-sm">{message.text}</p>
        <div className="flex items-center justify-end gap-1.5 mt-1">
          <p
            className={`text-xs ${
              isOutgoing ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {message.timestamp}
          </p>
          {getReadStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
