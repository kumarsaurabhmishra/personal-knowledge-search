import type { ReactNode } from 'react';

type IconName = 'add' | 'arrow-left' | 'check' | 'edit' | 'tag' | 'trash' | 'x';

interface IconProps {
  name: IconName;
}

const paths: Record<IconName, ReactNode> = {
  add: <path d="M12 5v14M5 12h14" />,
  'arrow-left': <path d="m15 18-6-6 6-6" />,
  check: <path d="m5 12 4 4L19 6" />,
  edit: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />,
  tag: <path d="M20 13 13 20 4 11V4h7Zm-11-5h.01" />,
  trash: <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
};

export function Icon({ name }: IconProps) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}
