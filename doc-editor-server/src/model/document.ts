import mongoose, { Schema, Model, Types } from "mongoose";

export interface IDocument {
  name: string;
  member: Types.ObjectId[];
  ownerId: Types.ObjectId;
  isPrivate: boolean;
}

type DocumentModel = Model<IDocument>;

const DocumentSchema = new Schema<IDocument, DocumentModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    member: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDocument, DocumentModel>(
  "Document",
  DocumentSchema
);
