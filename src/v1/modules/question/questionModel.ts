import { IsNotEmpty, IsString, IsNumber, IsDate, IsEnum, IsOptional } from "class-validator";

import { Model } from "../../../model";
import { QuestionType } from "../../../config/enums";

export class QuestionModel extends Model {

    @IsNotEmpty()
    @IsString()
    public question: string;

    @IsNotEmpty()
    @IsString()
    public examId: string;

    @IsNotEmpty()
    @IsNumber()
    public points: number;

    @IsOptional()
    @IsNumber()
    public nagativePoints: number;

    constructor(body: any) {
        super();
        const {
            question,
            examId,
            points,
            nagativePoints,
        } = body;
        this.question = question;
        this.examId = examId
        this.points = points;
        this.nagativePoints = nagativePoints;
    }
}