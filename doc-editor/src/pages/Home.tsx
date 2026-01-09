import { AuthContext } from "@/components/Auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateDocumentMutation,
  useDeleteDocumentMutation,
  useGetAllDocumentQuery,
} from "@/store/api/documentApi";

import UpdateProfile from "@/components/UpdateProfile";
import { LogOut, Plus, Settings, User } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DialogDescription } from "@radix-ui/react-dialog";

export const Home = () => {
  const [documentName, setDocumentName] = useState<string>("");
  const authContext = useContext(AuthContext);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [createDocument,{isLoading:isCreatingUpdate}] = useCreateDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();
  const { data } = useGetAllDocumentQuery();
  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("name") as string;

    try {
      const result = await createDocument({ name: title }).unwrap();
      if (result.success) {
        navigate(`document/${result.document?._id}`);
      }
    } catch (error: any) {
      console.error("Failed to create document:", error);
      if (error.status === "FETCH_ERROR") {
        console.error(
          "Network error. Check if server is running on localhost:3000"
        );
      }
    }
  };
  const handleEditDoc = (id: string) => {
    navigate(`/document/${id}`);
  };
  const handDeleteDoc = (id: string) => {
    const response = deleteDocument(id).unwrap();
    console.log(response);
  };
  const handleLogout = async () => {
    try {
      await fetch("/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="px-10 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Document Manager</h1>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={authContext?.photo}
                      alt="@username"
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {authContext?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {authContext?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpen(!open)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div className="px-10 py-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="inline-flex flex-col items-center justify-center bg-white hover:bg-gray-50 
                       transition-all duration-200 cursor-pointer text-gray-800 w-40 h-24 p-4 
                       rounded-lg shadow-sm border-2 border-dashed border-gray-300 
                       hover:border-gray-400 hover:shadow-md"
              variant="ghost"
            >
              <Plus className="w-6 h-6 mb-2" />
              <div className="text-sm font-medium">Create New</div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New document</DialogTitle>
              <DialogDescription>Here you can create new document</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDoc}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="doc">Enter document name</Label>
                  <Input
                    id="doc"
                    name="name"
                    className="text-1xl"
                    placeholder="Type here..."
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreatingUpdate}>Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="px-10">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b">
                  Name
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b">
                  Created Date
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 border-b">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.document?.length ?? 0 >= 0 ? (
                data?.document.map((doc, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">
                      <Link
                        to={`/document/${doc._id}`}
                        className="hover:text-blue-600 hover:underline"
                      >
                        {doc.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{doc.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDoc(doc._id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handDeleteDoc(doc._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center">
                    No document found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UpdateProfile open={open} setOpen={setOpen} />
    </div>
  );
};
