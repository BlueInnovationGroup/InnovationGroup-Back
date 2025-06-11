const uploadConfig = require("../configs/upload");
const { Router } = require("express");
const multer = require("multer");

const enssureAuthenticated = require("../middlewares/enssureAuthenticated");
const AvatarController = require("../controllers/AvatarController");
const UsersController = require("../controllers/UsersController");

const avatarController =  new AvatarController();
const usersController = new UsersController();

const upload = multer(uploadConfig.MULTER);
const usersRoutes = Router();

usersRoutes.patch("/avatar", enssureAuthenticated, upload.single("avatar"), avatarController.update);
usersRoutes.put('/admin', enssureAuthenticated, usersController.updateAdmin);
usersRoutes.put("/", enssureAuthenticated, usersController.update);
usersRoutes.get("/", enssureAuthenticated, usersController.show);
usersRoutes.put('/password', usersController.setPassword);
usersRoutes.post("/", usersController.create);

module.exports = usersRoutes;

