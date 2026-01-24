import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { AuthRequest, UserPayload } from "../types/types";

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const user = verify(token, process.env.JWT_SECRET as string,) as UserPayload;
    const { userPayload } = user;
    req.user = {
      id: userPayload.id,
      email: userPayload.email,
      name: userPayload.name,
      photo: userPayload.photo,
      avatar: userPayload.avatar as string,

    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
