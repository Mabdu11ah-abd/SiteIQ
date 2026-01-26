'use client';

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="text-center">
        <CheckCircle className="text-green-500 mx-auto mb-4 h-16 w-16" />
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
          Your premium subscription is now active. Enjoy all the features!
        </p>
        <Link href="/">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
