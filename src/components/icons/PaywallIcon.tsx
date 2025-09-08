import type { SVGProps } from 'react';

export function PaywallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth={3}
      stroke="currentColor"
      fill="none"
      {...props}
    >
      <circle cx={32} cy="31.48" r="25.29" />
      <path d="M40.12,24.41a8.36,8.36,0,0,0-7.84-5.06c-7.07,0-7.33,5.06-7.33,5.06s-1.06,6.24,7.58,6.9c9,.69,7.59,6.9,7.59,6.9s-.92,5.4-7.59,5.75-8.73-6.67-8.73-6.67" />
      <line x1="32.28" y1="14.87" x2="32.28" y2="49.13" />
    </svg>
  );
}
