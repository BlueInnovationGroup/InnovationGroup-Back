const { Router } = require("express");

const ForgotPasswordController = require("../controllers/ResetPasswordController");

const forgotPasswordController = new ForgotPasswordController();

const passwordRoutes = Router();

passwordRoutes.post("/forgot", forgotPasswordController.sendCode);
passwordRoutes.post("/reset", forgotPasswordController.reset);

module.exports = passwordRoutes;
