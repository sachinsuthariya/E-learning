import { IsNotEmpty, IsString } from "class-validator";

import { Model } from "../../../model";

export class CurrentAffairsModel extends Model {

    @IsNotEmpty()
    @IsString()
    public title: string;

    @IsNotEmpty()
    @IsString()
    public content: string;

    constructor(body: any) {
        super();
        const {
            title,
            content
        } = body;
        this.title = title;
        this.content = content;
    }
}