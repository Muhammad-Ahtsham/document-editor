import { Request, Response, Router } from "express";
import User from "../model/user";
import { sign } from "jsonwebtoken";
import TryCatch from "../utility/feature";
import { auth } from "../middleware/auth";
import { AuthRequest } from "../types/types";
import upload from "../middleware/uploadConfig";
import cloudinary from "../config/cloudinary";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({
      success: false,
      message: "All field are required",
    });
  }
  try {
    const isExist = await User.findOne({ email }).select("+password");
    if (isExist) {
      return res.status(400).json({
        success: false,
        message: "user is already exist",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
    });

    const userPayload = {
      id: user._id,
      email: user.email as string,
      photo: user?.photo,
      avatar: user.photo?.imageUrl,
    }
    const token = sign({ userPayload }, process.env.JWT_SECRET as string);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "All field is required",
    });
  }
  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });
    const userPayload = {
      id: user._id,
      name:user.name as string,
      email: user.email as string,
      photo: user?.photo,
      avatar: user.photo?.imageUrl,
    }
    const token = sign({ userPayload }, process.env.JWT_SECRET as string);
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.json({
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get(
  "/logout",
  TryCatch(async (req: Request, res: Response) => {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      path: '/',
    });
    res.status(200).json({ message: "Logout sucessfully" });
  })
);

router.get(
  "/me",
  auth,
  TryCatch(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    res.status(200).json({
      success: true,
      user,
    });
  })
);
router.patch(
  "/update",
  auth,
  TryCatch(async (req: AuthRequest, res: Response) => {
    const { name, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?.id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (email !== undefined && email !== user.email) {
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken",
        });
      }
      user.email = email;
    }

    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Both currentPassword and newPassword are required to change password",
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      user.password = newPassword;
    }
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  })
);

router.post(
  "/upload/photo",
  auth,
  upload.single("avatar"),
  TryCatch(async (req: AuthRequest, res: Response) => {
    const file = req.file
    if (!file) {
      return res.status(400).json({ message: "File is required" })
    }
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: 'images'
    });


    await User.findByIdAndUpdate(req.user?.id, {
      photo: {
        imageUrl: uploadResult.url,
        publicId: uploadResult.public_id
      }
    });
    res.status(200).json({
      success: true,
      message: "Photo is uploaded successfully"
    })
  })
)
router.delete("/delete/photo", auth, TryCatch(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }
  if (!user.photo || !user.photo.publicId || user.photo.publicId === "") {
    return res.status(400).json({
      success: false,
      message: "Profile picture does not exist"
    });
  }
  await cloudinary.uploader.destroy(user.photo.publicId);

  user.photo.imageUrl = "";
  user.photo.publicId = "";
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile picture deleted successfully"
  });
}));

export default router;
