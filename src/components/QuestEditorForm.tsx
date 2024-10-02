import { FC, useContext, useEffect, useRef, useState } from "react"
import { IQuest } from "../types/models/eft/common/tables/IQuest"
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';     
import { TabView, TabPanel } from 'primereact/tabview';
import { QuestDataContext } from "../contexts/QuestDataContext";
import { QuestListboxContext } from "../contexts/QuestListboxContext";
import { Locations } from "../data/QuestEnums";
import { useDebounce } from "use-debounce";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';

interface QuestEditorFormProps {
    initialQuestData: string | undefined,
    questname: string
};

interface ErrorMessages {
    QuestName?: string,
    Location?: string
}

export const QuestEditorForm: FC<QuestEditorFormProps> = (props): JSX.Element => {
    const { quests, setQuests } = useContext(QuestDataContext)!;
    const { setCanSelectQuest } = useContext(QuestListboxContext)!;
    const [ quest, setQuest ] = useState<IQuest | undefined>();
    const [ questName, setQuestName ] = useState<string | undefined>(props.questname);
    const [ questNameDebounced ] = useDebounce(questName, 500);
    const [ copyTooltip, setCopyTooltip ] = useState<string>("Copy Quest MongoID");

    //const [ formValid, setFormValid] = useState<boolean>(true);

    useEffect(() => {
        if (quests && props.initialQuestData) {
            setQuest(quests[props.initialQuestData]);
            //setQuestName(quest?.QuestName);
        } else {
            setQuest(undefined);
        }
    }, [props.initialQuestData, quests]);

    useEffect(() => {
        if (quest && questNameDebounced) {
            setQuest({...quest, QuestName: questNameDebounced});
        }
    }, [questNameDebounced]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (Object.keys(getErrors()).length > 0) {
            console.log("There were errors!");
            setCanSelectQuest(false);
            return;
        } else {
            setCanSelectQuest(true);
        }

        if (!quests || !quest) return;
        // when we update the quest, we want to forward those changes to the context
        const questsCopy = structuredClone(quests);
        questsCopy[quest._id] = quest;
        setQuests(questsCopy);
    }, [quest]); // eslint-disable-line react-hooks/exhaustive-deps

    const getErrors = (): ErrorMessages => {
        const errors: ErrorMessages = {};

        if (quest === null || quest === undefined) {
            return errors;
        }

        if (!questName) {
            errors.QuestName = 'Quest Name is required.';
        }
        if (!quest.location) {
            errors.Location = "Location is required.";
        }

        return errors;
    };

    return (
        <div style={{padding: "10px"}}>
            {quest ? (
                <TabView>
                    <TabPanel header="Basics">
                        <div className="flex flex-direction-row" style={{paddingTop: "1rem"}}>
                            <div className="">
                                <FloatLabel>
                                    <InputText
                                    id="questname"
                                    placeholder="Quest Name"
                                    className={`mr-2 ${getErrors().QuestName ? "p-invalid" : ""}`}
                                    value={questName}
                                    onChange={(e) => setQuestName(e.target.value)}
                                    autoComplete="off"
                                    />
                                    {getErrors().QuestName && <label htmlFor="questname">{getErrors().QuestName}</label>}
                                </FloatLabel>
                            </div>
                            <div>
                                <Button icon="pi pi-tag" 
                                severity='help' 
                                tooltip={copyTooltip}
                                tooltipOptions={{ position: 'top', showDelay: 300 }} 
                                raised
                                onClick={() => {
                                    navigator.clipboard.writeText(props.initialQuestData!);
                                    setCopyTooltip("Copied Successfully!");
                                    setTimeout(() => {
                                        setCopyTooltip("Copy Quest MongoID");
                                    }, 1000);
                                }} />
                            </div>
                            <div className="col flex-grow-1" />
                            <div>
                                <FloatLabel>
                                    <Dropdown
                                    id="side"
                                    
                                    className={`w-5.5rem mr-2 ${getErrors().Location ? "p-invalid" : ""}`}
                                    value={quest.side}
                                    onChange={(e) => setQuest({...quest, side: e.target.value})}
                                    options={["Pmc", "Scav"]}
                                    autoComplete="off"
                                    />
                                    <label htmlFor="side">Side</label>
                                </FloatLabel>
                            </div>
                            <div>
                                <FloatLabel>
                                    <Dropdown
                                    id="location"
                                    
                                    className={`w-10rem ${getErrors().Location ? "p-invalid" : ""}`}
                                    value={quest.location}
                                    onChange={(e) => setQuest({...quest, location: e.target.value})}
                                    options={Locations}
                                    optionLabel="name"
                                    optionValue="id"
                                    autoComplete="off"
                                    />
                                    <label htmlFor="location">{getErrors().Location ? getErrors().Location : "Location"}</label>
                                </FloatLabel>
                            </div>
                        </div>
                        <Accordion activeIndex={0} style={{paddingTop: "1rem"}}>
                            <AccordionTab header="Header I">

                            </AccordionTab>
                        </Accordion>
                    </TabPanel>
                    <TabPanel header="Locales">
                        <h3>Locales</h3>
                    </TabPanel>
                    <TabPanel header="Rewards">
                        <h3>Rewards</h3>
                    </TabPanel>
                    <TabPanel header="Conditions">
                        <h3>Conditions</h3>
                    </TabPanel>
                </TabView>
            ) : (
            <>
                <h4 style={{paddingLeft: "15px"}}>Select Quest</h4>
                <Divider />
            </>
            )} 
        </div>
    );
}
