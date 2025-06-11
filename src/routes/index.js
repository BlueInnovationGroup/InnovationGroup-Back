const { Router } = require("express");

const sessionsRoutes = require("./sessions.routes");
const passwordRoutes = require("./forgot.routes");
const contageRoutes = require("./contage.routes");
const courseRoutes = require("./course.routes");
const videoRoutes = require("./video.routes");
const usersRoutes = require("./users.routes");

const routes = Router();

routes.use("/sessions", sessionsRoutes);
routes.use("/password", passwordRoutes);
routes.use("/contage", contageRoutes);
routes.use("/course", courseRoutes);
routes.use("/video", videoRoutes);
routes.use("/users", usersRoutes);

module.exports = routes

