import { Liveblocks } from "@liveblocks/node";
import { Response, Router } from "express";
import { auth } from "../middleware/auth";
import { AuthRequest } from "../types/types";
import TryCatch from "../utility/feature";

const router = Router();

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET as string,
});

router.post(
  "/liveblocks-auth",
  auth,
  TryCatch(async (req: AuthRequest, res: Response) => {
    const user = req.user;
    const { room } = req.body;

    if (!room) {
      return res.status(400).json({
        success: false,
        message: "Room is required",
      });
    }

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not authenticated"
        });
    }

    const session = liveblocks.prepareSession(
      user.id,
      {
       userInfo: {
                name: user?.name as string,
                email: user?.email as string,
                avatar: user?.photo?.imageUrl as string

            }
      }
    );

    session.allow(room, session.FULL_ACCESS);
    const { status, body } = await session.authorize();
    
    return res.status(status).end(body);
  })
);

export default router;