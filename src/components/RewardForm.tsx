import { FC, useContext, useEffect, useState } from "react";
import { LocaleContext } from "../contexts/LocaleContext";
import { TraderContext } from "../contexts/TraderContext";
import { IQuestReward } from "../types/models/eft/common/tables/IQuest";
import { CreateEmptyReward } from "../utils/RewardHelper";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { QuestRewardType, RewardType } from "../utils/RewardEnums";
import { ScrollPanel } from "primereact/scrollpanel";
import ObjectId from "bson-objectid";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { QuestDataContext } from "../contexts/QuestDataContext";
import { SelectedQuestContext } from "../contexts/SelectedQuestContext";
import { RewardEvent } from "./QuestEditorForm";
import { Divider } from "primereact/divider";
import { ITemplateItem } from "../types/models/eft/common/tables/ITemplateItem";
import { ItemsContext } from "../contexts/ItemsContext";

interface RewardFormProps {
    existingReward?: IQuestReward | undefined;
    rewardEventType: RewardEvent;
    setRewardFormVisible: (visible: boolean) => void;
}

export const RewardForm: FC<RewardFormProps> = (props): JSX.Element => {
    const { locales } = useContext(LocaleContext)!;
    const { traders } = useContext(TraderContext)!;
    const { quests } = useContext(QuestDataContext)!;
    const { items, itemIdToName } = useContext(ItemsContext)!;
    const { selectedQuestId } = useContext(SelectedQuestContext)!;
    const [copyTooltip, setCopyTooltip] = useState<string>("Copy Reward MongoID");
    const [reward, setReward] = useState<IQuestReward | undefined>(
        structuredClone(props.existingReward)
    );

    useEffect(() => {
        // if reward is undefined, set it up to be of type item with the genreated shit, otherwise just have it be what was given and do nothing
        console.log("Type changed!");
        console.log(itemIdToName);
        if (!reward) {
            //setReward(CreateEmptyReward());
            console.log("IT WAS UNDEFINED");
            return;
        }
        const r = CreateEmptyReward();
        r.id = reward.id;
        r.type = reward.type;
        switch (reward.type) {
            case RewardType.ACHIEVEMENT:
                break;
            case RewardType.ASSORTMENT_UNLOCK: {
                // Set the default target trader to the first one in our list (Should be the custom trader added.)
                r.traderId = Object.keys(traders!).at(0);
                r.loyaltyLevel = 1;
                r.items = [];
                break;
            }
            case RewardType.EXPERIENCE:
                r.value = 1;
                break;
            case RewardType.ITEM: {
                const mongoId = new ObjectId().toHexString();
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
            case RewardType.PRODUCTIONS_SCHEME:
                break;
            case RewardType.SKILL:
                break;
            case RewardType.STASH_ROWS:
                break;
            case RewardType.TRADER_STANDING:
                break;
            case RewardType.TRADER_STANDING_RESET:
                break;
            case RewardType.TRADER_STANDING_RESTORE:
                break;
            case RewardType.TRADER_UNLOCK:
                break;
        }
        setReward(r);
        console.log("Currently selected quest");
        console.log("Event type: " + RewardEvent[props.rewardEventType]);
        console.log(quests![selectedQuestId!]);
    }, [reward?.type]);

    function addRewardToQuest(): boolean {
        if (!quests || !selectedQuestId) return false;
        let rewards = undefined;
        switch (props.rewardEventType) {
            case RewardEvent.STARTED:
                rewards = quests[selectedQuestId].rewards.Started;
                break;
            case RewardEvent.SUCCESS:
                rewards = quests[selectedQuestId].rewards.Success;
                break;
            case RewardEvent.FAIL:
                rewards = quests[selectedQuestId].rewards.Fail;
                break;
        }
        if (!rewards) return false;

        // Find valid index for our reward
        const r = structuredClone(reward!);
        let maxIndex = 0;
        for (const i in rewards) {
            const j = rewards[i];
            if (j.index >= maxIndex) {
                maxIndex = j.index + 1;
            }
        }
        r.index = maxIndex;
        console.log("Found index " + maxIndex);
        rewards.push(r);
        return true;
    }

    return (
        <>
            <ScrollPanel style={{ width: "100%", minHeight: "30rem" }}>
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
                            {reward.value !== undefined && (
                                <FloatLabel>
                                    <InputNumber
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

                        <div
                            className="flex flex-direction-row"
                            style={{ paddingTop: "1rem" }}
                        ></div>
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
