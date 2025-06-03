import authService from '../services/authService.js';

const authController = {
    async login(req, res) {
        const { username, password } = req.body || {};

        try {
            const user = await authService.login(username, password);
            req.session.user = user;
            return res.status(200).json({message: 'Login successful', user: user});
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    async logout(req, res) {
        try {
            req.session.destroy();
            return res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
};

export default authController;