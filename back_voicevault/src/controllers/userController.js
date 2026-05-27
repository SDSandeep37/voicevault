import {
  emailValidator,
  nameValidator,
  passwordValidator,
} from "../utils/validator.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  sanitizeEmail,
  sanitizeHTML,
  sanitizeText,
} from "../utils/sanitize.js";
import User from "../models/userModel.js";
import jsonwebtoken from "jsonwebtoken";
import { createTokenCookie, destroyTokenCookie } from "../utils/cookies.js";

export const register = async (request, response) => {
  // return if no user data
  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "User data required",
    });
  }

  // sanitize input first
  const data = request.body;
  const name = data.name ? sanitizeText(data.name) : "";
  const email = data.email ? sanitizeEmail(data.email) : "";
  const password = String(data.password || "").trim();

  // validate sanitized values
  const validateName = nameValidator(name);
  const validateEmail = emailValidator(email);
  const validatePassword = passwordValidator(password);
  if (!validateName) {
    return response.status(400).json({
      success: false,
      message: "Valid name is required",
    });
  }
  if (!validateEmail) {
    return response.status(400).json({
      success: false,
      message: "Valid email is required",
    });
  }
  if (!validatePassword) {
    return response.status(400).json({
      success: false,
      message:
        "Password must contain combination of uppercase,lowercase,number,symbol and minimum 6 letters",
    });
  }

  const hashedPassword = await hashPassword(password);
  try {
    const isUserExist = await User.findOne({ email: email });

    if (isUserExist) {
      return response.status(400).json({
        success: false,
        message: "We have already a user with this email",
      });
    }
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    if (!user) {
      return response.status(400).json({
        success: false,
        message: "User creation failed",
      });
    }
    // generating json web token
    const token = jsonwebtoken.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "1h" },
    );

    //Storing cookie named token
    const maxAge = process.env.JWT_EXPIRE
      ? parseInt(process.env.JWT_EXPIRE) * 1000 * 60 * 60
      : 3600000;

    createTokenCookie(response, token, maxAge);

    response.status(201).json({
      success: true,
      message: "User registration successful",
    });
  } catch (error) {
    console.error("Error creating user", error);
    response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const login = async (request, response) => {
  // return if no user data
  if (!request.body) {
    return response.status(400).json({
      success: false,
      message: "Login details required",
    });
  }
  const data = request.body;
  const email = data.email ? sanitizeEmail(data.email) : "";
  const password = String(data.password || "").trim();
  if (!email) {
    return response.status(400).json({
      success: false,
      message: "Please enter your email",
    });
  }
  if (!password || password.trim() === "") {
    return response.status(400).json({
      success: false,
      message: "Please enter your password",
    });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    // generating json web token
    const token = jsonwebtoken.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "1h" },
    );

    //Storing cookie named token
    const maxAge = process.env.JWT_EXPIRE
      ? parseInt(process.env.JWT_EXPIRE) * 1000 * 60 * 60
      : 3600000;

    createTokenCookie(response, token, maxAge);
    return response.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error occured while login process", error);
    response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const logout = async (request, response) => {
  destroyTokenCookie(response);
  response.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export const userSession = async (request, response) => {
  const { id } = request.user;
  if (!id) {
    return response.status(401).json({
      success: false,
      message: "Session not available",
    });
  }
  try {
    const user = await User.findById(id);
    if (user) {
      return response.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    }
  } catch (error) {
    console.error("Error occured while getting user session", error);
    response.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
