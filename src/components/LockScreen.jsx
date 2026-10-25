import { useEffect, useRef, useState } from 'react';

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['⌫', '0', '✓']
];

const SWIPE_THRESHOLD = 90;

export default function LockScreen({
  passcode = '0705',
  time = '23:42',
  notification = '苏茜：你终于醒了。',
  onUnlock,
  backgroundImage
}) {
  const [input, setInput] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [flashError, setFlashError] = useState(false);
  const [isPasscodeVisible, setIsPasscodeVisible] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);

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
      }, 420);
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
        }, 420);
      }
      return;
    }

    if (input.length >= passcode.length) return;
    setInput((prev) => prev + key);
  };

  const activatePasscode = () => {
    setIsPasscodeVisible(true);
    setDragDistance(0);
    setIsDragging(false);
  };

  const handleSwipeStart = (event) => {
    if (isPasscodeVisible) return;
    dragStartY.current = event.clientY;
    setIsDragging(true);
  };

  const handleSwipeMove = (event) => {
    if (!isDragging || isPasscodeVisible) return;
    const delta = dragStartY.current - event.clientY;
    if (delta <= 0) {
      setDragDistance(0);
      return;
    }

    const nextDistance = Math.min(delta, SWIPE_THRESHOLD + 40);
    setDragDistance(nextDistance);

    if (delta >= SWIPE_THRESHOLD) {
      activatePasscode();
    }
  };

  const handleSwipeEnd = () => {
    if (!isPasscodeVisible) {
      setIsDragging(false);
      setDragDistance(0);
    }
  };

  return (
    <div
      className="lockscreen"
      style={{
        backgroundImage: backgroundImage
          ? `linear-gradient(rgba(2,6,23,0.72), rgba(2,6,23,0.78)), url(${backgroundImage})`
          : 'linear-gradient(180deg, #020617 0%, #121827 42%, #0f172a 100%)'
      }}
    >
      <div className="ios-status">
        <span>9:41</span>
        <span>· · ·</span>
      </div>

      <div className={`lockscreen-panel ${isShaking ? 'shake' : ''}`}>
        <div className="date-label">Monday, October 25</div>
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

        {!isPasscodeVisible && (
          <div className="unlock-slider-wrap">
            <div
              className="unlock-slider"
              onPointerDown={handleSwipeStart}
              onPointerMove={handleSwipeMove}
              onPointerUp={handleSwipeEnd}
              onPointerLeave={handleSwipeEnd}
              onPointerCancel={handleSwipeEnd}
            >
              <div
                className="unlock-thumb"
                style={{ transform: `translateY(-${dragDistance}px)` }}
              >
                <span>›</span>
              </div>
              <span className="unlock-text">slide to unlock</span>
            </div>
          </div>
        )}

        {isPasscodeVisible && (
          <>
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
              线索：服务器机柜标签上写着 <strong>0705</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
