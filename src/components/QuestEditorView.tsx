import { useContext } from "react";
import { SelectedQuestContext } from "../contexts/SelectedQuestContext";
import { QuestEditorForm } from "./QuestEditorForm";
import { ScrollPanel } from "primereact/scrollpanel";
import { QuestDataContext } from "../contexts/QuestDataContext";

export default function QuestEditorView() {
    const { selectedQuestId } = useContext(SelectedQuestContext)!;
    const { quests } = useContext(QuestDataContext)!;

    return (
        <ScrollPanel style={{ width: "100%" }}>
            {quests && selectedQuestId && (
                <QuestEditorForm
                    key={selectedQuestId}
                    initialQuestData={selectedQuestId}
                    questname={quests[selectedQuestId!].QuestName!}
                />
            )}
        </ScrollPanel>
    );
}
