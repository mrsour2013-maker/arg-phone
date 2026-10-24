import { storyData } from '../storyData';

export default function HomeScreen({ onOpenChatWithContact }) {
  const contacts = storyData.contacts;

  return (
    <div className="homescreen">
      <div className="statusbar">
        <span>9:41</span>
        <span>📶 5G</span>
      </div>

      <div className="app-grid">
        <button className="app-tile phone">
          <span className="icon">📞</span>
          <span>电话</span>
        </button>
        <button className="app-tile cam">
          <span className="icon">📷</span>
          <span>相机</span>
        </button>
        <button className="app-tile messages" onClick={() => onOpenChatWithContact('suxi')}>
          <span className="icon">💬</span>
          <span>信息</span>
        </button>
        <button className="app-tile notes">
          <span className="icon">📝</span>
          <span>备忘录</span>
        </button>
      </div>

      <div className="contact-panel">
        <div className="section-title">联系人</div>

        {contacts.map((person) => (
          <button
            key={person.id}
            className="contact-item"
            onClick={() => onOpenChatWithContact(person.id)}
          >
            <div className="avatar">{person.avatar}</div>
            <div className="contact-info">
              <div className="name-row">
                <span>{person.name}</span>
                {person.online && <span className="online-dot" />}
              </div>
              <small>{person.note}</small>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
