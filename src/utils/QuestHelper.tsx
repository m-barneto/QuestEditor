import { IQuest } from "../types/models/eft/common/tables/IQuest";
import { ObjectId } from 'bson';

export const CreateEmptyQuest = ():IQuest => {
    const quest: IQuest = {
        _id: new ObjectId().id.toString(),
    };

    return quest;
};