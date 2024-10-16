import React, { createContext, useEffect, useMemo, useState } from "react";

import traderJson from "../data/traders.json";
const traderData: Record<string, string> = traderJson;

interface TraderContextType {
    traders: Record<string, string> | undefined;
    setTraders: React.Dispatch<React.SetStateAction<Record<string, string> | undefined>>;
}

export const TraderContext = createContext<TraderContextType | undefined>(undefined);

export const TraderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [traders, setTraders] = useState<Record<string, string> | undefined>(undefined);

    const contextValue = useMemo(() => {
        return {
            traders,
            setTraders,
        };
    }, [traders]);

    useEffect(() => {
        setTraders(traderData);
    }, []);

    return <TraderContext.Provider value={contextValue}>{children}</TraderContext.Provider>;
};
