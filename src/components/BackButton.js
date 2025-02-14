import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <button className="bg-slate-200 p-1" onClick={handleBack}>
      Go Back
    </button>
  );
}
