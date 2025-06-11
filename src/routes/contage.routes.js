const uploadConfig = require("../configs/upload");
const { Router } = require("express");
const multer = require("multer");

const enssureAuthenticated = require("../middlewares/enssureAuthenticated");
const ContageController = require("../controllers/ContageController");

const contageController = new ContageController();

const contageRoutes = Router();

contageRoutes.put("/", enssureAuthenticated, contageController.updateCourse);
contageRoutes.post("/", enssureAuthenticated, contageController.addCourse);
contageRoutes.get("/", enssureAuthenticated, contageController.showCourses);

contageRoutes.post("/video", enssureAuthenticated, contageController.addVideo);
contageRoutes.get("/video/:id", enssureAuthenticated, contageController.showVideos);

module.exports = contageRoutes;

