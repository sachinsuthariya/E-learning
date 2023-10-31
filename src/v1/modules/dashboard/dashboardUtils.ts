import { Tables } from "../../../config/tables";
import * as My from "jm-ez-mysql";

export class DashboardUtils {

    // dashboard API's
    public async getTotalData() {
        try {
            // get total registerd user
            const userCount = `SELECT COUNT(*) as totalUser FROM ${Tables.USER}`;
            const totalUser = await My.query(userCount);

            // get total current-affairs
            const currentAffairsCount = ` SELECT COUNT(*) AS currentAffairs FROM ${Tables.CURRENT_AFFAIRS} WHERE status NOT IN (?, ?) `;
            const currentAffairCount = await My.query(currentAffairsCount, ["deleted", "draft"]);

            // get total books
            const booksCount = ` SELECT COUNT(*) AS books FROM ${Tables.BOOK} WHERE status NOT IN (?) `;
            const bookCount = await My.query(booksCount, ["deleted"]);

            // get total courses
            const coursesCount = ` SELECT COUNT(*) AS courses FROM ${Tables.COURSE} WHERE status NOT IN (?) `;
            const courseCount = await My.query(coursesCount, ["deleted"]);

            // get total exams
            const examCount = `SELECT COUNT(id) as totalExam FROM ${Tables.EXAM}`;
            const totalExam = await My.query(examCount);

            return {
                totalUsers: totalUser[0].totalUser,
                totalCurrentAffairs: currentAffairCount[0].currentAffairs,
                totalBooks: bookCount[0].books,
                totalCourses: courseCount[0].courses,
                totalExams: totalExam[0].totalExam
            };
        } catch (err) {
            return err;
        }
    }
}