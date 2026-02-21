import { SignIn } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignIn appearance={{ theme: shadcn }} />
    </div>
  );
}
