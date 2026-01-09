import bcrypt from "bcrypt";
import mongoose, { HydratedDocument, Model, Schema } from "mongoose";

interface IUser {
  photo?: {
    imageUrl: string;
    publicId: string;
  };
  name: string;
  email: string;
  password: string;
}

interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}
type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    photo: {
      imageUrl: String,
      publicId: String
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = function (
  candidate: string
): Promise<boolean> {
  const candidatePassword = String(candidate);
  const hashedPassword = String(this.password);
  return bcrypt.compare(candidatePassword, hashedPassword);
};

export default mongoose.model<IUser, UserModel>("User", UserSchema);

export type UserDocument = HydratedDocument<IUser, IUserMethods>;
