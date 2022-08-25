export enum PostType {
  ARTICLE = 0,
  MOVIE = 1,
  PHOTOGRAPH = 2,
  QUOTE = 3,
}

export enum PostTypeName {
  ARTICLE = '文章',
  MOVIE = '电影',
  PHOTOGRAPH = '画廊',
  QUOTE = '引用',
}

export const postTypeOptions = [
  {
    label: PostTypeName.ARTICLE,
    value: PostType.ARTICLE,
  },
  {
    label: PostTypeName.MOVIE,
    value: PostType.MOVIE,
  },
  {
    label: PostTypeName.PHOTOGRAPH,
    value: PostType.PHOTOGRAPH,
  },
  {
    label: PostTypeName.QUOTE,
    value: PostType.QUOTE,
  },
];
