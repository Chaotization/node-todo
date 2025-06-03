import { ObjectId } from "mongodb";
import todoRepo from "../repository/todoRepo.js";

const todoService = {
    async createTodo(userId, title, description) {
        const newTodo = {
            _id: new ObjectId(),
            userId: new ObjectId(userId),
            title: title,
            description: description,
            completed: false,
            createdAt: new Date(),
        };
        return await todoRepo.createTodo(newTodo);
    },

    async getAllTodos() {
        return await todoRepo.getAllTodos();
    },

    async getTodoById(todoId) {
        return await todoRepo.getTodoById(todoId);
    },

    async getTodosByUserId(userId) {
        return await todoRepo.getTodosByUserId(new ObjectId(userId));
    },

    async updateTodo(todoId, updatedData) {
        return await todoRepo.updateTodo(todoId, updatedData);
    },

    async deleteTodo(todoId) {
        return await todoRepo.deleteTodo(todoId);
    },

    async markTodoAsCompleted(todoId) {
        return await todoRepo.markTodoAsCompleted(todoId);
    },

    async markTodoAsIncomplete(todoId) {
        return await todoRepo.markTodoAsIncomplete(todoId);
    },
};

export default todoService;