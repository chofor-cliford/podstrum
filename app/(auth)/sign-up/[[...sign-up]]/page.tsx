import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex-center glassmorphism h-screen w-full">
      <SignUp />
    </div>
  );
}
