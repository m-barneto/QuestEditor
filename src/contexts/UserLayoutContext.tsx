import React, { createContext, useMemo, useState } from 'react'

interface UserLayoutContextType {
    localeActiveIndices: number[];
    setLocaleActiveIndices: React.Dispatch<React.SetStateAction<number[]>>;
}

export const UserLayoutContext = createContext<UserLayoutContextType | undefined>(undefined);


export const UserLayoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [localeActiveIndices, setLocaleActiveIndices] = useState<number[]>([]);

  const contextValue = useMemo(() => {
    return {
      localeActiveIndices,
      setLocaleActiveIndices
    };
  }, [localeActiveIndices]);

  return (
    <UserLayoutContext.Provider value={ contextValue }>
      {children}
    </UserLayoutContext.Provider>
  );
};
