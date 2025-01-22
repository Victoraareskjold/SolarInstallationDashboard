import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";

export default function SignoutButton() {
  const [error, setError] = useState("");
  const { setLoading } = useAuth();

  const handleSignout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSignout}>Sign out</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
