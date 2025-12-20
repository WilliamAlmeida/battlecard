import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  width?: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, width = 'w-64', children }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; placeBelow?: boolean } | null>(null);
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);

  const show = () => {
    const el = wrapperRef.current;
    if (!el) return setVisible(true);
    const rect = el.getBoundingClientRect();
    setVisible(true);
    // initial estimate (centered above)
    setPos({ left: rect.left + rect.width / 2, top: rect.top - 8, placeBelow: false });
  };

  const hide = () => {
    setVisible(false);
    setPos(null);
  };

  useEffect(() => {
    if (!visible || !tipRef.current || !wrapperRef.current) return;
    const tip = tipRef.current;
    const wrap = wrapperRef.current.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();

    let left = wrap.left + wrap.width / 2 - tipRect.width / 2;
    let top = wrap.top - tipRect.height - 8;
    let placeBelow = false;
    // if it would go off top, place below
    if (top < 8) {
      top = wrap.bottom + 8;
      placeBelow = true;
    }
    // keep inside viewport horizontally
    const margin = 8;
    if (left < margin) left = margin;
    if (left + tipRect.width + margin > window.innerWidth) left = window.innerWidth - tipRect.width - margin;

    setPos({ left: Math.round(left), top: Math.round(top), placeBelow });
  }, [visible]);

  const tooltipNode = (
    <div
      ref={tipRef}
      style={pos ? { position: 'fixed', left: pos.left + 'px', top: pos.top + 'px' } : { position: 'fixed', left: '-9999px', top: '-9999px' }}
      className={`z-50 ${width}`}
    >
      <div className="pointer-events-auto bg-black/90 text-white text-2xl p-3 rounded-lg shadow-lg border border-white/10">
        {content}
      </div>
    </div>
  );

  return (
    <>
      <span
        ref={wrapperRef}
        className="inline-block"
        onMouseEnter={show}
        onFocus={show}
        onMouseLeave={hide}
        onBlur={hide}
      >
        {children}
      </span>
      {visible && ReactDOM.createPortal(tooltipNode, document.body)}
    </>
  );
};

export default Tooltip;
