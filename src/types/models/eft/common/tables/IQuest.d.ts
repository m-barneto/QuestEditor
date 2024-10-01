import { Item } from "@spt/models/eft/common/tables/IItem";
import { QuestRewardType } from "@spt/models/enums/QuestRewardType";
import { QuestStatus } from "@spt/models/enums/QuestStatus";
import { QuestTypeEnum } from "@spt/models/enums/QuestTypeEnum";
export interface IQuest {
    /** SPT addition - human readable quest name */
    QuestName?: string;
    _id: string;
    canShowNotificationsInGame: boolean;
    conditions: IQuestConditionTypes;
    description: string;
    failMessageText: string;
    name: string;
    note: string;
    traderId: string;
    location: string;
    image: string;
    type: QuestTypeEnum;
    isKey: boolean;
    /** @deprecated - Likely not used, use 'status' instead */
    // NOT REQUIRED
    questStatus?: QuestStatus;

    restartable: boolean;
    instantComplete: boolean;
    secretQuest: boolean;
    startedMessageText: string;
    successMessageText: string;
    // NOT REQUIRED
    acceptPlayerMessage?: string;

    declinePlayerMessage: string;
    // NOT REQUIRED
    completePlayerMessage?: string;

    // NOT REQUIRED
    templateId?: string;

    rewards: IQuestRewards;
    /** Becomes 'AppearStatus' inside client */
    // NOT REQUIRED
    status?: string | number;

    // NOT REQUIRED
    KeyQuest?: boolean;

    changeQuestMessageText: string;
    /** "Pmc" or "Scav" */
    side: string;
    /** Status of quest to player */
    sptStatus?: QuestStatus;
}
export interface IQuestConditionTypes {
    // NOT REQUIRED
    Started?: IQuestCondition[];

    AvailableForFinish: IQuestCondition[];
    AvailableForStart: IQuestCondition[];
    // NOT REQUIRED
    Success?: IQuestCondition[];

    Fail: IQuestCondition[];
}
export interface IQuestCondition {
    id: string;
    index?: number;
    compareMethod?: string;
    dynamicLocale: boolean;
    visibilityConditions?: VisibilityCondition[];
    globalQuestCounterId?: string;
    parentId?: string;
    // NOT REQUIRED
    target?: string[] | string;

    value?: string | number;
    // NOT A BOOL ANYMORE?
    // NEED TO ADD TYPES string | string[]
    type?: boolean | string;

    status?: QuestStatus[];
    availableAfter?: number;
    dispersion?: number;
    onlyFoundInRaid?: boolean;
    oneSessionOnly?: boolean;
    doNotResetIfCounterCompleted?: boolean;
    // STRING IN 655e427b64d09b4122018228
    // added "| string"
    dogtagLevel?: number | string;
    // ITS A STRING IN THE JSON FOR SOME REASON
    // added "| string"
    maxDurability?: number | string;
    minDurability?: number | string;

    counter?: IQuestConditionCounter;
    plantTime?: number;
    zoneId?: string;
    countInRaid?: boolean;
    completeInSeconds?: number;
    isEncoded?: boolean;
    conditionType?: string;
}
export interface IQuestConditionCounter {
    id: string;
    conditions: IQuestConditionCounterCondition[];
}
export interface IQuestConditionCounterCondition {
    id: string;
    // NOT REQUIRED
    dynamicLocale?: boolean;

    target?: string[] | string;
    completeInSeconds?: number;
    energy?: IValueCompare;
    exitName?: string;
    hydration?: IValueCompare;
    time?: IValueCompare;
    compareMethod?: string;
    // ITS A STRING FOR 6391d90f4ed9512be67647df
    value?: number | string;
    weapon?: string[];
    distance?: ICounterConditionDistance;
    equipmentInclusive?: string[][];
    weaponModsInclusive?: string[][];
    weaponModsExclusive?: string[][];
    enemyEquipmentInclusive?: string[][];
    enemyEquipmentExclusive?: string[][];
    weaponCaliber?: string[];
    savageRole?: string[];
    status?: string[];
    bodyPart?: string[];
    daytime?: IDaytimeCounter;
    conditionType?: string;
    enemyHealthEffects?: IEnemyHealthEffect[];
    resetOnSessionEnd?: boolean;
}
export interface IEnemyHealthEffect {
    bodyParts: string[];
    effects: string[];
}
export interface IValueCompare {
    compareMethod: string;
    value: number;
}
export interface ICounterConditionDistance {
    value: number;
    compareMethod: string;
}
export interface IDaytimeCounter {
    from: number;
    to: number;
}
export interface VisibilityCondition {
    id: string;
    target: string;
    value?: number;
    dynamicLocale?: boolean;
    // NOT REQUIRED
    oneSessionOnly?: boolean;
    
    conditionType: string;
}
export interface IQuestRewards {
    AvailableForStart?: IQuestReward[];
    AvailableForFinish?: IQuestReward[];
    Started?: IQuestReward[];
    Success?: IQuestReward[];
    Fail?: IQuestReward[];
    FailRestartable?: IQuestReward[];
    Expired?: IQuestReward[];
}
export interface IQuestReward {
    value?: string | number;
    id?: string;
    type: QuestRewardType;
    index: number;
    target?: string;
    items?: Item[];
    loyaltyLevel?: number;
    /** Hideout area id */
    traderId?: string;
    unknown?: boolean;
    findInRaid?: boolean;
}
