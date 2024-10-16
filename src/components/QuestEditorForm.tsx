import { FC, useContext, useEffect, useState } from "react";
import { IQuest, IQuestReward } from "../types/models/eft/common/tables/IQuest";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { TabView, TabPanel } from "primereact/tabview";
import { QuestDataContext } from "../contexts/QuestDataContext";
import { QuestListboxContext } from "../contexts/QuestListboxContext";
import { Locations, QuestTypes, SideExclusivity, Traders } from "../utils/QuestEnums";
import { useDebounce } from "use-debounce";
import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { Panel } from "primereact/panel";
import { InputTextarea } from "primereact/inputtextarea";
import { LocaleContext } from "../contexts/LocaleContext";
import { Accordion, AccordionTab } from "primereact/accordion";
import { UserLayoutContext } from "../contexts/UserLayoutContext";
import { Checkbox } from "primereact/checkbox";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { listTemplate, RewardList, rewardTemplate } from "./RewardTemplate";
import { Dialog } from "primereact/dialog";
import { RewardForm } from "./RewardForm";

interface QuestEditorFormProps {
    initialQuestData: string | undefined;
    questname: string;
}

interface ErrorMessages {
    QuestName?: string;
    Location?: string;
}

export enum RewardEvent {
    STARTED,
    SUCCESS,
    FAIL,
    NONE,
}

