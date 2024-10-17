import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import React from "react";
import { TooltipOptions } from "primereact/tooltip/tooltipoptions";
//import { QuestDataContext } from '../contexts/QuestDataContext';
//import { SelectedQuestContext } from '../contexts/SelectedQuestContext';

export default function QuestEditorHeader() {
    //const { selectedQuest, setSelectedQuest } = useContext(SelectedQuestContext);
    //const { quests, setQuests } = useContext(QuestDataContext)!;

    const newQuestJson = () => {
        console.log("setting up new quest json");
    };

    const importQuestJson = () => {
        console.log("Importing existing quest json");
    };

    const exportQuestJson = () => {
        console.log("Exporting quest json");
    };

    const createQuest = () => {};

    const duplicateQuest = () => {};

    const deleteQuest = () => {};

    const tooltipOptions: TooltipOptions = {
        position: "top",
        showDelay: 300,
    };

    const startContent = (
        <React.Fragment>
            <Button
                icon="pi pi-plus"
                tooltip="New Quest JSON"
                tooltipOptions={tooltipOptions}
                raised
                style={{ margin: 2 }}
                onClick={newQuestJson}
            />
            <Button
                icon="pi pi-upload"
                tooltip="Import Existing Quest JSON"
                tooltipOptions={tooltipOptions}
                raised
                style={{ margin: 2 }}
                onClick={importQuestJson}
            />
            <Button
                icon="pi pi-print"
                tooltip="Export Current Quest JSON"
                tooltipOptions={tooltipOptions}
                raised
                style={{ margin: 2 }}
                onClick={exportQuestJson}
            />
        </React.Fragment>
    );

    const endContent = (
        <React.Fragment>
            <Button
                icon="pi pi-plus-circle"
                severity="success"
                tooltip="New Quest"
                tooltipOptions={tooltipOptions}
                raised
                style={{ margin: 2 }}
                onClick={createQuest}
            ></Button>
            <Button
                icon="pi pi-copy"
                severity="help"
                tooltip="Duplicate Quest"
                tooltipOptions={tooltipOptions}
                raised
                style={{ margin: 2 }}
                onClick={duplicateQuest}
            ></Button>
            <Button
                icon="pi pi-trash"
                severity="danger"
                tooltip="Remove Quest"
                tooltipOptions={tooltipOptions}
                raised
                style={{ margin: 2 }}
                onClick={deleteQuest}
            ></Button>
        </React.Fragment>
    );

    return <Toolbar start={startContent} end={endContent} style={{ marginBottom: "8px" }} />;
}
