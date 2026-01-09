import { Response, Router } from "express";
import { auth } from "../middleware/auth";
import DocContent from "../model/docContent";
import { AuthRequest } from "../types/types";
import TryCatch from "../utility/feature";
import Document from "../model/document";
import mongoose, { Types } from "mongoose";
import htmlToDocx from "html-to-docx"
const router = Router();
router.post(
  "/create",
  auth,
  TryCatch(async (req: AuthRequest, res: Response) => {
    const { documentId, content } = req.body;
    if (!documentId || !content) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      }); 
    }

    const docContent = await DocContent.create({
      documentId,
      content,
    });
    res.status(201).json({
      success: true,
      docContent,
      message: "docContent is created",
    });
  })
);

router.get(
  "/get",
  auth,
  TryCatch(async (req: AuthRequest, res: Response) => {
    const { documentId } = req.query;
    const userId = req.user?.id as string;

    if (!documentId || !Types.ObjectId.isValid(documentId as string)) {
      return res.status(400).json({
        success: false,
        message: "Valid document ID is required",
      });
    }

    const docObjectId = new Types.ObjectId(documentId as string);
    const userObjectId = new Types.ObjectId(userId);

    const document = await Document.findOne({
      _id: docObjectId,
      $or: [
        { ownerId: userObjectId },
        { member: { $elemMatch: { $eq: userObjectId } } }
      ]
    });

    if (!document) {
      return res.status(403).json({
        success: false,
        message: "Document not found or unauthorized access",
      });
    }

    const docContent = await DocContent.findOne({ documentId: docObjectId });

    res.status(200).json({
      success: true,
      docContent: docContent || { content: "" }
    });
  })
);
router.put(
  "/update",
  auth,
  TryCatch(async (req: AuthRequest, res: Response) => {
    const { documentId, content } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: "Document ID is required"
      });
    }

    if (content === undefined) {
      return res.status(400).json({
        success: false,
        message: "Content is required"
      });
    }

    const docContent = await DocContent.findOneAndUpdate(
      { documentId },
      { content },
      { new: true }
    );

    if (!docContent) {
      return res.status(404).json({
        success: false,
        message: "Document not found"
      });
    }

    res.status(200).json({
      success: true,
      docContent,
    });
  })
);

router.post("/export/docx", auth, TryCatch(async (req: AuthRequest, res: Response) => {
  const {html,title} = req.body
  const docx = await htmlToDocx(html, null, { title });

  const buffer = Buffer.isBuffer(docx)
    ? docx
    : Buffer.from(
        docx instanceof ArrayBuffer
          ? docx
          : await docx.arrayBuffer()
      );

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${title ?? "document"}.docx"`
  );

  res.send(buffer)
}))
export default router;
