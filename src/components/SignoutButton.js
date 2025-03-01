import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";
import Loading from "./Loading";
import { DoorOpen } from "lucide-react";

export default function SignoutButton() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <button
        onClick={handleSignout}
        className="flex flex-row items-center gap-2 bg-white p-2 rounded-md"
      >
        <DoorOpen size={20} />
        <p>Sign out</p>
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
