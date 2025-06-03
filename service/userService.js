import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import userRepo from "../repository/userRepo.js";
import validation from "../utils/validation.js";

const userService = {
    async createUser(user) {
        const { username, password, role } = user || {};
        const _user = await userRepo.getUserByUserName(username);

        if (_user) {
            throw new Error(`User with username ${username} already exists`);
        }

        const newUser = {
            _id: new ObjectId(),
            username: username,
            password: await bcrypt.hash(password, 10),
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