import { IsNotEmpty, IsString, IsNumber, IsDate } from "class-validator";

import { Model } from "../../../model";

export class ExamModel extends Model {

    @IsNotEmpty()
    @IsString()
    public title: string;

    @IsNotEmpty()
    // @IsDate()   /// comment reason: postman is not accepting DATE type
    public exam_date: Date;

    @IsNotEmpty()
    @IsNumber()
    public duration_minutes: number;

    @IsNotEmpty()
    // @IsDate()   /// comment reason: postman is not accepting DATE type
    public start_time: Date;

    @IsNotEmpty()
    // @IsDate()
    public end_time: Date;

    @IsNotEmpty()
    @IsNumber()
    public pass_marks: number;

    constructor(body: any) {
        super();
        const {
            title,
            exam_date,
            duration_minutes,
            start_time,
            end_time,
            pass_marks
        } = body;
        this.title = title;
        this.exam_date = exam_date;
        this.duration_minutes = duration_minutes;
        this.start_time = start_time;
        this.end_time = end_time;
        this.pass_marks = pass_marks;
    }
}