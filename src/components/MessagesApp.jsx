import { useEffect, useState } from 'react';
import { storyData } from '../storyData';

export default function MessagesApp({ initialChatId, onBack }) {
  const contacts = storyData.contacts;
  const chats = storyData.chats;

  const [activeChatId, setActiveChatId] = useState(initialChatId || 'suxi');

  useEffect(() => {
    if (initialChatId) {
      setActiveChatId(initialChatId);
    }
  }, [initialChatId]);

  const activeContact = contacts.find((item) => item.id === activeChatId) || contacts[0];
  const messages = chats[activeChatId] || [];

  return (
    <div className="messages-app">
      <header className="chat-header">
        <button className="back-button" onClick={onBack}>
          ←
        </button>
        <div className="contact-head">
          <div className="avatar small">{activeContact.avatar}</div>
          <div>
            <div className="name">{activeContact.name}</div>
            <small>{activeContact.online ? '在线' : '离线'}</small>
          </div>
        </div>
      </header>

      <div className="chat-list">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`bubble ${msg.sender === 'me' ? 'me' : 'them'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="quick-replies">
        <button>我已经拿到硬盘了</button>
        <button>实验室里还有别人吗</button>
        <button>告诉我下一步</button>
      </div>
    </div>
  );
}
