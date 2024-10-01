import { ListBox } from 'primereact/listbox';
import { useContext, useEffect } from 'react';
import { SelectedQuestContext } from '../contexts/SelectedQuestContext';
import { QuestDataContext } from '../contexts/QuestDataContext';

import questJson from "../data/quests.json";
import { IQuest } from '../types/models/eft/common/tables/IQuest';

const questData: Record<string, IQuest> = questJson;

export default function QuestListView() {
    const { selectedQuest, setSelectedQuest } = useContext(SelectedQuestContext)!;
    const { quests, setQuests } = useContext(QuestDataContext)!;

    return quests !== undefined ? (
        <div style={{ height: '100%', width: '100%' }}>
            <ListBox filter style={{ width: '100%' }} listStyle={{ height: '800px' }} 
                options={Object.values(quests)}
                value={selectedQuest}
                onChange={(e) => {setSelectedQuest(e.value as IQuest)}}
                optionLabel="QuestName" 
                className="w-full md:w-14rem"
            />
        </div>
    ) : (
        <div style={{ height: '100%', width: '100%' }}>
            <button onClick={ () => setQuests(questData) }>Load</button>
        </div>
    )
}