export const QuestEditorForm: FC<QuestEditorFormProps> = (props): JSX.Element => {
    const { quests, setQuests } = useContext(QuestDataContext)!;
    const { setCanSelectQuest } = useContext(QuestListboxContext)!;
    const { locales, setLocales } = useContext(LocaleContext)!;
    const {
        localeActiveIndices,
        setLocaleActiveIndices,
        rewardsActiveIndices,
        setRewardsActiveIndices,
        questTabIndex,
        setQuestTabIndex,
    } = useContext(UserLayoutContext)!;
    const [quest, setQuest] = useState<IQuest | undefined>();
    const [questName, setQuestName] = useState<string | undefined>(props.questname);
    const [questNameDebounced] = useDebounce(questName, 500);
    const [copyTooltip, setCopyTooltip] = useState<string>("Copy Quest MongoID");
    const [sideExclusive, setSideExclusive] = useState<string>("Both");
    const [rewardFormVisible, setRewardFormVisible] = useState<boolean>(false);
    const [selectedRewardEvent, setSelectedRewardEvent] = useState<RewardEvent>(RewardEvent.NONE);
    const [selectedReward, setSelectedReward] = useState<IQuestReward | undefined>(undefined);

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
            setQuest({ ...quest, QuestName: questNameDebounced });
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
            errors.QuestName = "Quest Name is required.";
        }
        if (!quest.location) {
            errors.Location = "Location is required.";
        }

        return errors;
    };

    function updateLocale(key: string | undefined, value: string): void {
        if (locales && quest && key) {
            const tempLocales = structuredClone(locales);
            tempLocales[key] = value;
            setLocales(tempLocales);
        }
    }

    const rewardDialogHeader = <span>Add Reward</span>;

    const getSelectedRewardsList = () => {
        switch (selectedRewardEvent) {
            case RewardEvent.STARTED:
                return quest?.rewards.Started;
            case RewardEvent.SUCCESS:
                return quest?.rewards.Success;
            case RewardEvent.FAIL:
                return quest?.rewards.Fail;
            default:
                return undefined;
        }
    };

    const showRewardEditor = (reward: IQuestReward, rewardEventType: RewardEvent) => {
        setSelectedReward(reward);
        setSelectedRewardEvent(rewardEventType);
        setRewardFormVisible(true);
    };

    return (
        <div style={{ padding: "10px" }}>
            {quest && locales ? (
                <TabView activeIndex={questTabIndex} onTabChange={(e) => setQuestTabIndex(e.index)}>
                    <TabPanel header="Basics">
                        <Panel header="Info">
                            <div className="flex flex-direction-row" style={{ paddingTop: "1rem" }}>
                                <div className="">
                                    <FloatLabel>
                                        <InputText
                                            id="questname"
                                            placeholder="Quest Name"
                                            className={`mr-2 ${
                                                getErrors().QuestName ? "p-invalid" : ""
                                            }`}
                                            value={questName}
                                            onChange={(e) => setQuestName(e.target.value)}
                                            autoComplete="off"
                                        />
                                        {
                                            <label htmlFor="questname">
                                                {getErrors().QuestName
                                                    ? getErrors().QuestName
                                                    : "Quest Name*"}
                                            </label>
                                        }
                                    </FloatLabel>
                                </div>
                                <div>
                                    <Button
                                        icon="pi pi-tag"
                                        severity="help"
                                        tooltip={copyTooltip}
                                        tooltipOptions={{ position: "top", showDelay: 300 }}
                                        raised
                                        onClick={() => {
                                            navigator.clipboard.writeText(props.initialQuestData!);
                                            setCopyTooltip("Copied Successfully!");
                                            setTimeout(() => {
                                                setCopyTooltip("Copy Quest MongoID");
                                            }, 1000);
                                        }}
                                    />
                                </div>
                                <div className="col flex-grow-1" />
                                <div>
                                    <FloatLabel>
                                        <Dropdown
                                            id="side"
                                            className={`w-5.5rem mr-2 ${
                                                getErrors().Location ? "p-invalid" : ""
                                            }`}
                                            value={quest.side}
                                            onChange={(e) =>
                                                setQuest({ ...quest, side: e.target.value })
                                            }
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
                                            className={`w-10rem ${
                                                getErrors().Location ? "p-invalid" : ""
                                            }`}
                                            value={quest.location}
                                            onChange={(e) =>
                                                setQuest({ ...quest, location: e.target.value })
                                            }
                                            options={Locations}
                                            optionLabel="name"
                                            optionValue="id"
                                            autoComplete="off"
                                        />
                                        <label htmlFor="location">
                                            {getErrors().Location
                                                ? getErrors().Location
                                                : "Location"}
                                        </label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div className="flex flex-direction-row" style={{ paddingTop: "1rem" }}>
                                <div className="col flex-grow-1" />
                            </div>
                            <div className="flex flex-direction-row" style={{ paddingTop: "1rem" }}>
                                <FloatLabel>
                                    <Dropdown
                                        id="trader"
                                        className={`w-5.5rem mr-2`}
                                        value={quest.traderId}
                                        onChange={(e) =>
                                            setQuest({ ...quest, traderId: e.target.value })
                                        }
                                        options={Traders}
                                        optionValue="id"
                                        optionLabel="name"
                                        tooltip=""
                                        tooltipOptions={{ position: "top", showDelay: 300 }}
                                    />
                                    <label htmlFor="trader">Trader</label>
                                </FloatLabel>
                                <FloatLabel>
                                    <Dropdown
                                        id="questtype"
                                        className={`w-5.5rem mr-2`}
                                        value={quest.type}
                                        onChange={(e) =>
                                            setQuest({ ...quest, type: e.target.value })
                                        }
                                        options={QuestTypes}
                                        tooltip="Only affects quest icon."
                                        tooltipOptions={{ position: "top", showDelay: 300 }}
                                    />
                                    <label htmlFor="questtype">Quest Type</label>
                                </FloatLabel>
                                <div className="col flex-grow-1" />
                                <SelectButton
                                    className="w-11rem"
                                    id="sideExclusive"
                                    value={sideExclusive}
                                    onChange={(e) => {
                                        console.log(
                                            `Side Exclusivity not implemented yet! ${e.value}`
                                        );
                                        setSideExclusive(e.value);
                                    }}
                                    options={SideExclusivity}
                                    allowEmpty={false}
                                />
                            </div>
                        </Panel>
                        <Accordion
                            style={{ paddingTop: "1rem" }}
                            activeIndex={localeActiveIndices}
                            multiple
                            onTabChange={(accordianProps) => {
                                setLocaleActiveIndices(accordianProps.index as number[]);
                            }}
                        >
                            <AccordionTab header="Description">
                                <InputTextarea
                                    autoResize
                                    value={locales[quest.description]}
                                    onChange={(e) =>
                                        updateLocale(quest.description, e.target.value)
                                    }
                                    rows={5}
                                    style={{ width: "100%" }}
                                />
                            </AccordionTab>
                            <AccordionTab header="Started Message">
                                <InputTextarea
                                    autoResize
                                    value={locales[quest.startedMessageText]}
                                    onChange={(e) =>
                                        updateLocale(quest.startedMessageText, e.target.value)
                                    }
                                    rows={5}
                                    style={{ width: "100%" }}
                                />
                            </AccordionTab>
                            <AccordionTab header="Fail/Success Message">
                                <FloatLabel style={{ marginTop: "1rem" }}>
                                    <InputTextarea
                                        id="successMessageText"
                                        autoResize
                                        value={locales[quest.successMessageText]}
                                        onChange={(e) =>
                                            updateLocale(quest.successMessageText, e.target.value)
                                        }
                                        rows={5}
                                        style={{ width: "100%" }}
                                    />
                                    <label htmlFor="successMessageText">
                                        Quest Success Message
                                    </label>
                                </FloatLabel>
                                <FloatLabel style={{ marginTop: "1.5rem" }}>
                                    <InputTextarea
                                        id="failMessageText"
                                        autoResize
                                        value={locales[quest.failMessageText]}
                                        onChange={(e) =>
                                            updateLocale(quest.failMessageText, e.target.value)
                                        }
                                        rows={5}
                                        style={{ width: "100%" }}
                                    />
                                    <label htmlFor="failMessageText">Quest Fail Message</label>
                                </FloatLabel>
                            </AccordionTab>
                            <AccordionTab header="Unused Messages">
                                <FloatLabel style={{ marginTop: "1rem" }}>
                                    <InputTextarea
                                        id="acceptPlayerMessage"
                                        autoResize
                                        value={
                                            quest.acceptPlayerMessage
                                                ? locales[quest.acceptPlayerMessage]
                                                : ""
                                        }
                                        onChange={(e) =>
                                            updateLocale(quest.acceptPlayerMessage, e.target.value)
                                        }
                                        rows={5}
                                        style={{ width: "100%" }}
                                    />
                                    <label htmlFor="acceptPlayerMessage">
                                        Accept Player Message
                                    </label>
                                </FloatLabel>
                                <FloatLabel style={{ marginTop: "1.5rem" }}>
                                    <InputTextarea
                                        id="failMessageText"
                                        autoResize
                                        value={locales[quest.failMessageText]}
                                        onChange={(e) =>
                                            updateLocale(quest.failMessageText, e.target.value)
                                        }
                                        rows={5}
                                        style={{ width: "100%" }}
                                    />
                                    <label htmlFor="failMessageText">Quest Fail Message</label>
                                </FloatLabel>
                                <FloatLabel style={{ marginTop: "1.5rem" }}>
                                    <InputTextarea
                                        id="failMessageText"
                                        autoResize
                                        value={locales[quest.failMessageText]}
                                        onChange={(e) =>
                                            updateLocale(quest.failMessageText, e.target.value)
                                        }
                                        rows={5}
                                        style={{ width: "100%" }}
                                    />
                                    <label htmlFor="failMessageText">Quest Fail Message</label>
                                </FloatLabel>
                                <FloatLabel style={{ marginTop: "1.5rem" }}>
                                    <InputTextarea
                                        id="changeQuestMessageText"
                                        autoResize
                                        value={locales[quest.changeQuestMessageText]}
                                        onChange={(e) =>
                                            updateLocale(
                                                quest.changeQuestMessageText,
                                                e.target.value
                                            )
                                        }
                                        rows={5}
                                        style={{ width: "100%" }}
                                    />
                                    <label htmlFor="changeQuestMessageText">
                                        Change Quest Message
                                    </label>
                                </FloatLabel>
                            </AccordionTab>
                        </Accordion>
                    </TabPanel>
                    <TabPanel header="Rewards">
                        <Dialog
                            visible={rewardFormVisible}
                            style={{ width: "50vw" }}
                            onHide={() => {
                                if (!rewardFormVisible) return;
                                setRewardFormVisible(false);
                            }}
                            header={rewardDialogHeader}
                        >
                            <RewardForm
                                existingReward={selectedReward}
                                rewardEventType={selectedRewardEvent}
                                setRewardFormVisible={setRewardFormVisible}
                            ></RewardForm>
                        </Dialog>
                        <Accordion
                            style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
                            multiple
                            activeIndex={rewardsActiveIndices}
                            onTabChange={(accordianProps) => {
                                setRewardsActiveIndices(accordianProps.index as number[]);
                            }}
                        >
                            <AccordionTab header="Started">
                                <Button
                                    icon="pi pi-plus-circle"
                                    severity="success"
                                    tooltip="Add Reward"
                                    raised
                                    onClick={() => {
                                        setSelectedReward(undefined);
                                        setSelectedRewardEvent(RewardEvent.STARTED);
                                        setRewardFormVisible(true);
                                    }}
                                >
                                    &nbsp;&nbsp;Add Reward
                                </Button>

                                <RewardList
                                    rewards={quest.rewards.Started}
                                    rewardEventType={RewardEvent.STARTED}
                                    showRewardEditor={showRewardEditor}
                                />
                            </AccordionTab>
                            <AccordionTab header="Success">
                                <Button
                                    icon="pi pi-plus-circle"
                                    severity="success"
                                    tooltip="Add Reward"
                                    raised
                                    onClick={() => {
                                        setSelectedReward(undefined);
                                        setSelectedRewardEvent(RewardEvent.SUCCESS);
                                        setRewardFormVisible(true);
                                    }}
                                >
                                    &nbsp;&nbsp;Add Reward
                                </Button>
                                <RewardList
                                    rewards={quest.rewards.Success}
                                    rewardEventType={RewardEvent.SUCCESS}
                                    showRewardEditor={showRewardEditor}
                                />
                            </AccordionTab>
                            <AccordionTab header="Fail">
                                <Button
                                    icon="pi pi-plus-circle"
                                    severity="success"
                                    tooltip="Add Reward"
                                    raised
                                    onClick={() => {
                                        setSelectedReward(undefined);
                                        setSelectedRewardEvent(RewardEvent.FAIL);
                                        setRewardFormVisible(true);
                                    }}
                                >
                                    &nbsp;&nbsp;Add Reward
                                </Button>
                                <RewardList
                                    rewards={quest.rewards.Fail}
                                    rewardEventType={RewardEvent.FAIL}
                                    showRewardEditor={showRewardEditor}
                                />
                            </AccordionTab>
                        </Accordion>
                    </TabPanel>
                    <TabPanel header="Conditions">
                        <h3>Conditions</h3>
                    </TabPanel>
                    <TabPanel header="Misc">
                        <Panel
                            header="Optional (May not function as expected!)"
                            className="flex-wrap justify-content-center gap-3"
                        >
                            <div className="grid">
                                <div className="col-4 mb-4">
                                    <Checkbox
                                        inputId="canshownoficationsingame"
                                        checked={quest.canShowNotificationsInGame}
                                        onChange={(e) =>
                                            setQuest({
                                                ...quest,
                                                canShowNotificationsInGame: e.checked!,
                                            })
                                        }
                                    />
                                    <label htmlFor="canshownoficationsingame" className="ml-2">
                                        Show Notifications In Game
                                    </label>
                                </div>
                                <div className="col-4 mb-4">
                                    <Checkbox
                                        inputId="iskey"
                                        checked={quest.isKey}
                                        onChange={(e) => setQuest({ ...quest, isKey: e.checked! })}
                                    />
                                    <label htmlFor="iskey" className="ml-2">
                                        Is Key Quest
                                    </label>
                                </div>
                                <div className="col-4 mb-4">
                                    <Checkbox
                                        inputId="restartable"
                                        checked={quest.restartable}
                                        onChange={(e) =>
                                            setQuest({ ...quest, restartable: e.checked! })
                                        }
                                    />
                                    <label htmlFor="restartable" className="ml-2">
                                        Restartable
                                    </label>
                                </div>
                                <div className="col-4">
                                    <Checkbox
                                        inputId="instantComplete"
                                        checked={quest.instantComplete}
                                        onChange={(e) =>
                                            setQuest({ ...quest, instantComplete: e.checked! })
                                        }
                                    />
                                    <label htmlFor="instantComplete" className="ml-2">
                                        Instant Complete
                                    </label>
                                </div>
                                <div className="col-4">
                                    <Checkbox
                                        inputId="secretQuest"
                                        checked={quest.secretQuest}
                                        onChange={(e) =>
                                            setQuest({ ...quest, secretQuest: e.checked! })
                                        }
                                    />
                                    <label htmlFor="secretQuest" className="ml-2">
                                        Secret Quest
                                    </label>
                                </div>
                                <div className="col-4" />
                            </div>
                            <FloatLabel style={{ marginTop: "2rem" }}>
                                <InputTextarea
                                    id="note"
                                    autoResize
                                    value={locales[quest.note]}
                                    onChange={(e) => updateLocale(quest.note, e.target.value)}
                                    rows={5}
                                    style={{ width: "100%" }}
                                />
                                <label htmlFor="note">Quest Author Notes (Thats you!)</label>
                            </FloatLabel>
                        </Panel>
                    </TabPanel>
                </TabView>
            ) : (
                <>
                    <h4 style={{ paddingLeft: "15px" }}>Select Quest</h4>
                    <Divider />
                </>
            )}
        </div>
    );
};
