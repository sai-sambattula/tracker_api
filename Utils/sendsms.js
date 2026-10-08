import axios from "axios";
import { env } from '../Config/config.js';


export const sendSMS = async (phonenumber, otp) => {
    try {
        const data = {
            template_id: "699d70dc58fbf9d05c09a472",
            recipients: [
                {
                    mobiles: `91+${phonenumber}`,
                    var1: "PIXON",
                    var2: otp
                }
            ]
        };

        if (env.NODE_ENV != 'development') {
            const response = await axios.post(
                "https://control.msg91.com/api/v5/flow",
                data,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    params: {
                        authkey: "489839A5oJb55T699d4367P1",
                        accept: "application/json"
                    }
                }
            );
            return response.data;
        }
        else {
            return "Message Not send in Development"
        }

    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error; // important if caller needs to handle it
    }
};