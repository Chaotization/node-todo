import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import userRepo from "../repository/userRepo.js";

const userService = {
    async createUser(user) {
        const { username, password, role = "users"} = user || {};
        const _user = await userRepo.getUserByUserName(username);

        if (_user) {
            throw new Error(`User with username ${username} already exists`);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            _id: new ObjectId(),
            username: username,
            password: hashedPassword,
            role: role || "user"
        };
        const result = await userRepo.insertUser(newUser);
        const { password: _, ...userInfo } = result;

        return userInfo;
    },

    async getUserById(userId) {
        return await userRepo.getUserById(userId);
    },

    async getUserByUserName(username) {
        return await userRepo.getUserByUserName(username);
    },

    async updateUser(userId, updatedData) {
        return await userRepo.updateUser(userId, updatedData);
    },

    async deleteUser(userId) {
        return await userRepo.deleteUser(userId);
    }
}

export default userService;