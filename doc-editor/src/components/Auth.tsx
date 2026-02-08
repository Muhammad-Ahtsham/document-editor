import Login from "@/pages/Login";
import { useGetUserQuery } from "@/store/api/userApi";
import { createContext, type ReactNode } from "react";

interface AuthProps {
  children: ReactNode;
}

interface AuthContextType {
  photo: string;
  email: string;
  id: string;
  name?: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const Auth = ({ children }: AuthProps) => {
  const { data: user, isLoading } = useGetUserQuery("");
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  if (!user) {
    return <Login />;
  }
  return (
    <AuthContext.Provider
      value={{
        photo: user?.user.photo?.imageUrl,
        email: user?.user.email,
        id: user?.user._id.toString(),
        name: user?.user.name,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default Auth;
