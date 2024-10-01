import React, { createContext, useEffect, useMemo, useState } from 'react'

import { IQuest } from '../types/models/eft/common/tables/IQuest';

interface QuestDataContextType {
    quests: IQuest[] | undefined;
    setQuests: React.Dispatch<React.SetStateAction<IQuest[] | undefined>>;
}

export const QuestDataContext = createContext<QuestDataContextType | undefined>(undefined);


export const QuestDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [quests, setQuests] = useState<IQuest[] | undefined>(undefined);

  const contextValue = useMemo(() => {
    return {
      quests,
      setQuests
    };
  }, [quests]);

  return (
    <QuestDataContext.Provider value={ contextValue }>
      {children}
    </QuestDataContext.Provider>
  );
};
