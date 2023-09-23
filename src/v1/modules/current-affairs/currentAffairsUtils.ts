import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { SqlUtils } from "../../../helpers/sqlUtils";

export class CurrentAffairsUtils {
    public sqlUtils: SqlUtils = new SqlUtils();

    // Create Current Affairs
    public create = (currentAffairsDetails: Json) => My.insert(Tables.CURRENT_AFFAIRS, currentAffairsDetails);

    /**
     * Get Current Affair by ID
     * @param currentAffairsDetails 
     * @returns 
     */
    public getById = (currentAffairsId: string) => My.first(
        Tables.CURRENT_AFFAIRS, 
        ["id", "title", "content", "status", "created_at", "updated_at"],
        "id=?",
        [currentAffairsId]
    );


}