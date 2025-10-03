export const currentUserId = 999;

export const conversations = [
  {
    id: 1,
    participant: {
      id: 2,
      name: "Ella Adu",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
      isOnline: true,
    },
    unreadCount: 4,
    messages: [
      { id: 101, senderId: 2, text: "Hi, thanks for reaching out. The mattress is still available.", timestamp: "12:15 PM", readStatus: "read" },
      { id: 102, senderId: currentUserId, text: "Great! Can I come see it this evening?", timestamp: "12:16 PM", readStatus: "read" },
    ],
    isVerified: true,
  },
  {
    id: 2,
    participant: {
      id: 3,
      name: "Fatima Yusuf",
      avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
      isOnline: true,
    },
    unreadCount: 0,
    messages: [
      { id: 201, senderId: currentUserId, type: 'image', imageUrl: 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=600', timestamp: "12:15 PM", readStatus: "read" },
      { id: 202, senderId: currentUserId, text: "Hi Fatima. Please I will like to inquire about the apartment.", timestamp: "12:15 PM", readStatus: "read" },
      { id: 203, senderId: 3, text: "Hello! Yes it's a great space. When would you like to see it?", timestamp: "12:20 PM", readStatus: "sent" },
      { id: 201, senderId: currentUserId, type: 'image', imageUrl: 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=600', timestamp: "12:15 PM", readStatus: "read" },
      { id: 202, senderId: currentUserId, text: "Hi Fatima. Please I will like to inquire about the apartment.", timestamp: "12:15 PM", readStatus: "read" },
      { id: 203, senderId: 3, text: "Hello! Yes it's a great space. When would you like to see it?", timestamp: "12:20 PM", readStatus: "sent" },
    ],
    isVerified: false,
  },
  {
    id: 3,
    participant: {
      id: 4,
      name: "Kunle Oladipo",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      isOnline: false,
    },
    unreadCount: 12,
    messages: [
      { id: 301, senderId: 4, text: "Is the rechargeable fan still for sale?", timestamp: "Aug 10", readStatus: "delivered" },
    ],
    isVerified: true,
  },
];