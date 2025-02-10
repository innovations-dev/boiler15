import { ResetPasswordForm } from "../_components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <ResetPasswordForm />
    </main>
  );
}
