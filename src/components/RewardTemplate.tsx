import { classNames } from "primereact/utils";
import { IQuestReward } from "../types/models/eft/common/tables/IQuest"
import { QuestRewardType } from "../types/models/enums/QuestRewardType";
import { Tag } from 'primereact/tag';
import { Button } from "primereact/button";

import items from "../data/items.json";
import { ITemplateItem } from "../types/models/eft/common/tables/ITemplateItem";

export const listTemplate = (items: IQuestReward[]) => {
    if (!items || items.length === 0) return null;

    const list = items.map((product, index) => {
        return rewardTemplate(product, index);
    });

    return <div className="grid grid-nogutter">{list}</div>;
}

export const rewardTemplate = (reward: IQuestReward, index: number) => {
    const itemReward = (reward: IQuestReward) => {

    };

    const experienceReward = (reward: IQuestReward) => {

    };
    
    const standingReward = (reward: IQuestReward) => {
        
    };

    return (
        <div className="col-12" key={reward.id}>
            <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                        <div className="text-2xl font-bold text-900">{reward.id}</div>
                        <div className="flex align-items-center gap-3">
                            <Tag value={reward.type}>{reward.findInRaid && 
                            <span className="pi pi-check-circle" style={{paddingLeft: "4px"}}/>}</Tag>
                        </div>
                    </div>
                    <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                        <span className="text-2xl font-semibold">${reward.index}</span>
                        <Button icon="pi pi-shopping-cart" className="p-button-rounded">Remove</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}