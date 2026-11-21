declare interface SettingStorage {
  /** 读取配置 */
  read<T>(name: string): Promise<T | null>;
  /** 更新配置 */
  write(name: string, value: unknown): Promise<void>;
}

declare interface ICategory {
  id: string;
  name: string;
}

declare interface IBookmark {
  name: string;
  link: string;
  /** 自定义图标，格式为 `图标集:名称`，例如 `simple-icons:github`；为空时自动抓取网站图标 */
  icon?: string;
  desc?: string;
  category?: ICategory['id'];
  pined?: boolean;
  private?: boolean;
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
