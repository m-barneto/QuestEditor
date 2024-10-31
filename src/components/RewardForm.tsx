import { FC, useContext, useEffect, useState } from "react";
import { TraderContext } from "../contexts/TraderContext";
import { IQuestReward } from "../types/models/eft/common/tables/IQuest";
import { CreateEmptyReward } from "../utils/RewardHelper";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { QuestRewardType, RewardType } from "../utils/RewardEnums";
import { ScrollPanel } from "primereact/scrollpanel";
import ObjectId from "bson-objectid";
import { InputNumber } from "primereact/inputnumber";
import { QuestDataContext } from "../contexts/QuestDataContext";
import { SelectedQuestContext } from "../contexts/SelectedQuestContext";
import { RewardEvent } from "./QuestEditorForm";
import { ItemsContext } from "../contexts/ItemsContext";
import { Checkbox } from "primereact/checkbox";
import { Traders } from "../utils/QuestEnums";

interface RewardFormProps {
    existingReward?: IQuestReward | undefined;
    rewardEventType: RewardEvent;
    setRewardFormVisible: (visible: boolean) => void;
}

export const RewardForm: FC<RewardFormProps> = (props): JSX.Element => {
    //const { locales } = useContext(LocaleContext)!;
    const { traders } = useContext(TraderContext)!;
    const { quests, setQuests } = useContext(QuestDataContext)!;
    const { itemIdToName } = useContext(ItemsContext)!;
    const { selectedQuestId } = useContext(SelectedQuestContext)!;
    const [copyTooltip, setCopyTooltip] = useState<string>("Copy Reward MongoID");
    const [reward, setReward] = useState<IQuestReward | undefined>(
        structuredClone(props.existingReward)
    );
    const [prevRewardType, setPrevRewardType] = useState<string | undefined>(
        props.existingReward ? props.existingReward.type : undefined
    );

    useEffect(() => {
        const r = CreateEmptyReward();
        // if reward is undefined, set it up to be of type item with the genreated shit, otherwise just have it be what was given and do nothing
        if (reward) {
            // it was defined, if prevtype is undefined, do nothing except set prevstype to this reward type
            if (prevRewardType == undefined) {
                setPrevRewardType(reward.type);
                return;
            } else {
                // prev type is defined, if its the same as this reward type, do nothing
                if (prevRewardType == reward.type) {
                    console.log("Had same type as previous, returning and doing nothing");
                    return;
                } else {
                    console.log("Creating new reward object with reward already defined!");
                    r.id = reward.id;
                    r.type = reward.type;
                    setPrevRewardType(r.type);
                }
            }
        } else {
            console.log("Wasnt defined or type changed, create new one");
        }

        const mongoId = new ObjectId().toHexString();
        switch (r.type) {
            case RewardType.ACHIEVEMENT: {
                r.target = "";
                break;
            }
            case RewardType.ASSORTMENT_UNLOCK: {
                // Set the default target trader to the first one in our list (Should be the custom trader added.)
                r.traderId = Object.keys(traders!).at(0);
                r.loyaltyLevel = 1;
                r.items = [];
                r.items.push({
                    _id: mongoId,
                    _tpl: "544fb25a4bdc2dfb738b4567",
                    upd: {
                        StackObjectsCount: r.value,
                    },
                });
                break;
            }
            case RewardType.EXPERIENCE:
                r.value = 1;
                break;
            case RewardType.ITEM: {
                r.items = [];
                r.value = 1;
                r.items.push({
                    _id: mongoId,
                    _tpl: "544fb25a4bdc2dfb738b4567",
                    upd: {
                        StackObjectsCount: r.value,
                    },
                });

                r.findInRaid = true;
                r.target = mongoId;

                break;
            }
            case RewardType.PRODUCTIONS_SCHEME: {
                r.target = "";
                break;
            }
            case RewardType.SKILL: {
                r.target = "AimDrills";
                r.value = 1;
                break;
            }
            case RewardType.STASH_ROWS: {
                break;
            }
            case RewardType.TRADER_STANDING: {
                r.target = Traders[0].id;
                r.value = 0.01;
                break;
            }
            case RewardType.TRADER_STANDING_RESET: {
                break;
            }
            case RewardType.TRADER_STANDING_RESTORE: {
                r.target = Traders[0].id;
                r.value = 0.01;
                break;
            }
            case RewardType.TRADER_UNLOCK: {
                r.target = Traders[0].id;
                break;
            }
        }
        setReward(r);
    }, [reward?.type]);

    function addRewardToQuest(): boolean {
        if (!quests || !selectedQuestId) return false;
        const questCopy = structuredClone(quests[selectedQuestId]);
        let rewards = undefined;
        switch (props.rewardEventType) {
            case RewardEvent.STARTED:
                rewards = questCopy.rewards.Started;
                break;
            case RewardEvent.SUCCESS:
                rewards = questCopy.rewards.Success;
                break;
            case RewardEvent.FAIL:
                rewards = questCopy.rewards.Fail;
                break;
        }
        if (!rewards) return false;

        // Find valid index for our reward
        const r = structuredClone(reward!);

        let existing: boolean = false;
        rewards.forEach((reward, index, array) => {
            if (reward.id == r.id) {
                existing = true;
                array[index] = r;
            }
        });

        if (!existing) {
            let maxIndex = 0;
            for (const i in rewards) {
                const j = rewards[i];
                if (j.index >= maxIndex) {
                    maxIndex = j.index + 1;
                }
            }
            r.index = maxIndex;
            rewards.push(r);
        }
        // when we update the quest, we want to forward those changes to the context
        const questsCopy = structuredClone(quests);
        questsCopy[selectedQuestId] = questCopy;
        setQuests(questsCopy);
        return true;
    }

    return (
        <>
            <ScrollPanel style={{ minHeight: "30rem" }}>
                {reward && (
                    <>
                        <div className="flex flex-direction-row" style={{ paddingTop: "1.5rem" }}>
                            <div>
                                <FloatLabel>
                                    <Dropdown
                                        id="rewardtype"
                                        className={`w-12rem mr-2`}
                                        value={reward.type}
                                        onChange={(e) =>
                                            setReward({ ...reward, type: e.target.value })
                                        }
                                        options={Object.values(QuestRewardType)}
                                        optionLabel="name"
                                        optionValue="name"
                                        autoComplete="off"
                                    />
                                    <label htmlFor="rewardtype">Reward Type</label>
                                </FloatLabel>
                            </div>
                            <div>
                                <Button
                                    className="mr-2"
                                    icon="pi pi-tag"
                                    severity="help"
                                    raised
                                    tooltip={copyTooltip}
                                    tooltipOptions={{ position: "top", showDelay: 300 }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(reward.id!);
                                        setCopyTooltip("Copied Successfully!");
                                        setTimeout(() => {
                                            setCopyTooltip("Copy Reward MongoID");
                                        }, 1000);
                                    }}
                                />
                            </div>
                            <div className="col flex-grow-1" />
                            <div>
                                {reward.value !== undefined && typeof reward.value === "number" && (
                                    <FloatLabel>
                                        <InputNumber
                                            inputClassName="w-4rem mr-2"
                                            inputId="value"
                                            value={parseFloat(reward.value!.toString()) as number}
                                            onValueChange={(e) => {
                                                if (reward.type == "Item") {
                                                    const item = reward.items![0];
                                                    item.upd.StackObjectsCount = e.target.value
                                                        ? e.target.value
                                                        : 1;
                                                    setReward({
                                                        ...reward,
                                                        value: e.target.value ? e.target.value : 1,
                                                        items: [item],
                                                    });
                                                } else {
                                                    setReward({
                                                        ...reward,
                                                        value: e.target.value ? e.target.value : 1,
                                                    });
                                                }
                                            }}
                                            useGrouping={false}
                                        />
                                        <label htmlFor="value">Amount</label>
                                    </FloatLabel>
                                )}
                                {reward.value !== undefined && typeof reward.value === "string" && (
                                    <FloatLabel>
                                        <Dropdown
                                            inputId="target"
                                            className={`w-12rem mr-2`}
                                            value={reward.target}
                                            onChange={(e) =>
                                                setReward({ ...reward, target: e.target.value })
                                            }
                                            options={Object.values([])}
                                            optionLabel="name"
                                            optionValue="name"
                                            autoComplete="off"
                                        />
                                        <label htmlFor="rewardtype">Reward Type</label>
                                    </FloatLabel>
                                )}
                            </div>
                            <div>
                                {reward.items !== undefined && (
                                    <FloatLabel>
                                        <Dropdown
                                            inputId="item"
                                            options={Object.values(itemIdToName!)}
                                            optionValue="id"
                                            optionLabel="name"
                                            editable
                                            virtualScrollerOptions={{ itemSize: 38 }}
                                            className="w-full md:w-14rem"
                                            value={reward.items[0]._tpl}
                                            onChange={(e) => {
                                                const item = reward.items![0];
                                                item._tpl = e.target.value
                                                    ? e.target.value
                                                    : "544fb25a4bdc2dfb738b4567";
                                                setReward({
                                                    ...reward,
                                                    items: [item],
                                                });
                                            }}
                                        />
                                        <label htmlFor="item">Item</label>
                                    </FloatLabel>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-direction-row" style={{ paddingTop: "1rem" }}>
                            <div className="col flex-grow-1" />
                            <div>
                                {reward.findInRaid !== undefined && (
                                    <>
                                        <Checkbox
                                            checked={reward.findInRaid}
                                            inputId="foundinraid"
                                            style={{ marginRight: ".5rem" }}
                                            onChange={(e) => {
                                                setReward({
                                                    ...reward,
                                                    findInRaid: e.checked,
                                                });
                                            }}
                                        />
                                        <label htmlFor="foundinraid">Found In Raid</label>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </ScrollPanel>
            <div className="p-dialog-footer pb-2 pr-0">
                <Button
                    style={{ width: "6rem", justifyContent: "center" }}
                    size="large"
                    severity="success"
                    raised
                    onClick={() => {
                        addRewardToQuest();
                        props.setRewardFormVisible(false);
                        // Submit reward entry to quest
                    }}
                >
                    Save
                </Button>
            </div>
        </>
    );
};
