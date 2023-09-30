import { IsNotEmpty, IsString } from "class-validator";

import { Model } from "../../../model";

export class CourseCategoriesModel extends Model {

    @IsNotEmpty()
    @IsString()
    public title: string;

    constructor(body: any) {
        super();
        const {
            title
        } = body;
        this.title = title;
    }
}