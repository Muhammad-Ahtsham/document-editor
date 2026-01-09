import { Response, Router } from "express";
import { auth } from "../middleware/auth";
import DocContent from "../model/docContent";
import Document from "../model/document";
import User from "../model/user";
import { AuthRequest } from "../types/types";
import TryCatch from "../utility/feature";
import mongoose, { Types } from "mongoose";
const router = Router();

router.post(
  "/create",
  auth,
  TryCatch(async (req: AuthRequest, res: Response) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Document name is required",
      });
    }
    const document = await Document.create({
      name,
      ownerId: req.user?.id,
    });
    await DocContent.create({
      documentId: document._id,
      content: "",
    });
    res.status(201).json({
      success: true,
      document,
      message: "document is created",
    });
  })
);
router.get(
  "/get",
  auth,
  TryCatch(async (req: AuthRequest, res: Response) => {
    const document = await Document.find({ ownerId: req.user?.id });
    res.status(200).json({
      success: true,
      document,
    });
  })
);
router.get(
  "/get/:id",
  auth,
  TryCatch(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Document id is required",
      });
    }
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document id",
      });
    }

    const document = await Document.findOne({
      _id: new Types.ObjectId(id),
      $or: [
        { ownerId: req.user?.id },
        { member: { $elemMatch: { $eq: req.user?.id } } }
      ]
    }).populate("member");
    res.status(200).json({
      success: true,
      document,
    });
  })
);
router.delete(
  "/delete/:id",
  auth,
  TryCatch(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Document id is required",
      });
    }
    await Document.findOneAndDelete({
      _id: id,
      ownerId: req.user?.id,
    });
    res.status(200).json({
      success: true,
      message: "document is deleted",
    });
  })
);
router.put(
  "/addmember/:documentId",
  auth,
  TryCatch(async (req: AuthRequest, res: Response) => {
    const { email } = req.body;
    const { documentId } = req.params;
    if (!email || !documentId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!Types.ObjectId.isValid(documentId)) {
      return res.status(400).json({ message: "Invalid document id" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const document = await Document.findOneAndUpdate(
      {
        _id: new Types.ObjectId(documentId),
        ownerId: new Types.ObjectId(req.user!.id),
      },
      { $addToSet: { member: user._id } },
      { new: true }
    );
    if (!document) {
      res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }
    res.status(200).json({
      success: true,
      document,
      message: "Member added successfully",
    });
  })
);

router.put(
  "/public/:id",
  auth,
  TryCatch(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Document id is required",
      });
    }
    const document = await Document.findOne({ _id: id, ownerId: req.user?.id });
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }
    if (document?.isPrivate !== undefined) {
      document.isPrivate = !document.isPrivate;
      await document.save();
    }

    res.status(200).json({
      success: true,
      isPrivate: document.isPrivate,
      message: "Document is now public",
    });
  })
);

router.delete(
  "/documents/:documentId/member/:memberId",
  auth,
  TryCatch(async (req: AuthRequest, res: Response) => {
    const { documentId, memberId } = req.params;
    const userId = req.user?.id;

    if (!mongoose.isValidObjectId(documentId) || !mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const result = await Document.findOneAndUpdate(
      {
        _id: documentId,
        ownerId: userId,
        member: memberId
      },
      {
        $pull: { member: memberId }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Document not found or you don't have permission"
      });
    }

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      remainingMembers: result.member.length
    });
  })
);
export default router;
