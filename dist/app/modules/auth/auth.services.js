"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("../user/user.model");
const loginUser = async (email, password) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    const isMatch = await bcrypt_1.default.compare(password, user?.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const accessToken = jsonwebtoken_1.default.sign({
        id: user?._id,
        email: user?.email,
        role: user?.role,
    }, config_1.default.jwt_secret, { expiresIn: "3d" });
    // refresh token
    const refreshToken = jsonwebtoken_1.default.sign({
        id: user?._id,
        email: user?.email,
        role: user?.role,
    }, config_1.default.jwt_refresh_secret, { expiresIn: "30d" });
    return {
        accessToken,
        refreshToken,
    };
};
exports.loginUser = loginUser;
const refreshToken = async (refreshToken) => {
    const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt_refresh_secret);
    if (typeof decoded === 'string' || !decoded) {
        throw new Error("Invalid refresh token");
    }
    const user = await user_model_1.User.findOne({ email: decoded?.email });
    if (!user) {
        throw new Error("User not found");
    }
    if (!user) {
        throw new Error("User not found0000");
    }
    const accessToken = jsonwebtoken_1.default.sign({
        id: user?._id,
        email: user?.email,
        role: user?.role,
    }, config_1.default.jwt_secret, { expiresIn: "30s" });
    return {
        accessToken,
    };
};
exports.AuthServices = {
    loginUser: exports.loginUser,
    refreshToken,
};
