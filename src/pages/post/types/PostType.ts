export enum PostType {
  ARTICLE,
  MOVIE,
  PHOTOGRAPH,
  QUOTE,
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
