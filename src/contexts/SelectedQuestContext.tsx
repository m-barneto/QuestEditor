import React, { createContext, useState } from "react";

interface SelectedQuestContextType {
    selectedQuestId: string | undefined;
    setSelectedQuestId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const SelectedQuestContext = createContext<SelectedQuestContextType>({
    selectedQuestId: undefined,
    setSelectedQuestId: () => undefined,
});

export const SelectedQuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedQuestId, setSelectedQuestId] = useState<string | undefined>(undefined);

    return (
        <SelectedQuestContext.Provider value={{ selectedQuestId, setSelectedQuestId }}>
            {children}
        </SelectedQuestContext.Provider>
    );
};
