// import type { CategoryEntity } from '@/app/post/category/types/category.entity';

/**
 * 按层级深度生成分类名前缀
 * @param text
 * @param record
 */
export function creatCategoryTitleByDepth(text: string, record: any) {
  let prefix = '';
  for (let i = 0; i < record.deepPath; i++) {
    prefix += '—— ';
  }
  return prefix + text;
}
