import mysql from "mysql2/promise";

const MysqlConnection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pixon',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export default MysqlConnection;