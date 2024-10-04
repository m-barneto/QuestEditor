import React, { createContext, useMemo, useState } from 'react'

interface UserLayoutContextType {
    localeActiveIndices: number[];
    setLocaleActiveIndices: React.Dispatch<React.SetStateAction<number[]>>;

    questTabIndex: number;
    setQuestTabIndex: React.Dispatch<React.SetStateAction<number>>;

    rewardsActiveIndices: number[];
    setRewardsActiveIndices: React.Dispatch<React.SetStateAction<number[]>>;
}

export const UserLayoutContext = createContext<UserLayoutContextType | undefined>(undefined);


export const UserLayoutProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [localeActiveIndices, setLocaleActiveIndices] = useState<number[]>([0]);
  const [rewardsActiveIndices, setRewardsActiveIndices] = useState<number[]>([0]);
  const [questTabIndex, setQuestTabIndex] = useState<number>(0);

  const contextValue = useMemo(() => {
    return {
      localeActiveIndices,
      setLocaleActiveIndices,
      
      rewardsActiveIndices,
      setRewardsActiveIndices,

      questTabIndex,
      setQuestTabIndex
    };
  }, [localeActiveIndices, rewardsActiveIndices, questTabIndex]);

  return (
    <UserLayoutContext.Provider value={ contextValue }>
      {children}
    </UserLayoutContext.Provider>
  );
};
