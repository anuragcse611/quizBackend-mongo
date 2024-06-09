import { Router } from "express";
import {
  editUserProfile,
  loginUser,
  registerUser,
  viewUserProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "profilePic",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/viewProfile/:userId").get(viewUserProfile);

router
  .route("/editProfile/:userId")
  .put(upload.single("profilePic"), editUserProfile);

export default router;
