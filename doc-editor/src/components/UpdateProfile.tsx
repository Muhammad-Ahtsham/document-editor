import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateUserProfileMutation } from "@/store/api/userApi";
import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import Profile from "./Profile";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface HeaderProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
interface UpdateUserProfile {
  email?: string | undefined;
  newPassword?: string | undefined;
  currentPassword: string | undefined;
  name?: string | undefined;
}
const UpdateProfile = ({ open, setOpen }: HeaderProps) => {
  const [updateUserProfie] = useUpdateUserProfileMutation();
  const [userUpdate, setUserUpdate] = useState<UpdateUserProfile | undefined>({
    email: undefined,
    newPassword: undefined,
    currentPassword: undefined,
    name: undefined,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserUpdate((prev) => ({
      ...prev!,
      [name]: value || undefined,
    }));
  };
  const handeleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = updateUserProfie(userUpdate!).unwrap();
    console.log(response);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and password.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={(e) => handeleSubmit(e)}>
          <div className="flex justify-center">
            <Profile />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              id="name"
              placeholder="Enter your name"
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                type="password"
                name="password"
                placeholder="New password"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                onChange={handleChange}
                placeholder="Current password"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfile;
