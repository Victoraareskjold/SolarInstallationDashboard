import UpdateProfile from "@/components/UpdateProfile";

export default function OnboardingPage() {
  return (
    <main className="w-full flex flex-col items-center max-w-xs">
      <h1 className="mb-8 self-start">Welcome To Onboarding</h1>
      <UpdateProfile route={"/"} />
    </main>
  );
}
