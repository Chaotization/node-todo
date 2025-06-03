import { Router } from "express";
import { userData } from "../data/users.js";
import bcrypt from "bcrypt";

const router = Router();

router.route("/").get(async (req, res) => {
  if (req.session.user) {
    return res.status(200).redirect("/homepage");
  } else {
    return res.status(200).render("/login", { title: "Login" });
  }
});

router
  .route("/login")
  .get(async (req, res) => {
    try {
      return res.render("login", { title: "Login" });
    } catch (error) {
      return res.status(500).render("error", { error: error });
    }
  })
  .post(async (req, res) => {
    let { email, password } = req.body;

    try {
      email = Validation.checkEmail(email);
      password = Validation.checkPassword(password);
      const user = await userData.getUserByEmail(email);
      const isMatch = await bcrypt.compare(password, user.hashedPassword);

      if (!isMatch) {
        return res.status(401).render("login", {
          title: "Login",
          error: "Invalid email or password.",
        });
      }

      req.session.user = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      };

      return res.status(200).redirect("/homepage");
    } catch (error) {
      return res.status(401).json({
        success: false,
        email: req.body.email,
        password: req.body.password,
        error: error.message,
      });
    }
  });

router
  .route("/register")
  .get(async (req, res) => {
    try {
      return res.render("register", { title: "Register" });
    } catch (error) {
      return res.status(500).render("error", { error: error });
    }
  })
  .post(async (req, res) => {
    let { email, password } = req.body;

    try {
      email = Validation.checkEmail(email);
      password = Validation.checkPassword(password);

      const existingUser = await userData.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).render("register", {
          title: "Register",
          error: "User with this email already exists.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await userData.createUser({
        email,
        hashedPassword,
      });

      req.session.user = {
        id: newUser._id,
        email: newUser.email,
      };

      return res.status(201).redirect("/homepage");
    } catch (error) {
      return res.status(500).render("error", { error: error });
    }
  });

router.route("/logout").get(async (req, res) => {
  if (req.session.user) {
    req.session.destroy();
    return res.status(200).redirect("/");
  } else {
    return res.status(400).render("error", { error: "No user is logged in." });
  }
});
