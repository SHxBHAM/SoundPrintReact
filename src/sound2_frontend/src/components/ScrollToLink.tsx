import { useLocomotiveScroll } from '@studio-freight/react-locomotive-scroll';

interface ScrollToLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

export default function ScrollToLink({ to, className, children }: ScrollToLinkProps) {
  const { scroll } = useLocomotiveScroll();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Remove # from the target
    const target = to.replace('#', '');
    
    // Scroll to the target element
    scroll?.scrollTo(`#${target}`, {
      offset: 0,
      duration: 1000,
      easing: [0.25, 0.0, 0.35, 1.0],
    });
  };

  return (
    <a href={to} className={className} onClick={handleClick}>
      {children}
    </a>
  );
} 