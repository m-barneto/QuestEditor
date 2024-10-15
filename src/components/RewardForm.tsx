import { FC, useContext, useState } from "react";
import { LocaleContext } from "../contexts/LocaleContext";
import { TraderContext } from "../contexts/TraderContext";
import { rewardTemplate } from "./RewardTemplate";
import { IQuestReward } from "../types/models/eft/common/tables/IQuest";
import { CreateEmptyReward } from "../utils/RewardHelper";

interface RewardFormProps {
    rewards: IQuestReward[];
}

export const RewardForm: FC<RewardFormProps> = (props): JSX.Element => {
    const { locales } = useContext(LocaleContext)!;
    const { traders } = useContext(TraderContext)!;
    const [reward, setReward] = useState<IQuestReward>(CreateEmptyReward());

    const getForm = (type: string) => {
        switch (type) {
            case "Skill":
                return <></>;
            case "Experience":
                return <></>;
            case "TraderStanding":
                return <></>;
            case "TraderUnlock":
                return <></>;
            case "Item":
                return <></>;
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
        <div className="grid grid-nogutter">
            {props.rewards?.map((reward, index) => {
                return rewardTemplate(reward, index, locales!, traders!);
            })}
        </div>
    );
};
