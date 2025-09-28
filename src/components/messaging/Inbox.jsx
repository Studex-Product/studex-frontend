import React from "react";

const Inbox = ({ conversation, isSelected, onClick }) => {
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-gray-200" : "hover:bg-gray-100"
      }`}
    >
      <div className="relative flex-shrink-0">
        <img
          src={conversation.participant.avatar}
          alt={conversation.participant.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {conversation.participant.isOnline ? (
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
        ) : (
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-gray-400 border-2 border-white" />
        )}
      </div>
      <div className="flex-1 min-w-0 ml-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-800 truncate">
            {conversation.participant.name}
          </p>
          <p className="text-xs text-gray-400">{lastMessage.timestamp}</p>
        </div>
        <div className="flex justify-between items-start">
          <p className="text-sm text-gray-500 truncate">
            {lastMessage.text || "Image"}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="bg-purple-600 text-white text-xs font-medium rounded-full px-1.5 py-0.5">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
