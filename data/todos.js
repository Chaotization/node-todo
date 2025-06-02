import {users, todos} from "../config/mongoCollections.js";
import {ObjectId} from "mongodb";
import validation from "../validation.js";


const exportedMethods = {
    async createTodos (userId, title, description) {
        userId = validation.checkId(userId);
        title = validation.checkString(title, "Title");
        description = validation.checkString(description, "Description");
        const userCollection = await users();

        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        if (!user) {
            throw `No user found with ID ${userId}`;
        }
        const todoCollection = await todos();
        const newTodo = {
            _id: new ObjectId(),
            userId: new ObjectId(userId),
            title: title,
            description: description,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const insertInfo = await todoCollection.insertOne(newTodo);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw `Could not add todo for user with ID ${userId}`;
        }

        return {todoInserted: true, todoId: insertInfo.insertedId};
    },

    async getTodosByUserId(userId) {
        userId = validation.checkId(userId);
        const todoCollection = await todos();
        const todosList = await todoCollection.find({userId: new ObjectId(userId)}).toArray();
        if (!todosList || todosList.length === 0) {
            throw `No todos found for user with ID ${userId}`;
        }
        return todosList;
    },

    async getTodoById(todoId) {
        todoId = validation.checkId(todoId);
        const todoCollection = await todos();
        const todo = await todoCollection.findOne({_id: new ObjectId(todoId)});
        if (!todo) {
            throw `No todo found with ID ${todoId}`;
        }
        return todo;
    },

    async updateTodo(todoId, updatedData) {
        todoId = validation.checkId(todoId);
        const todoCollection = await todos();
        const updateInfo = await todoCollection.updateOne(
            {_id: new ObjectId(todoId)},
            {$set: updatedData}
        );
        if (!updateInfo.acknowledged || updateInfo.matchedCount !== 1) {
            throw `Error: could not update todo with ID ${todoId}`;
        }
        return {todoUpdated: true};
    },

    async deleteTodo(todoId) {
        todoId = validation.checkId(todoId);
        const todoCollection = await todos();
        const deletionInfo = await todoCollection.deleteOne({_id: new ObjectId(todoId)});
        if (!deletionInfo.acknowledged || deletionInfo.deletedCount === 0) {
            throw `Could not delete todo with ID ${todoId}`;
        }
        return {todoDeleted: true};
    },

    async markTodoAsCompleted(todoId) {
        todoId = validation.checkId(todoId);
        const todoCollection = await todos();
        const updateInfo = await todoCollection.updateOne(
            {_id: new ObjectId(todoId)},
            {$set: {completed: true, updatedAt: new Date()}}
        );
        if (!updateInfo.acknowledged || updateInfo.matchedCount !== 1) {
            throw `Error: could not mark todo with ID ${todoId} as completed`;
        }
        return {todoMarkedAsCompleted: true};
    },

    async markTodoAsIncomplete(todoId) {
        todoId = validation.checkId(todoId);
        const todoCollection = await todos();
        const updateInfo = await todoCollection.updateOne(
            {_id: new ObjectId(todoId)},
            {$set: {completed: false, updatedAt: new Date()}}
        );
        if (!updateInfo.acknowledged || updateInfo.matchedCount !== 1) {
            throw `Error: could not mark todo with ID ${todoId} as incomplete`;
        }
        return {todoMarkedAsIncomplete: true};
    },

    async getAllTodos() {
        const todoCollection = await todos();
        const allTodos = await todoCollection.find({}).toArray();
        if (!allTodos || allTodos.length === 0) {
            throw "No todos found";
        }
        return allTodos;
    }
}

export default exportedMethods;