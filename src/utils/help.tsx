import React from 'react';

/**
 * 按层级深度生成分类名前缀
 * @param text
 * @param record
 */
export function creatCategoryTitleByDepth(text: React.ReactNode, record: any) {
  let prefix = '';
  for (let i = 0; i < record.deepPath; i++) {
    prefix += '—— ';
  }
  return (
    <span className="flex">
      {prefix} {text}
    </span>
  );
}
