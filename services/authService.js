import userRepo from "../repository/userRepo.js";

const authService = {
    async login(username, password) {
        const user = await userRepo.getUserByUserName(username);

        if (!user) {
            throw new Error("Invalid email or password.");
        }
        
        const isMatch = await userRepo.comparePassword(password, user.hashedPassword);
        if (!isMatch) {
            throw new Error("Invalid email or password.");
        }

        return {
            id: user._id.toString(),
            email: user.email,
        };
    }
};

export default authService;