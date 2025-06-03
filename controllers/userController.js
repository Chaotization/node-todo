import validation from '../utils/validation.js';
import userService from '../services/userService.js';

const userController = {
    async createUser(req, res) {
        let { username, password } = req.body || {};

        try {
            username = validation.checkUsername(username);
            password = validation.checkPassword(password);
            const user = await userService.createUser({username, password});
            return res.status(201).json({ message: 'Registration successful', user: user });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async getUserById(req, res) {
        let userId = req.params.id;

        try {
            userId = validation.checkId(userId);
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async updateUser(req, res) {
        let userId = req.params.id;
        let { username, password } = req.body || {};

        try {
            userId = validation.checkId(userId);
            if (username) username = validation.checkUsername(username);
            if (password) password = validation.checkPassword(password);

            const updatedUser = await userService.updateUser(userId, {username, password});
            return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async deleteUser(req, res) {
        let userId = req.params.id;

        try {
            userId = validation.checkId(userId);
            const deletedUser = await userService.deleteUser(userId);
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
}

export default userController;