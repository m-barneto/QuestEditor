import React, { useContext } from 'react'
import { QuestDataContext } from '../contexts/QuestDataContext';
import { SelectedQuestContext } from '../contexts/SelectedQuestContext';

export default function QuestEditorView() {
    const { selectedQuest, setSelectedQuest } = useContext(SelectedQuestContext);
    const { quests, setQuests } = useContext(QuestDataContext)!;

    return (
        <div>
            
        </div>
    )
}
