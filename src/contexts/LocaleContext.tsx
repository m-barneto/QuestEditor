import React, { createContext, useMemo, useState } from 'react'

interface LocaleContextType {
    locales: Record<string, string> | undefined;
    setLocales: React.Dispatch<React.SetStateAction<Record<string, string> | undefined>>;
}

export const LocaleContext = createContext<LocaleContextType | undefined>(undefined);


export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locales, setLocales] = useState<Record<string, string> | undefined>(undefined);

  const contextValue = useMemo(() => {
    return {
      locales,
      setLocales
    };
  }, [locales]);

  return (
    <LocaleContext.Provider value={ contextValue }>
      {children}
    </LocaleContext.Provider>
  );
};
