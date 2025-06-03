import {users, todos} from "../database/mongoCollections.js";
import {ObjectId} from "mongodb";

const exportedMethods = {
    async getAllTodos() {
        const todoCollection = await todos();
        const allTodos = await todoCollection.find({}).toArray();
        if (!allTodos || allTodos.length === 0) {
            throw new Error("No todos found");
        }
        return allTodos;
    },

    async getTodoById(todoId) {
        todoId = ObjectId.isValid(todoId) ? new ObjectId(todoId) : null;
        if (!todoId) throw new Error("Invalid todo ID");

        const todoCollection = await todos();
        const todo = await todoCollection.findOne({ _id: todoId });
        if (!todo) {
            throw new Error(`No todo found with ID ${todoId}`);
        }
        return todo;
    },

    async createTodo(todo) {
        const todoCollection = await todos();
        const insertInfo = await todoCollection.insertOne(todo);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw new Error("Could not add todo");
        }

        return { todoInserted: true, todoId: insertInfo.insertedId.toString() };
    },

    async getTodosByUserId(userId) {
        const todoCollection = await todos();
        const todosList = await todoCollection.find({userId: new ObjectId(userId)}).toArray();
        if (!todosList || todosList.length === 0) {
            throw `No todos found for user with ID ${userId}`;
        }
        return todosList;
    },

    async updateTodo(todoId, updatedData) {
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
        const todoCollection = await todos();
        const deletionInfo = await todoCollection.deleteOne({_id: new ObjectId(todoId)});
        if (!deletionInfo.acknowledged || deletionInfo.deletedCount === 0) {
            throw `Could not delete todo with ID ${todoId}`;
        }
        return {todoDeleted: true};
    },

    async markTodoAsCompleted(todoId) {
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
};

export default exportedMethods;