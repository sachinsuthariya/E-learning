import { IsNotEmpty, IsString } from "class-validator";

import { Model } from "../../../model";

export class CourseModel extends Model {

    @IsNotEmpty()
    @IsString()
    public title: string;

    @IsNotEmpty()
    @IsString()
    public description: string;

    @IsNotEmpty()
    public category_id: string;

    constructor(body: any) {
        super();
        const {
            title,
            description,
            category_id
        } = body;
        this.title = title;
        this.description = description;
        this.category_id = category_id;

    }
}