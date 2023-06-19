'use client';

import React from 'react';

export interface BlockProps {
  title: React.ReactNode;
  tip?: React.ReactNode;
  children: React.ReactNode;
}

const Block = (props: BlockProps) => {
  const { title, tip, children } = props;

  return (
    <dl className="mt-2 bg-gray-50 first:mt-0">
      <dt className="px-2 font-bold leading-8">
        {title}
        {typeof tip !== 'undefined' && <span className="text-gray-400 font-normal">{tip}</span>}
      </dt>
      <dd className="p-2">{children}</dd>
    </dl>
  );
};

export default Block;
