// frontend/site-iq/src/app/sign-up/[[...sign-up]]/page.jsx
import { SignUp } from "@clerk/nextjs";

// This page renders the Clerk sign-up component.
// The [[...sign-up]] convention in the file name allows Clerk to handle
// various sign-up related routes like /sign-up, /sign-up/sso-callback, etc.
// The component itself will manage the UI and registration flow.

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <SignUp />
    </div>
  );
}
