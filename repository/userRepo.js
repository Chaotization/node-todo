import {users} from "../database/mongoCollections.js";
import {ObjectId} from "mongodb";

const exportedMethods = {
    async insertUser(user) {
        const userCollection = await users();
        const insertInfo = await userCollection.insertOne(user);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw new Error("Could not add user");
        }

        return { userInserted: true, userId: insertInfo.insertedId.toString() };
    },

    async getUserById(userId) {
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error(`No user found with ID ${userId}`);
        }

        return user;
    },

    async getUserByUserName(username) {
        const userCollection = await users();
        const user = await userCollection.findOne({ username: username });
        return user;
    },

    async updateUser(userId, updatedData) {
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updatedData }
        );

        if (!updateInfo.acknowledged || updateInfo.matchedCount !== 1) {
            throw new Error(`Could not update user with ID ${userId}`);
        }

        return { userUpdated: true };
    },

    async deleteUser(userId) {
        const userCollection = await users();
        const deletionInfo = await userCollection.deleteOne({ _id: new ObjectId(userId) });

        if (!deletionInfo.acknowledged || deletionInfo.deletedCount === 0) {
            throw new Error(`Could not delete user with ID ${userId}`);
        }

        return { userDeleted: true };
    },
    
}

export default exportedMethods;