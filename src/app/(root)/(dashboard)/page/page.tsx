'use client';

import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';

const Page = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    router.replace('/page/list');
  }, []);

  return <></>;
};

export default Page;
