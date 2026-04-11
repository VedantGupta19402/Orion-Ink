import { useRef, useEffect, useState, useMemo, useId } from 'react';

const CurvedLoop = ({
  marqueeText = 'ORION INK • ',
  speed = 2,
  className = '',
  direction = 'left',
  interactive = true
}) => {
  const text = useMemo(() => marqueeText + '\u00A0', [marqueeText]);

  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const uid = useId();
  const pathId = `line-${uid}`;
  
  const pathD = `M-5000,120 L5000,120`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);

  const totalText = useMemo(() => {
    return spacing ? Array(10).fill(text).join('') : text;
  }, [text, spacing]);

  const ready = spacing > 0;

  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className]);

  useEffect(() => {
    if (!spacing) return;
    const initial = -spacing;
    if (textPathRef.current) {
      textPathRef.current.setAttribute('startOffset', initial + 'px');
      setOffset(initial);
    }
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready) return;
    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed;
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
        
        let newOffset = currentOffset + delta;

        if (newOffset <= -(spacing * 2)) newOffset += spacing;
        if (newOffset >= 0) newOffset -= spacing;

        textPathRef.current.setAttribute('startOffset', newOffset + 'px');
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  const onPointerDown = e => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    e.target.setPointerCapture(e.pointerId);
  };

  const onPointerMove = e => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0');
    let newOffset = currentOffset + dx;
    
    if (newOffset <= -(spacing * 2)) newOffset += spacing;
    if (newOffset >= 0) newOffset -= spacing;

    textPathRef.current.setAttribute('startOffset', newOffset + 'px');
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? 'right' : 'left';
  };

  return (
    <div
      className={`w-full overflow-hidden select-none touch-none flex items-center ${ready ? 'visible' : 'invisible'}`}
      style={{ cursor: interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      {/* ✅ Responsive + visible height */}
      <svg className="w-full h-[80px] sm:h-[100px] md:h-[8vw] lg:h-[6vw] block" viewBox="0 0 1440 240">
        
        <text ref={measureRef} xmlSpace="preserve" className="invisible opacity-0 pointer-events-none">
          {text}
        </text>

        <defs>
          <path id={pathId} d={pathD} />
        </defs>

        {ready && (
          <text 
            fontWeight="bold"
            fontSize="40"  // 🔥 ensures minimum readable size
            xmlSpace="preserve" 
            className={`${className} sm:text-[32px] md:text-[40px] lg:text-[56px]`}
          >
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset={offset + 'px'}>
              {totalText}
            </textPath>
          </text>
        )}

      </svg>
    </div>
  );
};

export default CurvedLoop;