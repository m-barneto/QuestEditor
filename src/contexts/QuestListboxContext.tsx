import React, { createContext, useState } from 'react'


interface QuestListboxContextType {
    canSelectQuest: boolean;
    setCanSelectQuest: React.Dispatch<React.SetStateAction<boolean>>;
}

export const QuestListboxContext = createContext<QuestListboxContextType>({
    canSelectQuest: true,
    setCanSelectQuest: () => undefined
});


export const QuestListboxProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [canSelectQuest, setCanSelectQuest] = useState<boolean>(true);

  return (
    <QuestListboxContext.Provider value={{ canSelectQuest, setCanSelectQuest }}>
      {children}
    </QuestListboxContext.Provider>
  );
};
