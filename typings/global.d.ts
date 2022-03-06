declare type ErrorResponse = {
  message: string;
};

declare type GlobalState = { apps: AppCollectionData; bookmarks: BookmarkCollectionData };

declare type GlobalAction = {
  type: string;
};