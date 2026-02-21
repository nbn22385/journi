import { SignUp } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignUp appearance={{ theme: shadcn }} />
    </div>
  );
}
