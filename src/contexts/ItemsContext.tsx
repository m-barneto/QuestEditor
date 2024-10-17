import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ITemplateItem } from "../types/models/eft/common/tables/ITemplateItem";

import itemsJson from "../data/items.json";
import { LocaleContext } from "./LocaleContext";

const itemsData: Record<string, ITemplateItem> = itemsJson as unknown as Record<
    string,
    ITemplateItem
>;

interface ItemInfo {
    id: string;
    name: string;
}

interface ItemsContextType {
    items: Record<string, ITemplateItem> | undefined;
    setItems: React.Dispatch<React.SetStateAction<Record<string, ITemplateItem> | undefined>>;
    itemIdToName: Record<string, ItemInfo> | undefined;
}

export const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<Record<string, ITemplateItem> | undefined>(undefined);
    const [itemIdToName, setItemIdToName] = useState<Record<string, ItemInfo> | undefined>(
        undefined
    );
    const { locales } = useContext(LocaleContext)!;

    const contextValue = useMemo(() => {
        return {
            items,
            setItems,
            itemIdToName,
        };
    }, [items, itemIdToName]);

    useEffect(() => {
        setItems(itemsData);
    }, []);

    useEffect(() => {
        const itemIdToNameTemp: Record<string, ItemInfo> = {};
        for (const i in items) {
            if (locales![`${i} Name`]) {
                itemIdToNameTemp[i] = {
                    id: i,
                    name: locales![`${i} Name`],
                };
            }
        }
        setItemIdToName(itemIdToNameTemp);
    }, [items, locales]);

    return <ItemsContext.Provider value={contextValue}>{children}</ItemsContext.Provider>;
};
