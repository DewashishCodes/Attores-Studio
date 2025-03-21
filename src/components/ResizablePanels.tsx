
import React, { ReactNode, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ResizablePanelProps {
  direction: 'horizontal' | 'vertical';
  children: ReactNode[];
  className?: string;
  initialSizes?: number[];
  minSizes?: number[];
  showHandles?: boolean;
}

const ResizablePanels: React.FC<ResizablePanelProps> = ({
  direction,
  children,
  className,
  initialSizes = [],
  minSizes = [],
  showHandles = true,
}) => {
  const isHorizontal = direction === 'horizontal';
  const containerRef = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState<number[]>(
    initialSizes.length === children.length
      ? initialSizes
      : Array(children.length).fill(100 / children.length)
  );
  const [resizing, setResizing] = useState<number | null>(null);

  // Default min sizes if not provided
  const effectiveMinSizes = minSizes.length === children.length
    ? minSizes
    : Array(children.length).fill(10);

  const startResize = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setResizing(index);

    const startPosition = isHorizontal ? e.clientX : e.clientY;
    const containerSize = isHorizontal
      ? containerRef.current?.offsetWidth || 0
      : containerRef.current?.offsetHeight || 0;
      
    const initialSizes = [...sizes];

    const handleMouseMove = (e: MouseEvent) => {
      if (resizing === null || !containerRef.current) return;

      const currentPosition = isHorizontal ? e.clientX : e.clientY;
      const deltaPosition = currentPosition - startPosition;
      const deltaPercentage = (deltaPosition / containerSize) * 100;

      const newSizes = [...initialSizes];
      newSizes[index] = Math.max(effectiveMinSizes[index], initialSizes[index] + deltaPercentage);
      newSizes[index + 1] = Math.max(
        effectiveMinSizes[index + 1],
        initialSizes[index + 1] - deltaPercentage
      );

      // Normalize sizes to ensure they sum to 100%
      const totalSize = newSizes.reduce((acc, size) => acc + size, 0);
      const normalizedSizes = newSizes.map(size => (size / totalSize) * 100);
      
      setSizes(normalizedSizes);
    };

    const handleMouseUp = () => {
      setResizing(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex',
        isHorizontal ? 'flex-row' : 'flex-col',
        'h-full w-full overflow-hidden',
        className
      )}
    >
      {children.map((child, index) => (
        <React.Fragment key={index}>
          <div
            className={cn(
              'overflow-auto',
              isHorizontal ? 'h-full' : 'w-full',
              resizing === index || resizing === index - 1 ? 'select-none' : ''
            )}
            style={{
              [isHorizontal ? 'width' : 'height']: `${sizes[index]}%`,
              [isHorizontal ? 'minWidth' : 'minHeight']: `${effectiveMinSizes[index]}%`,
              transition: resizing !== null ? 'none' : 'all 0.1s ease'
            }}
          >
            {child}
          </div>
          
          {index < children.length - 1 && showHandles && (
            <div
              className={cn(
                'resize-handle',
                isHorizontal ? 'resize-handle-horizontal' : 'resize-handle-vertical',
                resizing === index ? 'bg-primary/30' : ''
              )}
              onMouseDown={startResize(index)}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ResizablePanels;
