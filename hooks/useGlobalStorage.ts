import { useReducer, createContext, useMemo, useCallback, createElement, useContext } from 'react';
import type { Dispatch, FC } from 'react';

const defaultState = { apps: { links: [] }, bookmarks: { categories: [] } };
const globalStorageContext = createContext<[GlobalState, Dispatch<GlobalAction>?]>([defaultState]);

function reducer(state: GlobalState, action: GlobalAction) {
  console.log(action);

  return state;
}

function initializer({ apps, bookmarks }: GlobalState) {
  if (!apps) {
    apps = defaultState.apps;
  }

  if (!bookmarks) {
    bookmarks = defaultState.bookmarks;
  }

  return { apps, bookmarks };
}

export function useGlobalStorage(initialState: GlobalState) {
  const handle = useReducer(reducer, initialState, initializer);

  const GlobalStorageProvider: FC = useCallback(
    ({ children }) => createElement(globalStorageContext.Provider, { value: handle }, children),
    [handle]
  );

  return [GlobalStorageProvider];
}

export function useGlobalState() {
  const [state] = useContext(globalStorageContext);

  return state;
}

export function useGlobalDispatch() {
  const [, dispatch] = useContext(globalStorageContext);

  return dispatch;
}
