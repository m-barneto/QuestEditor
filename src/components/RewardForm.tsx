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

interface RewardFormProps {
    existingReward?: IQuestReward | undefined;
}

export const RewardForm: FC<RewardFormProps> = (props): JSX.Element => {
    const { locales } = useContext(LocaleContext)!;
    const { traders } = useContext(TraderContext)!;
    const [copyTooltip, setCopyTooltip] = useState<string>("Copy Reward MongoID");
    const [reward, setReward] = useState<IQuestReward | undefined>(
        structuredClone(props.existingReward)
    );

    useEffect(() => {
        if (reward) {
            console.log("not undefined");
        } else {
            console.log("undefined");
            setReward(CreateEmptyReward());
            return;
        }
        console.log(reward);
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
                r.value = 0;
                break;
            case RewardType.ITEM:
                r.items = [];
                r.value = 1;
                r.findInRaid = true;

                break;
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
    }, [reward?.type]);

    const getForm = (reward: IQuestReward | undefined) => {
        if (!reward) {
            setReward(CreateEmptyReward());
            return <></>;
        }
        switch (reward.type) {
            case "Skill":
                return <></>;
            case "Experience":
                return <></>;
            case "TraderStanding":
                return <></>;
            case "TraderUnlock":
                return <></>;
            case "Item":
                return <div>hi</div>;
            case "AssortmentUnlock":
                return <></>;
            case "ProductionScheme":
                return <></>;
            case "TraderStandingReset":
                return <></>;
            case "TraderStandingRestore":
                return <></>;
            case "StashRows":
                return <></>;
            case "Achievement":
                return <></>;
        }

        return <></>;
    };

    return (
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
                                    onChange={(e) => setReward({ ...reward, type: e.target.value })}
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
                    </div>
                    <div className="flex flex-direction-row" style={{ paddingTop: "1rem" }}>
                        {getForm(reward)}
                    </div>
                </>
            )}
        </ScrollPanel>
    );
};
