import type { SVGProps } from 'react';

export function VendorLinkLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.65 12.35a6.012 6.012 0 0 1-8.3 8.3" />
      <path d="M17.65 17.65l-2.1-2.1" />
      <path d="m22 2-4.5 4.5" />
      <path d="M13.35 13.35a6.012 6.012 0 0 1 8.3-8.3" />
      <path d="m2 22 4.5-4.5" />
      <path d="M6.35 6.35l2.1 2.1" />
    </svg>
  );
}
