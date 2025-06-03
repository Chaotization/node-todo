import todoService from '../services/todoService.js';

const todoController = {
    async createTodo(req, res) {
        let { title, description } = req.body || {};

        try {
            title = validation.checkString(title, "Title");
            description = validation.checkString(description, "Description");
            const userId = req.session.user.userId;

            const newTodo = await todoService.createTodo({ title, description, userId });
            return res.status(201).json({ message: 'Todo created successfully', todo: newTodo });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },  

    async getTodos(req, res) {
        const userId = req.session.user.userId;

        try {
            const todos = await todoService.getTodosByUserId(userId);
            return res.status(200).json(todos);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async getTodoById(req, res) {
        const todoId = req.params.id;

        try {
            const todo = await todoService.getTodoById(todoId);
            if (!todo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            return res.status(200).json(todo);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async updateTodo(req, res) {
        const todoId = req.params.id;
        const { title, description } = req.body || {};

        try {
            const updatedData = {};
            if (title) updatedData.title = validation.checkString(title, "Title");
            if (description) updatedData.description = validation.checkString(description, "Description");

            const updatedTodo = await todoService.updateTodo(todoId, updatedData);
            return res.status(200).json({ message: 'Todo updated successfully', todo: updatedTodo });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async deleteTodo(req, res) {
        const todoId = req.params.id;

        try {
            const deletedTodo = await todoService.deleteTodo(todoId);
            if (!deletedTodo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            return res.status(200).json({ message: 'Todo deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async markTodoAsCompleted(req, res) {
        const todoId = req.params.id;

        try {
            const updatedTodo = await todoService.markTodoAsCompleted(todoId);
            return res.status(200).json({ message: 'Todo marked as completed', todo: updatedTodo });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async markTodoAsIncomplete(req, res) {
        const todoId = req.params.id;

        try {
            const updatedTodo = await todoService.markTodoAsIncomplete(todoId);
            return res.status(200).json({ message: 'Todo marked as incomplete', todo: updatedTodo });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async getAllTodos(req, res) {
        try {
            const todos = await todoService.getAllTodos();
            return res.status(200).json(todos);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export default todoController;