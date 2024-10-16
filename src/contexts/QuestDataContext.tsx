import React, { createContext, useEffect, useMemo, useState } from "react";
import { IQuest } from "../types/models/eft/common/tables/IQuest";

import questJson from "../data/quests.json";
const questData: Record<string, IQuest> = questJson;

interface QuestDataContextType {
    quests: Record<string, IQuest> | undefined;
    setQuests: React.Dispatch<React.SetStateAction<Record<string, IQuest> | undefined>>;
}

export const QuestDataContext = createContext<QuestDataContextType | undefined>(undefined);

export const QuestDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [quests, setQuests] = useState<Record<string, IQuest> | undefined>(undefined);

    const contextValue = useMemo(() => {
        return {
            quests,
            setQuests,
        };
    }, [quests]);

    useEffect(() => {
        setQuests(questData);
    }, []);

    return <QuestDataContext.Provider value={contextValue}>{children}</QuestDataContext.Provider>;
};
