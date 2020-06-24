import { v4 as uuid } from "uuid";

import {User, UserSettings} from "./model";
import * as store from "../common/store";

export class UserRepository {
    create(user: User): User | null {
        const data = store.getData();
        const userInStore = data.users.find((item) => item.email === user.email);

        if (userInStore) {
            return null;
        }

        data.users.push({
            id: uuid(),
            ...user
        });
        store.setData(data);
    }

    findOne(id: string): User | null {
        const data = store.getData();
        return data.users.find((user) => user.id === id);
    }

    findByEmail(email: string): User | null {
        const data = store.getData();
        return data.users.find((user) => user.email === email);
    }

    changeSettings(userId: string, settings: UserSettings): UserSettings {
        const data = store.getData();
        const userInStore = data.users.find((user) => user.id === userId);
        if (!userInStore) {
            return;
        }

        userInStore.settings = settings;
        store.setData(data);
        return settings;
    }
}