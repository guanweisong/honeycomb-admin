// 按层级深度生成分类名前缀
export function creatCategoryTitleByDepth(text, record) {
  let prefix = ''
  for (let i = 0; i < record.deep_path; i++) {
    prefix += '—— '
  }
  return prefix + text
}
