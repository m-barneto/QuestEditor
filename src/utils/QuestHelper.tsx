import { IQuest } from "../types/models/eft/common/tables/IQuest";
import { QuestTypeEnum } from "../types/models/enums/QuestTypeEnum";
import ObjectId from "bson-objectid";

export const CreateEmptyQuest = (traderId: string): IQuest => {
    const mongoId = new ObjectId().toHexString();
    const quest: IQuest = {
        _id: mongoId,
        canShowNotificationsInGame: true,
        conditions: {
            AvailableForFinish: [],
            AvailableForStart: [],
            Fail: [],
        },
        description: `${mongoId} description`,
        failMessageText: `${mongoId} failMessageText`,
        name: `${mongoId} name`,
        note: `${mongoId} note`,
        traderId: traderId,
        location: "any",
        image: `/files/quest/icon/${mongoId}.jpg`,
        type: QuestTypeEnum.PICKUP,
        isKey: false,
        restartable: false,
        instantComplete: false,
        secretQuest: false,
        startedMessageText: `${mongoId} startedMessageText`,
        successMessageText: `${mongoId} successMessageText`,
        declinePlayerMessage: `${mongoId} declinePlayerMessage`,
        changeQuestMessageText: `${mongoId} changeQuestMessageText`,
        side: "Pmc",
        rewards: {},
    };

    return quest;
};
