import React, { useContext } from 'react'
import { SelectedQuestContext } from '../contexts/SelectedQuestContext';
import { QuestEditorForm } from './QuestEditorForm';
import { ScrollPanel } from 'primereact/scrollpanel';

export default function QuestEditorView() {
    const { selectedQuest } = useContext(SelectedQuestContext);

    return (
        <ScrollPanel style={{ width: "100%" }}>
            <QuestEditorForm initialQuestData={selectedQuest} />
        </ScrollPanel>
    )
}
