import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import {userRepository} from "../common/repositories";

import config from "../common/config";
import {UserSettings} from "./model";

export type ApiResponse<T> = {
    error?: string,
    data?: T,
};

type LoginResponseData = {
    accessToken: string,
};

type CurrentUserResponseData = {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    settings: UserSettings,
    data: string,
};

export const login = function(req: Request, res: Response<ApiResponse<LoginResponseData>>) {
    const {email, password} = req.body;

    const user = userRepository.findByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        res.status(401).json({
            error: "Auth failed",
        });
        return;
    }

    res.status(200).json({
        data: {
            accessToken: jwt.sign({id: user.id}, config.JWT_SECRET, {})
        }
    });
};

export const register = function(req: Request, res: Response<ApiResponse<boolean>>) {
    const user = userRepository.create({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 8),
        settings: {
            isAwesome: false
        },
        data: "This is random data that were created within user: " + Math.random().toString(16),
    });
    if (user === null) {
        res.status(403).json({
            error: "User already exists",
        });
        return;
    }
    res.status(200).json({
        data: true,
    });
};

export const me = function(req: Request, res: Response<ApiResponse<CurrentUserResponseData>>) {
    let user = userRepository.findOne(req.userId);
    if (user === null) {
        res.status(401).json({
            error: "Not authorized",
        });
        return;
    }
    res.status(200).json({
        data: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            settings: user.settings || {isAwesome: false},
            data: user.data,
        },
    });
};

export const changeSettings = function(req: Request, res: Response<ApiResponse<UserSettings>>) {
    let user = userRepository.findOne(req.userId);
    if (user === null) {
        res.status(401).json({
            error: "Not authorized",
        });
        return;
    }

    const settings = userRepository.changeSettings(req.userId, req.body);
    res.status(200).json({
        data: settings || user.settings,
    });
};