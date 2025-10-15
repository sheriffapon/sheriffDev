import { cn } from '@/lib/utils';

export const AnimatedLogo = ({ className, ...props }: React.ComponentProps<'svg'>) => {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      {...props}
    >
      <rect
        width="28"
        height="28"
        rx="8"
        className="fill-primary group-hover:fill-primary/90 transition-colors"
      />
      <path
        d="M8 12L12 16L8 20"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform group-hover:translate-x-0.5"
      />
      <path
        d="M16 20H20"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2"
        strokeLinecap="round"
        className="logo-cursor"
      />
    </svg>
  );
};
