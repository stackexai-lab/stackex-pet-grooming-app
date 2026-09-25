import type { CSSProperties } from 'react';

const paths = {
  paw: 'M8 14c-2 2-4 5-1 6 2 1 3-1 5-1s3 2 5 1c3-1 1-4-1-6-2-3-6-3-8 0ZM5 7v2m5-6v3m5-3v3m4 1v2',
  plus: 'M12 5v14M5 12h14',
  close: 'm6 6 12 12M6 18 18 6',
  check: 'm5 12 4 4L19 6',
  chevron: 'm8 10 4 4 4-4',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  clock: 'M12 8v4l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-3a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v3Z',
  globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18',
  bag: 'M5 7h14l1 14H4ZM9 8V6a3 3 0 0 1 6 0v2',
  info: 'M12 11v6m0-10v.1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6ZM9 12l2 2 4-5',
  alert: 'm12 3 10 18H2ZM12 9v5m0 3v.1',
} as const;
export function Icon({ name, className = '', style }: { name: keyof typeof paths; className?: string; style?: CSSProperties }) {
  return <svg className={`icon ${className}`} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
