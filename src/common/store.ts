import * as fs from "fs";

import {User} from "../users/model";

import config from "./config";

interface Data {
    users: User[]
}

function createStoreIfNeeded() {
    if (!fs.existsSync(config.DATA_STORE_PATH)) {
        fs.appendFileSync(config.DATA_STORE_PATH, JSON.stringify({
            users: [],
        }))
    }
}

export function getData(): Data {
    let result: Data = {
        users: []
    };
    try {
        createStoreIfNeeded();
        const rawdata = fs.readFileSync(config.DATA_STORE_PATH).toString();
        result = JSON.parse(rawdata) as Data;
    } catch(e) {
        console.error("Cannot parse data", e)
    }
    return result;
}

export function setData(data: Data) {
    createStoreIfNeeded();
    fs.writeFileSync(config.DATA_STORE_PATH, JSON.stringify(data));
}