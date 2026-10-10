import mysql from "mysql2/promise";
import fs from "fs";

const MysqlConnection = mysql.createPool({
    host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '3Az29dE2v8updj5.root',
    password: '6iecctYo2FiHnmdm',
    database: 'activitytracker',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        // TiDB Cloud డాష్‌బోర్డ్ నుండి డౌన్‌లోడ్ చేసిన CA cert పాత్ ఇక్కడ ఇవ్వండి
        // ఉదాహరణకు మీ ప్రాజెక్ట్ ఫోల్డర్ లో 'isrgrootx1.pem' అని సేవ్ చేస్తే:
        ca: fs.readFileSync('./isrgrootx1.pem'),
        minVersion: 'TLSv1.2',
        rejectUnauthorized : true
    },
    
});

export default MysqlConnection;