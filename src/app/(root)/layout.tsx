'use client';
import FullLoadingView from '@/components/FullLoadingView';
import { useSettingStore } from '@/stores/useSettingStore';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter, useSelectedLayoutSegments } from 'next/navigation';
import { useLayoutEffect } from 'react';

export default ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const userStore = useUserStore();
  const settingStore = useSettingStore();
  const selectedLayoutSegments = useSelectedLayoutSegments();

  const { user, queryUser } = userStore;
  const { querySetting } = settingStore;

  const isLoginPage = selectedLayoutSegments.includes('login');

  useLayoutEffect(() => {
    Promise.all([queryUser(), querySetting()]);
  }, []);

  if (typeof user === 'undefined') {
    return <FullLoadingView />;
  } else if (user) {
    if (isLoginPage) {
      return router.replace('/dashboard');
    }
  } else {
    if (!isLoginPage) {
      return router.replace('/login');
    }
  }

  return children;
};
