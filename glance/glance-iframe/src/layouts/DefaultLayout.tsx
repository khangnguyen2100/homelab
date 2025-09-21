import { ReactNode, Suspense } from 'react';

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <div id='page'>
      <Suspense fallback={<div>loading....</div>}>{/* Sidebar */}</Suspense>

      <div className={'wrapper'}>
        <Suspense fallback={<div>loading....</div>}>{children}</Suspense>
      </div>
    </div>
  );
};
export default DefaultLayout;
