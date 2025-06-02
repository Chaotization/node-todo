import {users, todos} from "../config/mongoCollections.js";
import {ObjectId} from "mongodb";
import bcrypt from "bcryptjs";
import validation from "../validation.js";

const exportedMethods = {
    async createUser(email, password) {
        email = validation.checkEmail(email);
        password = validation.checkPassword(password);

        const userCollection = await users();
        const existingUser = await userCollection.findOne({email: email});
        if (existingUser) {
            throw `User with email ${email} already exists`;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            email: email,
            password: hashedPassword,
            todos: []
        };

        const insertInfo = await userCollection.insertOne(newUser);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw `Could not add user with email ${email}`;
        }

        return {userInserted: true, userId: insertInfo.insertedId};
    },

    async getUserByEmail(email) {
        email = validation.checkEmail(email);
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (!user) {
            throw `No user found with email ${email}`;
        }
        return user;
    },

    async updateUser(userId, updatedData) { 
        if (!ObjectId.isValid(userId)) {
            throw `Invalid user ID: ${userId}`;
        }

        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            {_id: new ObjectId(userId)},
            {$set: updatedData}
        );

        if (!updateInfo.acknowledged || updateInfo.matchedCount !== 1) {
            throw `Error: could not update user with ID ${userId}`;
        }

        return {userUpdated: true};
    },

    async deleteUser(userId) {  
        if (!ObjectId.isValid(userId)) {
            throw `Invalid user ID: ${userId}`;
        }

        const userCollection = await users();
        const deletionInfo = await userCollection.deleteOne({_id: new ObjectId(userId)});

        if (!deletionInfo.acknowledged || deletionInfo.deletedCount === 0) {
            throw `Could not delete user with ID ${userId}`;
        }

        return {userDeleted: true};
    },
}

export default exportedMethods;