import {Request, Response, NextFunction} from 'express';
import * as jwt from "jsonwebtoken";
import {VerifyErrors} from "jsonwebtoken";

import config from "../common/config";

type UserInToken = {
    id: string
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({
            error: "Not authorized",
        });
    }

    jwt.verify(token, config.JWT_SECRET, (err: VerifyErrors | null, user: UserInToken) => {
        if (err) {
            console.error(err);
            return res.sendStatus(403).json({
                error: "JWT token not valid",
            })
        }

        req.userId = user.id;
        next()
    });
}