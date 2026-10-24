import { useMemo, useState } from 'react';
import LockScreen from './components/LockScreen';
import HomeScreen from './components/HomeScreen';
import MessagesApp from './components/MessagesApp';
import { storyData } from './storyData';

function App() {
  const [currentApp, setCurrentApp] = useState('lockscreen');
  const [targetChatId, setTargetChatId] = useState(null);

  const lockData = useMemo(() => storyData.lockScreen, []);

  const handleUnlock = () => {
    setCurrentApp('home');
  };

  const handleOpenChatWithContact = (contactId) => {
    setTargetChatId(contactId);
    setCurrentApp('messages');
  };

  if (currentApp === 'lockscreen') {
    return (
      <LockScreen
        time={lockData.time}
        passcode={lockData.passcode}
        notification={lockData.notification}
        backgroundImage={lockData.backgroundImage}
        onUnlock={handleUnlock}
      />
    );
  }

  if (currentApp === 'home') {
    return <HomeScreen onOpenChatWithContact={handleOpenChatWithContact} />;
  }

  if (currentApp === 'messages') {
    return (
      <MessagesApp
        initialChatId={targetChatId}
        onBack={() => setCurrentApp('home')}
      />
    );
  }

  return null;
}

export default App;
