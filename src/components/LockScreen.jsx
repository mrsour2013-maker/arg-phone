import { useEffect, useState } from 'react';

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['⌫', '0', '✓']
];

export default function LockScreen({
  passcode = '0714',
  time = '23:42',
  notification = '苏茜：你终于醒了。',
  onUnlock,
  backgroundImage
}) {
  const [input, setInput] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [flashError, setFlashError] = useState(false);

  useEffect(() => {
    if (input.length !== passcode.length) return;

    const correct = input === passcode;

    const timer = setTimeout(() => {
      if (correct) {
        onUnlock?.();
        return;
      }

      setFlashError(true);
      setIsShaking(true);
      setInput('');

      setTimeout(() => {
        setFlashError(false);
        setIsShaking(false);
      }, 400);
    }, 180);

    return () => clearTimeout(timer);
  }, [input, passcode, onUnlock]);

  const handleKey = (key) => {
    if (key === '⌫') {
      setInput((prev) => prev.slice(0, -1));
      return;
    }

    if (key === '✓') {
      if (input === passcode) {
        onUnlock?.();
      } else {
        setFlashError(true);
        setIsShaking(true);
        setInput('');
        setTimeout(() => {
          setFlashError(false);
          setIsShaking(false);
        }, 400);
      }
      return;
    }

    if (input.length >= passcode.length) return;
    setInput((prev) => prev + key);
  };

  return (
    <div
      className="lockscreen"
      style={{
        backgroundImage: backgroundImage
          ? `linear-gradient(rgba(2,6,23,0.7), rgba(2,6,23,0.78)), url(${backgroundImage})`
          : 'linear-gradient(180deg, #020617 0%, #111827 40%, #0f172a 100%)'
      }}
    >
      <div className={`lockscreen-panel ${isShaking ? 'shake' : ''}`}>
        <div className="time-label">{time}</div>

        <div className={`passcode-box ${flashError ? 'error' : ''}`}>
          <div className="label">LOCKED</div>

          <div className="dials">
            {Array.from({ length: passcode.length }).map((_, index) => (
              <span key={index} className={index < input.length ? 'filled' : ''}>
                {index < input.length ? '•' : ''}
              </span>
            ))}
          </div>

          <div className="note">{notification}</div>
        </div>

        <div className="keypad">
          {KEYS.flat().map((key) => (
            <button
              key={key}
              type="button"
              className={`key ${key === '✓' ? 'confirm' : ''} ${key === '⌫' ? 'backspace' : ''}`}
              onClick={() => handleKey(key)}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="hint">
          线索：服务器机柜标签上写着 <strong>0714</strong>
        </div>
      </div>
    </div>
  );
}
