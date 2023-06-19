'use client';

import { StyleProvider } from '@ant-design/cssinjs';
import { ProConfigProvider } from '@ant-design/pro-provider';
import { ConfigProvider } from 'antd';
import { HoxRoot } from 'hox';
import { useEffect, useState } from 'react';

import './globals.scss';

export const dynamic = 'force-dynamic';

const Dynamic = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-cn">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <link rel="stylesheet" href="https://unpkg.com/easymde/dist/easymde.min.css" />
        <script src="https://ssl.captcha.qq.com/TCaptcha.js"></script>
      </head>
      <body>
        <Dynamic>
          <HoxRoot>
            <ConfigProvider>
              <ProConfigProvider>
                <StyleProvider ssrInline={true}>{children}</StyleProvider>
              </ProConfigProvider>
            </ConfigProvider>
          </HoxRoot>
        </Dynamic>
      </body>
    </html>
  );
}
