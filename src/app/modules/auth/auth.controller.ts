import { AuthServices } from "./auth.services";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await AuthServices.loginUser(email, password);
    res.cookie('refreshToken', result.refreshToken, {
      secure: config.node_env === 'production',
      httpOnly: true,  
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: error.message,
      data: error,
    });
  }
};


const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: {
      accessToken: result.accessToken,
    },
  });
});
export const AuthController = {
  loginUser,
  refreshToken,
}