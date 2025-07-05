'use client';

import { createContext, PropsWithChildren, useContext } from 'react';

export const SettingContext = createContext<ISetting | undefined>(undefined);

export function useSetting() {
  return useContext(SettingContext);
}

export function SettingProvider({ value, children }: PropsWithChildren<{ value: ISetting }>) {
  return <SettingContext.Provider value={value}>{children}</SettingContext.Provider>;
}
