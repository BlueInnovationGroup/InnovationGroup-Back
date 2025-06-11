const uploadConfig = require("../configs/upload");
const { Router } = require("express");
const multer = require("multer");

const enssureAuthenticated = require("../middlewares/enssureAuthenticated");
const VideoController = require("../controllers/VideoController");

const videoController = new VideoController();

const upload = multer(uploadConfig.MULTER);
const videoRoutes = Router();

videoRoutes.post("/:id", enssureAuthenticated, upload.single("video"), videoController.createVideo);
videoRoutes.delete("/:id", enssureAuthenticated, videoController.deleteVideo);
videoRoutes.get("/:id", videoController.showVideo);

module.exports = videoRoutes;

