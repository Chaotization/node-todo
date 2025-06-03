import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";

const exportedMethods = {
    checkId(id) {
        if (!id) {
            throw `No id is provided`;
        }
        if (typeof id !== "string" || id.trim().length === 0) {
            throw `The id provided is not a string or an  empty string`;
        }
        id = id.trim()
        if (!ObjectId.isValid(id)) {
            throw `Invalid Object ID`;
        }
        return id;
    },

    checkUsername(username) {
        if (!username) throw new Error("Please provide a username.");

        if (typeof username !== "string" || username.trim().length === 0) {
            throw new Error("Please provide a valid username.");
        }

        username = username.trim().toLowerCase();

        const usernameRegex = /^[a-z0-9!#$%&'*+\-/=?^_`{|}~.]+$/i;
        if (!usernameRegex.test(username)) {
            throw new Error("Username can only contain letters, numbers, and common special symbols !#$%&'*+\\-/=?^_`{|}~.");
        }

        return username;
    },

    checkPassword(password) {
        if (!password) throw "Password not provided";
        if (typeof password !== "string") throw "Password must be a string!";
        password = password.trim();
        if (password.length < 8 || password.length > 25) throw "Password must be at least 8 characters and less than 25 characters";
        const spaceRegex = /\s/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z\d\W]{8,25}$/;
        if (spaceRegex.test(password)) throw "Password must not contain whitespace";
        if (!passwordRegex.test(password)) throw "Password must contain at least 1 uppercase character, 1 lowercase character, 1 number, and 1 special character";
        return password;
    },

    checkString(input, valueName) {
        if (!input) throw `${valueName} not provided`;
        if (typeof input !== "string") throw `${valueName} must be a string!`;
        input = input.trim();
        if (input.length < 1 || input.length > 50) throw `${valueName} must be at least 1 character and less than 50 characters`;
        return input;
    },

    comparePassword(password, hashedPassword) {
        if (!password || !hashedPassword) throw "Password or hashed password not provided";
        if (typeof password !== "string" || typeof hashedPassword !== "string") throw "Both password and hashed password must be strings!";
        return bcrypt.compare(password, hashedPassword);
    }
}

export default exportedMethods;