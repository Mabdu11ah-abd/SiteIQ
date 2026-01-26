// frontend/site-iq/src/app/sign-in/[[...sign-in]]/page.jsx
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <SignIn />
    </div>
  );
}
