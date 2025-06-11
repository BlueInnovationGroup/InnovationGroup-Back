const { Router } = require("express");

const SessionsController = require("../controllers/SessionsController");
const sessionsController = new SessionsController();

const sessionsRoutes = Router();

sessionsRoutes.post("/refresh-token", sessionsController.refreshToken);
sessionsRoutes.post("/", sessionsController.create);

module.exports = sessionsRoutes;