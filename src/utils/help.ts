import type { CategoryEntity } from '@/pages/post/category/types/category.entity';

/**
 * 按层级深度生成分类名前缀
 * @param text
 * @param record
 */
export function creatCategoryTitleByDepth(text: string, record: CategoryEntity) {
  let prefix = '';
  for (let i = 0; i < record.deep_path; i++) {
    prefix += '—— ';
  }
  return prefix + text;
}