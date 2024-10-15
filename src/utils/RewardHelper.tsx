import { IQuestReward } from "../types/models/eft/common/tables/IQuest";
import ObjectId from "bson-objectid";

export const CreateEmptyReward = (): IQuestReward => {
    const mongoId = new ObjectId().toHexString();
    console.log(mongoId);
    const reward: IQuestReward = {
        id: mongoId,
        type: "Item",
        index: 0,
    };

    return reward;
};
