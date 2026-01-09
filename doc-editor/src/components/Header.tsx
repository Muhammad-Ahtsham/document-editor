import { useAddMemberMutation } from "@/store/api/documentApi";
import type { GetDocument } from "@/types/types";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Share2 } from "lucide-react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOthers } from "../../liveblocks.config";
import { AuthContext } from "./Auth";
import DocumentMember from "./DocumentMember";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
interface HeaderProps {
  document?: GetDocument;
  initialIsPrivate: boolean;
  handleDocContentSave: () => void;
  handleIsPrivate: (
    value: boolean,
    setIsPrivate: Dispatch<SetStateAction<boolean>>
  ) => void;
}
const Header = ({
  document,
  handleDocContentSave,
  initialIsPrivate,
  handleIsPrivate,
}: HeaderProps) => {
  const [fullUrl, setFullUrl] = useState<string>("");
  const [memberEmail, setMemberEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const getUser = useContext(AuthContext);
  const { id } = useParams();
  const [addMember, { isLoading }] = useAddMemberMutation();
  const navigate = useNavigate();
  const others = useOthers();
  useEffect(() => {
    setFullUrl(window.location.href);
    setIsPrivate(initialIsPrivate);
  }, [initialIsPrivate]);

  const handleShareLink = useCallback(async () => {
    await navigator.share({ title: "Access link", url: fullUrl });
  }, [fullUrl]);

  const handleAddmember = useCallback(async () => {
    if (!id || !memberEmail) return;
    const response = await addMember({ documentId: id, email: memberEmail });

    if (!response || !response?.data?.success) {
      if (response?.error && "data" in response.error) {
        setErrorMessage((response.error.data as { message: string })?.message);
      }
    } else {
      setSuccessMessage(response?.data?.message);
    }
  }, [id, memberEmail, addMember]);
  const renderedAvatars = useMemo(
    () =>
      others
        .map((memberInfo, i) => {
          if (memberInfo.info.email === getUser?.email) {
            return null;
          }
          return (
            <div key={i}>
              <Avatar className="size-8">
                <AvatarImage
                  src={memberInfo.info.avatar}
                  alt={memberInfo.info.name}
                />
                <AvatarFallback>
                  {memberInfo.info.name || memberInfo.info.email}
                </AvatarFallback>
              </Avatar>
            </div>
          );
        })
        .filter(Boolean),
    [others, getUser?.email]
  );

  return (
    <div className="h-20  w-screen flex items-center text-white px-6 sticky top-0 left-0 right-0 z-10 justify-between">
      <div className="flex gap-2 items-center">
        <div className="text-black" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </div>
        <div className="text-black font-bold size-10 w-[20rem] h-30 flex items-center">
          {document?.document?.name}
        </div>
      </div>
      <div className="flex items-center gap-2 z-10">
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-3 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
          {renderedAvatars}
        </div>
        <div className="flex gap-1">
          <Button
            className="rounded-full flex items-center gap-2 px-3 py-2 size-8"
            onClick={() => handleDocContentSave()}
          >
            <Save />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full flex items-center gap-2 px-3 py-2 size-8">
                <Share2 />
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col  h-min-[25rem]">
              <DialogHeader>
                <DialogTitle>Share</DialogTitle>
                <DialogDescription>
                  you can give document access to friends
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2 justify-center">
                  <Label htmlFor="link">Link</Label>
                  <Input
                    id="link"
                    name="link-input"
                    readOnly
                    aria-selected
                    className="text-1xl"
                    value={fullUrl}
                  />
                </div>
              </div>
              <div className="flex items-center flex-row self-end space-x-2">
                <Switch
                  id="isPrivate"
                  checked={isPrivate}
                  onCheckedChange={(value) =>
                    handleIsPrivate(value, setIsPrivate)
                  }
                />
                <Label htmlFor="isPrivate">Private</Label>
              </div>
              <div className="flex flex-col gap-2 justify-center mb-2">
                <Label htmlFor="add-member">Add member</Label>
                <Input
                  id="add-member"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="Enter member email"
                />
                {errorMessage && (
                  <div className="text-red-500">{errorMessage}</div>
                )}
                {successMessage && (
                  <div className="text-green-500">{successMessage}</div>
                )}
              </div>
              <DocumentMember document={document}/>
              <DialogFooter>
                  <motion.div whileHover={{ scale: 1.03 }}>
                  <Button disabled={isLoading} onClick={handleAddmember}>
                    Add member
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Button onClick={handleShareLink}>Share</Button>
                </motion.div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
