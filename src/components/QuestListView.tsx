import { ListBox } from 'primereact/listbox';
import { useContext, useEffect, useState } from 'react';
import { SelectedQuestContext } from '../contexts/SelectedQuestContext';
import { QuestDataContext } from '../contexts/QuestDataContext';

import questJson from "../data/quests.json";
import { IQuest } from '../types/models/eft/common/tables/IQuest';
import { QuestListboxContext } from '../contexts/QuestListboxContext';

const questData: Record<string, IQuest> = questJson;

interface QuestInfo {
    name: string,
    id: string
}

export default function QuestListView() {
    const { selectedQuestId, setSelectedQuestId } = useContext(SelectedQuestContext)!;
    const { quests, setQuests } = useContext(QuestDataContext)!;
    const { canSelectQuest } = useContext(QuestListboxContext)!;
    const [ questNames, setQuestNames ] = useState<QuestInfo[]>([]);

    useEffect(() => {
        const nameAndId: QuestInfo[] = [];
        for (const id in quests) {
            if (quests[id].QuestName) {
                nameAndId.push({
                    id: id,
                    name: quests[id].QuestName
                });
            } else {
                console.log(`Found quest with no name! ${id}`);
            }
            
        }
        setQuestNames(nameAndId);
    }, [quests]);

    return quests !== undefined ? (
        <div style={{ height: '100%', width: '100%' }}>
            <ListBox filter style={{ width: '100%', height: '100%' }} listStyle={{ height: 'calc(100% - 64px)' }}
                options={questNames}
                value={selectedQuestId}
                onChange={(e) => {if (e.value !== selectedQuestId) setSelectedQuestId(e.value)}}
                optionLabel="name"
                optionValue="id"
                className="w-full"
                disabled={!canSelectQuest}
                tooltip={canSelectQuest ? undefined : "Quest Editor must be valid before switching quests."}
            />
        </div>
    ) : (
        <div style={{ height: '100%', width: '100%' }}>
            <button onClick={ () => setQuests(questData) }>Load</button>
        </div>
    )
}