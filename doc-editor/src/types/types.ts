export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  photo: {
    imageUrl: string;
    publicId: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};


export interface Document {
  _id: string;
  name: string;
  isPrivate: boolean;
  member: User[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateDocumentResponse {
  success: boolean;
  document: Document;
  message: string;
  error?: {
    data: {
      message: string
    }
  }
}

export interface GetDocument {
  success: boolean,
  document: Document
}

export interface CreateDocContentResponse {
  success: boolean;
  docContent: {
    _id: string;
    documentId: string;
    content: string;
    __v: number;
  }
}

export interface UploadResponse {
  success: boolean;
  message: string
}

export interface UserProfile {
  success: boolean,
  message: string;
  user: User
}

export interface UpdateUserProfile {
  email?: string;
  newPassword?: string;
  currentPassword?: string;
  name?: string;
}