import jsonwebtoken from 'jsonwebtoken';
import { env } from '../Config/config.js';

// console.log(env);

export function generateAccesToken(data) {
    const accessToken = jsonwebtoken.sign(data, env.accessTokenSecret, {
        expiresIn: '15m'
    })

    return accessToken;
}


export function generateRefreshToken(data) {
    const accessToken = jsonwebtoken.sign(data, env.refreshTokenSecret, {
        expiresIn: '7d'
    })
    return accessToken;
}

export function verifyAccesToken(token) {

    try {
        const decoded = jsonwebtoken.verify(token, env.accessTokenSecret);
        return decoded;
    }
    catch (error) {
        throw new Error('Invalid refresh token');
    }

}


export function verifyRefreshToken(token) {
    try {
        // Verify the token
        const decoded = jsonwebtoken.verify(token, env.refreshTokenSecret);
        return decoded;
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
}