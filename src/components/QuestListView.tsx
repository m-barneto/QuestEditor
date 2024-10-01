import { ListBox } from 'primereact/listbox';
import { SplitterPanel } from 'primereact/splitter';
import { useContext, useEffect } from 'react';
import { SelectedQuestContext } from '../contexts/SelectedQuestContext';
import { QuestDataContext } from '../contexts/QuestDataContext';

import questJson from "../data/quests.json";
import { IQuest } from '../types/models/eft/common/tables/IQuest';

const questData: Record<string, IQuest> = questJson;

export default function QuestListView() {
    const { selectedQuest, setSelectedQuest } = useContext(SelectedQuestContext)!;
    const { quests, setQuests } = useContext(QuestDataContext)!;

    useEffect(() => {
        console.log(selectedQuest);
    }, [selectedQuest]);

    return quests !== undefined ? (
        <div style={{ height: '100%', width: '100%' }}>
            <ListBox filter style={{ width: '100%' }} listStyle={{ height: '800px' }} 
                options={quests}
                value={selectedQuest}
                onChange={(e) => {console.log((e.value as IQuest)._id); setSelectedQuest(e.value as IQuest)}}
                optionLabel="QuestName" 
                className="w-full md:w-14rem"
            />
        </div>
    ) : (
        <div style={{ height: '100%', width: '100%' }}>
            <button onClick={ () => setQuests(Object.values(questData)) }>Load</button>
        </div>
    )
}

//<SplitterPanel className="flex align-items-center justify-content-center" style={{maxWidth: '30%'}}>
//<div style={{ height: '100%', width: '100%' }}>
//<ListBox filter style={{ width: '100%' }} listStyle={{ minHeight: '800px' }} options={quests} value={selectedQuestId} onChange={(e) => {setSelectedQuestId(e.value); console.log(quests)}} optionLabel="QuestName" className="w-full md:w-14rem" />
//</div>
//</SplitterPanel>