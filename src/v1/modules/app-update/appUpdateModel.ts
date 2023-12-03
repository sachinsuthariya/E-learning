import { IsNotEmpty, IsString } from "class-validator";

import { Model } from "../../../model";

export class AppUpdateModel extends Model {

    @IsNotEmpty()
    @IsString()
    public version: string;

    @IsNotEmpty()
    @IsString()
    public release_notes: string;

    constructor(body: any) {
        super();
        const {
            version,
            release_notes
        } = body;
        this.version = version;
        this.release_notes = release_notes;
    }
}