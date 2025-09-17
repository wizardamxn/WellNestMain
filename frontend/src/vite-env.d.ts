/// <reference types="vite/client" />

// CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Regular CSS files
declare module '*.css';

// SCSS files
declare module '*.scss';
declare module '*.sass';

// Other asset types
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}