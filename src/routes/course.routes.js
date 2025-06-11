const uploadConfig = require("../configs/upload");
const { Router } = require("express");
const multer = require("multer");

const enssureAuthenticated = require("../middlewares/enssureAuthenticated");
const CourseController = require("../controllers/CourseController");

const courseController = new CourseController();

const upload = multer(uploadConfig.MULTER);
const courseRoutes = Router();

courseRoutes.delete("/:id", enssureAuthenticated, courseController.deleteCourse);
courseRoutes.post("/", enssureAuthenticated, courseController.createCourse);
courseRoutes.get("/search", courseController.index);
courseRoutes.get("/show/:id", courseController.showCourse);

module.exports = courseRoutes;

