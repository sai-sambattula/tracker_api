import MysqlConnection from "./dbConnect.js";

export async function ExecuteQuery(query, params = []) {
    try {
        const [rows] = await MysqlConnection.query(query, params);
        return rows;
    } catch (error) {
        console.log(error);
        throw "Database error"
    }
}

export async function checkDatabseConnection() {
    try {
        const [rows] = await MysqlConnection.query('SELECT 1', []);
        console.log("Database Connected Succesfully.....")
        // return "Database Connected Succesfully.....";
    } catch (error) {
        console.log(error);
        // return err;
    }
}
