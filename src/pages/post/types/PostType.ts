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
    value: PostType.ARTICLE.toString(),
  },
  {
    label: PostTypeName.MOVIE,
    value: PostType.MOVIE.toString(),
  },
  {
    label: PostTypeName.PHOTOGRAPH,
    value: PostType.PHOTOGRAPH.toString(),
  },
  {
    label: PostTypeName.QUOTE,
    value: PostType.QUOTE.toString(),
  },
];
