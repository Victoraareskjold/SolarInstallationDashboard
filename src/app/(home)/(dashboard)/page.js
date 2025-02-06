"use client";

import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { db } from "@/lib/firebase";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: userData, loading: userLoading } = useFirestoreDoc(
    db,
    "users",
    user?.uid
  );

  const { data: orgData, loading: orgLoading } = useFirestoreDoc(
    db,
    "organizations",
    userData?.organizationId
  );

  if (userLoading || orgLoading) {
    return <Loading />;
  }

  return (
    <div>
      <p>This is the dashboard for {orgData?.organization}</p>
      <p>
        Welcome {userData?.firstName} {userData?.lastName}{" "}
      </p>
    </div>
  );
}
