import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { AuthRequest, UserPayload } from "../types/types";

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const tokenUser = verify(token, process.env.JWT_SECRET as string,) as UserPayload;
    const { _id, email, name, photo } = tokenUser.user;
    req.user = {
      id: _id,
      photo: photo,
      email,
      name,
    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
