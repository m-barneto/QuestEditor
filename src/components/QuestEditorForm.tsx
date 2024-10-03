import { FC, useContext, useEffect, useRef, useState } from "react"
import { IQuest } from "../types/models/eft/common/tables/IQuest"
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';     
import { TabView, TabPanel } from 'primereact/tabview';
import { QuestDataContext } from "../contexts/QuestDataContext";
import { QuestListboxContext } from "../contexts/QuestListboxContext";
import { Locations, QuestTypes, SideExclusivity, Traders } from "../utils/QuestEnums";
import { useDebounce } from "use-debounce";
import { Button } from "primereact/button";
import { SelectButton } from 'primereact/selectbutton';
import { Panel } from 'primereact/panel';
import { InputTextarea } from 'primereact/inputtextarea';
import { LocaleContext } from "../contexts/LocaleContext";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { UserLayoutContext } from "../contexts/UserLayoutContext";

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
    const { locales, setLocales } = useContext(LocaleContext)!;
    const { localeActiveIndices, setLocaleActiveIndices } = useContext(UserLayoutContext)!;
    const [ quest, setQuest ] = useState<IQuest | undefined>();
    const [ questName, setQuestName ] = useState<string | undefined>(props.questname);
    const [ questNameDebounced ] = useDebounce(questName, 500);
    const [ copyTooltip, setCopyTooltip ] = useState<string>("Copy Quest MongoID");
    const [ sideExclusive, setSideExclusive ] = useState<string>("Both");

    //const [ formValid, setFormValid] = useState<boolean>(true);

    useEffect(() => {
        if (quests && props.initialQuestData) {
            setQuest(quests[props.initialQuestData]);
        } else {
            setQuest(undefined);
        }
    }, [props.initialQuestData, quests]);

    useEffect(() => {
        if (quest && questNameDebounced) {
            setQuest({...quest, QuestName: questNameDebounced});
            if (locales) {
                const tempLocales = structuredClone(locales);
                tempLocales[quest.name] = questNameDebounced;
                setLocales(tempLocales);
            } else {
                console.log("Locales was undefined???");
            }
        }
    }, [questNameDebounced]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (Object.keys(getErrors()).length > 0) {
            console.log("There were errors!");
            setCanSelectQuest(false);
            return;
        } else {
            setCanSelectQuest(true);
        }

        if (!quests || !quest || quests[quest._id] == quest) return;

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
            {quest && locales ? (
                <TabView>
                    <TabPanel header="Basics">
                        <Panel header="Info">
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
                                        {<label htmlFor="questname">{getErrors().QuestName ? getErrors().QuestName : "Quest Name*"}</label>}
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
                            <div className="flex flex-direction-row" style={{paddingTop: "1rem"}}>
                                <div className="col flex-grow-1" />
                            </div>
                            <div className="flex flex-direction-row" style={{paddingTop: "1rem"}}>
                                <FloatLabel>
                                    <Dropdown
                                    id="trader"
                                    className={`w-5.5rem mr-2`}
                                    value={quest.traderId}
                                    onChange={(e) => setQuest({...quest, traderId: e.target.value})}
                                    options={Traders}
                                    optionValue="id"
                                    optionLabel="name"
                                    tooltip=""
                                    tooltipOptions={{ position: 'top', showDelay: 300 }}
                                    />
                                    <label htmlFor="trader">Trader</label>
                                </FloatLabel>
                                <FloatLabel>
                                    <Dropdown
                                    id="questtype"
                                    className={`w-5.5rem mr-2`}
                                    value={quest.type}
                                    onChange={(e) => setQuest({...quest, type: e.target.value})}
                                    options={QuestTypes}
                                    tooltip="Only affects quest icon."
                                    tooltipOptions={{ position: 'top', showDelay: 300 }}
                                    />
                                    <label htmlFor="questtype">Quest Type</label>
                                </FloatLabel>
                                <div className="col flex-grow-1" />
                                <SelectButton
                                className="w-11rem"
                                id="sideExclusive"
                                value={sideExclusive}
                                onChange={(e) => {
                                    console.log(`Side Exclusivity not implemented yet! ${e.value}`);
                                    setSideExclusive(e.value);
                                }}
                                options={SideExclusivity}
                                allowEmpty={false}
                                />
                            </div>
                        </Panel>
{/*                        <Panel header="Lore" style={{paddingTop: "1rem"}}>
                            <div className="card flex justify-content-center">
                                <InputTextarea autoResize value={locales[quest.description]} onChange={(e) => console.log(e.target.value)} rows={5} style={{width: "100%"}}/>
                            </div>
                        </Panel>*/}
                        <Accordion style={{paddingTop: "1rem"}} activeIndex={localeActiveIndices} multiple onTabChange={(accordianProps) => {
                            setLocaleActiveIndices(accordianProps.index as number[]);
                        }}>
                            <AccordionTab header="Quest Description">
                                <InputTextarea autoResize value={locales[quest.description]} onChange={(e) => console.log(e.target.value)} rows={5} style={{width: "100%"}}/>
                            </AccordionTab>
                            <AccordionTab header="Quest Started Message">
                                <InputTextarea autoResize value={locales[quest.startedMessageText]} onChange={(e) => console.log(e.target.value)} rows={5} style={{width: "100%"}}/>
                            </AccordionTab>
                            <AccordionTab header="Quest Fail/Success">
                                <FloatLabel style={{marginTop: "1rem"}}>
                                    <InputTextarea id="successMessageText" autoResize value={locales[quest.successMessageText]} onChange={(e) => console.log(e.target.value)} rows={5} style={{width: "100%"}}/>
                                    <label htmlFor="successMessageText">Quest Success Message</label>
                                </FloatLabel>
                                <FloatLabel style={{marginTop: "1.5rem"}}>
                                    <InputTextarea id="failMessageText" autoResize value={locales[quest.failMessageText]} onChange={(e) => console.log(e.target.value)} rows={5} style={{width: "100%"}}/>
                                    <label htmlFor="failMessageText">Quest Fail Message</label>
                                </FloatLabel>
                            </AccordionTab>
                        </Accordion>
                    </TabPanel>
                    <TabPanel header="Rewards">
                        <h3>Rewards</h3>
                    </TabPanel>
                    <TabPanel header="Conditions">
                        <h3>Conditions</h3>
                    </TabPanel>
                    <TabPanel header="Misc">
                    <Panel header="Miscellaneous Options">
                            <div className="flex flex-direction-row" style={{paddingTop: "1rem"}}>
                            </div>
                            <div className="flex flex-direction-row" style={{paddingTop: "1rem"}}>
                                <div className="col flex-grow-1" />
                            </div>
                            <div className="flex flex-direction-row" style={{paddingTop: "1rem"}}>
                                
                            </div>
                        </Panel>
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
