declare type Bookmark = {
  name: string;
  link: string;
  icon: string;
  desc?: string;
  category?: string;
};

declare type Category = AppCollectionData & {
  id: string;
  title: string;
};

declare type AppCollectionData = {
  links: Array<Bookmark>;
};

declare type BookmarkCollectionData = {
  categories: Array<Category>;
};
