import mysql from "mysql2/promise";
import fs from "fs";

const MysqlConnection = mysql.createPool({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: 'cZkn3YjcnQ9VAbK.root',
    password: 'oH240WVcRSUWyBMR',
    database: 'activitytracker',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        // TiDB Cloud డాష్‌బోర్డ్ నుండి డౌన్‌లోడ్ చేసిన CA cert పాత్ ఇక్కడ ఇవ్వండి
        // ఉదాహరణకు మీ ప్రాజెక్ట్ ఫోల్డర్ లో 'isrgrootx1.pem' అని సేవ్ చేస్తే:
        ca: fs.readFileSync('./isrgrootx1.pem'),
        minVersion: 'TLSv1.2'
    }
});
d
export default MysqlConnection;