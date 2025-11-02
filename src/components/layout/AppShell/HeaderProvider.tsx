import { createContext, useContext, useMemo, type ReactNode } from 'react';

type HeaderAPI = {
  setLeft(node: ReactNode): void;
  setRight(node: ReactNode): void;
};

const HeaderContext = createContext<HeaderAPI | null>(null);

export function HeaderProvider({
  children,
  setLeft,
  setRight,
}: {
  children: ReactNode;
  setLeft: (node: ReactNode) => void;
  setRight: (node: ReactNode) => void;
}) {
  const api = useMemo(() => ({ setLeft, setRight }), [setLeft, setRight]);

  return (
    <HeaderContext.Provider value={api}>{children}</HeaderContext.Provider>
  );
}

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error('useHeader must be used within HeaderProvider');
  return ctx;
}
