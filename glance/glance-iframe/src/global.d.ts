declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  import { ReactComponent as ReactComponent } from 'react';
  const content: ReactComponent;
  export { content as ReactComponent };
}
