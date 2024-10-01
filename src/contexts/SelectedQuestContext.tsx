import React, { createContext, useState } from 'react'
import { IQuest } from '../types/models/eft/common/tables/IQuest';


interface SelectedQuestContextType {
    selectedQuest: IQuest | undefined;
    setSelectedQuest: React.Dispatch<React.SetStateAction<IQuest | undefined>>;
}

export const SelectedQuestContext = createContext<SelectedQuestContextType>({
    selectedQuest: undefined,
    setSelectedQuest: () => undefined
});


export const SelectedQuestProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedQuest, setSelectedQuest] = useState<IQuest | undefined>(undefined);

  return (
    <SelectedQuestContext.Provider value={{ selectedQuest, setSelectedQuest }}>
      {children}
    </SelectedQuestContext.Provider>
  );
};
