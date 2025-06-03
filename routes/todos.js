import { Router } from "express";
import { todosData } from "../data/todos.js";

const router = Router();

router.route("/").get(async (req, res) => {
  try {
    const todos = await todosData.getTodosByUserId(req.session.user.id);
    return res.render("todos", { title: "Todos", todos: todos });
  } catch (error) {
    return res.status(500).render("error", { error: error });
  }
})
.post(async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTodo = await todosData.createTodos(req.session.user.id, title, description);
        return res.status(201).redirect("/todos");
    } catch (error) {
        return res.status(500).render("error", { error: error });
    }
});


router.route("/:id").get(async (req, res) => {
    try {
        const todoId = req.params.id;
        const todo = await todosData.getTodoById(todoId);
        return res.render("todoDetail", { title: "Todo Detail", todo: todo });
    } catch (error) {
        return res.status(404).render("error", { error: error });
    }
})
.put(async (req, res) => {
    try {
        const todoId = req.params.id;
        const updatedData = req.body;
        await todosData.updateTodo(todoId, updatedData);
        return res.status(200).redirect(`/todos/${todoId}`);
    } catch (error) {
        return res.status(500).render("error", { error: error });
    }
})
.delete(async (req, res) => {
    try {
        const todoId = req.params.id;
        await todosData.deleteTodo(todoId);
        return res.status(200).redirect("/todos");
    } catch (error) {
        return res.status(500).render("error", { error: error });
    }
});


export default router;
