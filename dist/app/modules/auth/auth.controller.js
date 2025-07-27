"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_services_1 = require("./auth.services");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await auth_services_1.AuthServices.loginUser(email, password);
        res.cookie('refreshToken', result.refreshToken, {
            secure: config_1.default.node_env === 'production',
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365,
        });
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "User logged in successfully",
            data: {
                accessToken: result.accessToken,
            },
        });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: error.message,
            data: error,
        });
    }
};
const refreshToken = (0, catchAsync_1.default)(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await auth_services_1.AuthServices.refreshToken(refreshToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Access token is retrieved successfully!',
        data: {
            accessToken: result.accessToken,
        },
    });
});
exports.AuthController = {
    loginUser,
    refreshToken,
};
