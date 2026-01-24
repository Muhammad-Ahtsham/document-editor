import { Liveblocks } from "@liveblocks/node";
import { Response, Router } from "express";
import { auth } from "../middleware/auth";
import { AuthRequest } from "../types/types";
import TryCatch from "../utility/feature";
import User from "../model/user";

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

    function getRandomHexColor(): string {
      return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    }

    const randomColor = getRandomHexColor();

    if (!room) {
      return res.status(400).json({
        success: false,
        message: "Room is required",
      });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    const session = liveblocks.prepareSession(user.id, {
      userInfo: {
        name: user?.name as string,
        email: user?.email as string,
        avatar: user?.avatar,
        color: randomColor
      },
    });

    session.allow(room, session.FULL_ACCESS);
    const { status, body } = await session.authorize();

    return res.status(status).end(body);
  }),
);
router.get(
  "/liveblocks/users",
  auth,
  TryCatch(async (req, res) => {
    const { userIds } = req.query;

    const users = await User.find({
      _id: { $in: Array.isArray(userIds) ? userIds : [userIds] },
    });

    res.status(200).json(
      users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        avatar: u.photo?.imageUrl || null,
      })),
    );
  }),
);
export default router;
