'use client';

import { useRouter } from 'next/navigation';
import { useLayoutEffect } from 'react';

const Home = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    router.replace('/dashboard');
  }, []);

  return <></>;
};

export default Home;
