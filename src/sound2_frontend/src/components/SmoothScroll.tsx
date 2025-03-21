import { ReactNode, useRef } from 'react';
import { LocomotiveScrollProvider } from '@studio-freight/react-locomotive-scroll';

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const containerRef = useRef(null);

  return (
    <LocomotiveScrollProvider
      options={{
        smooth: true,
        lerp: 0.075, // Linear interpolation, adjust for smoothness (0.075 is quite smooth)
        multiplier: 1.0, // Scroll speed multiplier
        class: 'is-revealed',
        smartphone: {
          smooth: true,
          multiplier: 1,
        },
        tablet: {
          smooth: true,
          multiplier: 1,
        },
      }}
      containerRef={containerRef}
      watch={[]}
    >
      <main data-scroll-container ref={containerRef}>
        {children}
      </main>
    </LocomotiveScrollProvider>
  );
} 