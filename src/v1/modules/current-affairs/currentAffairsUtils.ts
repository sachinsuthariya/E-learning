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
    public getById = async (currentAffairsId: string) => {
            const currentAffair = await My.first(
                Tables.CURRENT_AFFAIRS, 
                ["id", "title", "content", "status", "created_at", "updated_at"],
                "id=? AND status=?",
                [currentAffairsId, "published"]
            );
    
            return currentAffair;
        
    };

    /**
     * Get Current Affair by ID for update method
     * @param currentAffairsDetails 
     * @returns 
     */
    public getByIdForUpdate = async (currentAffairsId: string) => {
        const currentAffair = await My.first(
            Tables.CURRENT_AFFAIRS, 
            ["id", "title", "content", "status", "created_at", "updated_at"],
            "id=? AND status!=?",
            [currentAffairsId, "deleted"]
        );

        return currentAffair;
    
};

    /**
     * Get All Current Affairs
     * @param currentAffairsDetails 
     * @returns 
     */
    public getAllCurrentAffairs = async () => {
            const getAllCurrentAffairs = await My.findAll(
                Tables.CURRENT_AFFAIRS, 
                ["id", "title", "content", "status", "created_at", "updated_at"],
                "status=?",
                ["published"]
            );
    
            return getAllCurrentAffairs;
    };

    /**
     * Current Affair Status changed to Deleted by ID
     * @param currentAffairsDetails 
     * @returns 
     */
    public destroy = async (currentAffairsId: string) => {  // Set the status to "deleted"
        const currentAffair = await My.update(
            Tables.CURRENT_AFFAIRS,
            { status: "deleted" },
            "id=?",
            [currentAffairsId]
        );

        return currentAffair;
    
    };

    /**
     * Current Affair Update Fields by ID
     * @param currentAffairsDetails 
     * @returns 
     */
    public updateById = async (currentAffairsId: string,updatedData:Json) => {  // Set the status to "deleted"
        const currentAffair = await My.update(
            Tables.CURRENT_AFFAIRS,
            updatedData,
            "id=?",
            [currentAffairsId]
        );

        return currentAffair;
    
    };

}