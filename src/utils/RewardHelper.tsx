import { IQuestReward } from "../types/models/eft/common/tables/IQuest";

export const CreateEmptyReward = (): IQuestReward => {
    const reward: IQuestReward = {
        type: "Item",
        index: 0,
    };

    return reward;
};
