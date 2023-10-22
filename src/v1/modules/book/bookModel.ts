import { IsNotEmpty, IsString } from "class-validator";

import { Model } from "../../../model";

export class BookModel extends Model {

    @IsNotEmpty()
    @IsString()
    public title: string;

    @IsNotEmpty()
    @IsString()
    public description: string;

    constructor(body: any) {
        super();
        const {
            title,
            description
        } = body;
        this.title = title;
        this.description = description;

    }
}