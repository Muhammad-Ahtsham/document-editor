import mongoose, { Model, Schema, Types } from "mongoose";
export interface IDocContent {
  documentId: Types.ObjectId;
  content: string;
}
type DocContentModel = Model<IDocContent>;
const DocContentSchema = new Schema<IDocContent, DocContentModel>({
  documentId: {
    type: Schema.Types.ObjectId,
    ref:"Document",
    required: true,
  },
  content: {
    type: String,
  },
});

export default mongoose.model<IDocContent, DocContentModel>(
  "DocContent",
  DocContentSchema
);
