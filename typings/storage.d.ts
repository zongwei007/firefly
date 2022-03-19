declare interface IBookmark {
  name: string;
  link: string;
  icon: string;
  desc?: string;
  category?: string;
}

declare interface IAppCollection {
  links: Array<IBookmark>;
  lastModifiedAt?: string;
}

declare interface ICategory extends IAppCollection {
  id: string;
  title: string;
}

declare interface IBookmarkCollection {
  categories: Array<ICategory>;
  lastModifiedAt?: string;
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
}
