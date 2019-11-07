import { Document, Model, model, Schema } from "mongoose";
const timestamps = require("mongoose-timestamp");

export interface IDocument extends Document {
  user?: string;
  title?: string;
  type?: string;
  folder?: string;
  content?: string;
  advancedMode?: boolean;
  cache?: string;
  image?: { image: string; isSnapshot: boolean };
  public: boolean;
  example: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  version?: string;
}

const DocumentMongSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "UserModel"
  },

  title: {
    type: String,
    default: ""
  },

  type: {
    type: String,
    required: true
  },

  folder: {
    type: Schema.Types.ObjectId,
    ref: "FolderModel"
  },

  content: {
    type: String,
    default: "content"
  },

  advancedMode: {
    type: Boolean,
    default: false
  },

  cache: {
    type: String,
    default: "cache"
  },

  image: {
    image: { type: String, default: "" },
    isSnapshot: {
      type: Boolean,
      default: true
    }
  },

  description: {
    type: String,
    default: ""
  },

  version: {
    type: String,
    default: "version"
  },

  public: {
    type: Boolean,
    default: false
  },

  example: {
    type: Boolean,
    default: false
  }
});

DocumentMongSchema.plugin(timestamps);
export const DocumentModel: Model<IDocument> = model<IDocument>(
  "DocumentModel",
  DocumentMongSchema
);
