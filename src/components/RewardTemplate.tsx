import { classNames } from "primereact/utils";
import { IQuestReward } from "../types/models/eft/common/tables/IQuest";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

import { FC, useContext } from "react";
import { LocaleContext } from "../contexts/LocaleContext";
import { TraderContext } from "../contexts/TraderContext";

interface RewardListProps {
    rewards: IQuestReward[] | undefined;
}

export const RewardList: FC<RewardListProps> = (props): JSX.Element => {
    const { locales } = useContext(LocaleContext)!;
    const { traders } = useContext(TraderContext)!;
    return (
        <div className="grid grid-nogutter">
            {props.rewards?.map((reward, index) => {
                return rewardTemplate(reward, index, locales!, traders!);
            })}
        </div>
    );
};

export const rewardTemplate = (
    reward: IQuestReward,
    index: number,
    locales: Record<string, string>,
    traders: Record<string, string>
) => {
    const getImage = (reward: IQuestReward): string => {
        switch (reward.type) {
            case "Skill":
                return "";
            case "Experience":
                return "https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/00/Experience_Orb_Value_17-36.png";
            case "TraderStanding":
                return "https://static.thenounproject.com/png/1572913-200.png";
            case "TraderUnlock":
                return "https://static.wikia.nocookie.net/lego-videogames/images/c/c8/Stranger_1.png";
            case "Item":
                return `https://assets.tarkov.dev/${reward.items?.at(0)._tpl}-base-image.webp`;
            case "AssortmentUnlock":
                return "https://cdn-icons-png.flaticon.com/512/636/636014.png";
            case "ProductionScheme":
                return "https://play-lh.googleusercontent.com/eQTXISLa8mCDadb8fh34_Mb7P9URLbrud_SLkwYtMvLQwNUuL0mZMs_hRdXWakFu5Ys=w240-h480-rw";
            case "TraderStandingReset":
                return "https://static.thenounproject.com/png/1572913-200.png";
            case "TraderStandingRestore":
                return "https://static.thenounproject.com/png/1572913-200.png";
            case "StashRows":
                return "";
            case "Achievement":
                return "";
            default:
                return "";
        }
    };

    const getTitle = (reward: IQuestReward): string => {
        switch (reward.type) {
            case "Skill":
                return "";
            case "Experience":
                return `${reward.value} EXP`;
            case "TraderStanding":
                return traders[reward.target!];
            case "TraderUnlock":
                return traders[reward.target!];
            case "Item":
                return locales[`${reward.items?.at(0)._tpl} Name`];
            case "AssortmentUnlock":
                return locales[`${reward.items?.at(0)._tpl} Name`];
            case "ProductionScheme":
                return locales[`${reward.items?.at(0)._tpl} Name`];
            case "TraderStandingReset":
                return traders[reward.target!];
            case "TraderStandingRestore":
                return traders[reward.target!];
            case "StashRows":
                return "";
            case "Achievement":
                return "";
            default:
                return "";
        }
    };

    return (
        <div className="col-12" key={reward.id}>
            <div
                className={classNames(
                    "flex flex-column xl:flex-row xl:align-items-start p-4 gap-4",
                    { "border-top-1 surface-border": index !== 0 }
                )}
            >
                <img
                    className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                    style={{ maxHeight: "5rem", maxWidth: "5rem", objectFit: "contain" }}
                    src={getImage(reward)}
                    alt={reward.type}
                />
                <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                        <div className="text-2xl font-bold text-900">{getTitle(reward)}</div>
                        <div className="flex align-items-center gap-3">
                            <Tag
                                value={reward.type}
                                severity={
                                    reward.type == "TraderStanding"
                                        ? (reward.value as number) >= 0
                                            ? "success"
                                            : "danger"
                                        : "secondary"
                                }
                            >
                                {reward.findInRaid && (
                                    <span
                                        className="pi pi-check-circle"
                                        style={{ paddingLeft: "4px" }}
                                    />
                                )}
                            </Tag>
                        </div>
                    </div>
                    <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                        <span className="text-2xl font-semibold">
                            {reward.value ? reward.value : "\u00A0"}
                        </span>
                        <Button
                            icon="pi pi-minus-circle"
                            severity="danger"
                            className="p-button-rounded"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
