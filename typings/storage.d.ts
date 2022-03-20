declare interface ICategory {
  id: 'favorite' | string;
  name: string;
}

declare interface IBookmark {
  name: string;
  link: string;
  icon: string;
  desc?: string;
  category?: ICategory['id'];
}

declare interface IBookmarkConfiguration {
  categories: Array<ICategory>;
  bookmarks: Array<IBookmark>;
  lastModifiedAt?: string;
}

declare interface IBookmarkCollection extends IBookmarkConfiguration {
  favorites: Array<IBookmark>;
}

declare interface ISetting {
  lastModifiedAt?: string;
  weather: {
    enable: boolean;
    location: string;
  };
  search: {
    enable: boolean;
    autoFocus: boolean;
  };
  ui: {
    title: string;
    footer?: string;
    clock: {
      enable: boolean;
      welcome: string;
    };
    favorite: {
      enable: boolean;
      target?: '_self' | '_blank' | string;
    };
    bookmark: {
      enable: boolean;
      target?: '_self' | '_blank' | string;
    };
  };
}
