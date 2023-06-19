'use client';

import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';

const Page = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    router.replace('/post/list');
  }, []);

  return <></>;
};

export default Page;
