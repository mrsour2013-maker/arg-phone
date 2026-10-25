import { useEffect, useRef, useState } from 'react';

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['⌫', '0', '✓']
];

const UNLOCK_THRESHOLD = 180;

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
  const [showHint, setShowHint] = useState(false);
  const [isPasscodeVisible, setIsPasscodeVisible] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const pointerIdRef = useRef(null);
  const unlockTriggeredRef = useRef(false);

  useEffect(() => {
    if (!isPasscodeVisible || input.length !== passcode.length) return;

    const correct = input === passcode;
    const timer = setTimeout(() => {
      if (correct) {
        setFlashError(false);
        setShowHint(false);
        setInput('');
        unlockTriggeredRef.current = false;
        onUnlock?.();
        return;
      }

      setFlashError(true);
      setShowHint(true);
      setIsShaking(true);
      setInput('');

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(120);
      }

      setTimeout(() => {
        setFlashError(false);
        setShowHint(false);
        setIsShaking(false);
      }, 900);
    }, 180);

    return () => clearTimeout(timer);
  }, [input, passcode, isPasscodeVisible, onUnlock]);

  const triggerVibrate = (duration = 18) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  };

  const resetUnlockState = () => {
    setIsDragging(false);
    setDragDistance(0);
    pointerIdRef.current = null;
    unlockTriggeredRef.current = false;
  };

  const handleKey = (key) => {
    triggerVibrate(18);

    if (key === '⌫') {
      setInput((prev) => prev.slice(0, -1));
      return;
    }

    if (key === '✓') {
      if (input === passcode) {
        setFlashError(false);
        setShowHint(false);
        setInput('');
        unlockTriggeredRef.current = false;
        onUnlock?.();
      } else {
        setFlashError(true);
        setShowHint(true);
        setIsShaking(true);
        setInput('');
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate(160);
        }
        setTimeout(() => {
          setFlashError(false);
          setShowHint(false);
          setIsShaking(false);
        }, 900);
      }
      return;
    }

    if (input.length >= passcode.length) return;
    setInput((prev) => prev + key);
  };

  const handleUnlockStart = (event) => {
    if (isPasscodeVisible || unlockTriggeredRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerIdRef.current = event.pointerId;
    dragStartX.current = event.clientX;
    setIsDragging(true);
  };

  const handleUnlockMove = (event) => {
    if (!isDragging || isPasscodeVisible || event.pointerId !== pointerIdRef.current) return;

    const deltaX = event.clientX - dragStartX.current;
    if (deltaX <= 0) {
      setDragDistance(0);
      return;
    }

    const maxDrag = event.currentTarget.clientWidth - 56;
    const nextDistance = Math.min(deltaX, maxDrag);
    setDragDistance(nextDistance);
  };

  const handleUnlockEnd = (event) => {
    if (!isDragging || event.pointerId !== pointerIdRef.current) return;

    const sliderWidth = event.currentTarget.clientWidth - 56;
    if (dragDistance >= sliderWidth * 0.92 || dragDistance >= UNLOCK_THRESHOLD) {
      unlockTriggeredRef.current = true;
      setDragDistance(sliderWidth);
      setIsPasscodeVisible(true);
      setIsDragging(false);
      triggerVibrate(20);
      pointerIdRef.current = null;
    } else {
      resetUnlockState();
      setDragDistance(0);
    }
  };

  const handleUnlockCancel = () => {
    if (isDragging) {
      resetUnlockState();
      setDragDistance(0);
    }
  };

  return (
    <div
      className="lockscreen"
      style={{
        backgroundImage: backgroundImage
          ? `linear-gradient(rgba(2,6,23,0.72), rgba(2,6,23,0.78)), url(${backgroundImage})`
          : 'linear-gradient(180deg, #020617 0%, #111827 42%, #0f172a 100%)'
      }}
    >
      <div className="ios-status">
        <span>9:41</span>
        <span>· · ·</span>
      </div>

      <div className={`lockscreen-panel ${isShaking ? 'shake' : ''}`}>
        <div className="date-label">Monday, October 25</div>
        <div className="time-label">{time}</div>

        {!isPasscodeVisible && (
          <div className="unlock-slider-wrap">
            <div
              className="unlock-slider"
              onPointerDown={handleUnlockStart}
              onPointerMove={handleUnlockMove}
              onPointerUp={handleUnlockEnd}
              onPointerLeave={handleUnlockCancel}
              onPointerCancel={handleUnlockCancel}
            >
              <div
                className="unlock-thumb"
                style={{ transform: `translateX(${dragDistance}px)` }}
              >
                <span>›</span>
              </div>
              <span className="unlock-text">slide to unlock</span>
            </div>
          </div>
        )}

        {isPasscodeVisible && (
          <>
            <div className={`passcode-box ${flashError ? 'error' : ''}`}>
              <div className="label">LOCKED</div>

              <div className="dials" aria-live="polite">
                {Array.from({ length: passcode.length }).map((_, index) => (
                  <span key={index} className={index < input.length ? 'filled' : ''}>
                    {index < input.length ? '•' : ''}
                  </span>
                ))}
              </div>

              <div className={`note ${showHint ? 'show-hint' : ''}`}>
                {showHint ? '🎂' : ''}
              </div>
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
              线索：服务器机柜标签上写着 <strong>0705</strong>
            </div>
          </>
        )}
      </div>

      <div className="home-indicator" aria-label="Home Indicator" />
    </div>
  );
}
