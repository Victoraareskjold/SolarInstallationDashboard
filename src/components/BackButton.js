import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return <button onClick={handleBack}>Go Back</button>;
}
