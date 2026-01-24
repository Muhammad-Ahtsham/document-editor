import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
  id: string;
  photo?: {
    imageUrl: string;
    publicId: string
  }
  avatar?:string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export interface tryCatchResponse extends Response {
  headers: any;
  ok: boolean;
  redirected: boolean;
  statusText: string;
}
