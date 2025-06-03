import { Router } from "express";
import  todoController  from "../controllers/todoController.js";

const router = Router();

router
    .route("/")
    .get(todoController.getAllTodos)
    .post(todoController.createTodo);

router
    .route("/:id")
    .get(todoController.getTodoById)
    .put(todoController.updateTodo)
    .delete(todoController.deleteTodo);

export default router;
