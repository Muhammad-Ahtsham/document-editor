import {
  useDeleteProfileImageMutation,
  useUploadProfileImageMutation,
} from "@/store/api/userApi";
import { File, Plus, Trash2 } from "lucide-react";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { AuthContext } from "./Auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Profile = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const user = useContext(AuthContext);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user?.photo || null);

  const [uploadProfileImage, { isLoading: isUploading }] =
    useUploadProfileImageMutation();
  const [deleteProfileImage,{isLoading:isDeleting}] = useDeleteProfileImageMutation();
  useEffect(() => {
    let objectUrl: string | null = null;

    if (file) {
      if (file.type.startsWith("image/")) {
        objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
      }
    } else if (user?.photo) {
      setPreview(user.photo);
    } else {
      setPreview(null);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file, user?.photo]);

  const inputOpen = () => {
    inputRef.current?.click();
  };

  const clearProfilePic = async (e: React.MouseEvent) => {
    e.preventDefault()
    deleteProfileImage();
    setFile(null);
    setPreview(null);
  };

  const handleSelectFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    setFile(selectedFile);

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      await uploadProfileImage(formData).unwrap();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Input
        ref={inputRef}
        onChange={handleSelectFile}
        type="file"
        className="hidden"
        accept="image/*"
      />
      <Button
        type="button"
        variant="outline"
        disabled={isUploading || isDeleting}
        className="h-28 w-28 rounded-full p-0 flex items-center justify-center border-dashed overflow-hidden"
        onClick={inputOpen}
      >
        {preview ? (
          <Avatar className="w-full h-full">
            <AvatarImage src={preview} alt="Profile" />
            <AvatarFallback>
              <File className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <Plus />
        )}
      </Button>
      <Button
        variant="ghost"
        className="self-end hover:text-red-700 bg-none border-none outline-none"
        onClick={(e)=>clearProfilePic(e)}
        disabled={isUploading || isDeleting}
      >
        <Trash2 />
      </Button>
    </div>
  );
};

export default Profile;
