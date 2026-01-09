import Login from "@/pages/Login";
import { createContext, useEffect, useState, type ReactNode } from "react";

interface AuthProps {
  children: ReactNode;
}

interface User {
  photo: {
    imageUrl: string;
    publicId: string;
  };
  _id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  photo: string;
  email: string;
  id: string;
  name?: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const Auth = ({ children }: AuthProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/user/me", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
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
        photo: user?.photo?.imageUrl,
        email: user.email,
        id: user._id.toString(),
        name: user.name,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default Auth;
