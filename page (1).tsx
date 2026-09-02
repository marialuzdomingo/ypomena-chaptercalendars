import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "@/middleware";

const SITE_PASSWORD = "YPOMENA";

async function login(formData: FormData) {
  "use server";
  const password = formData.get("password");
  const redirectTo = (formData.get("redirectTo") as string) || "/";

  if (password === SITE_PASSWORD) {
    cookies().set(AUTH_COOKIE_NAME, "granted", {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    redirect(redirectTo);
  }

  redirect(`/login?error=1&redirectTo=${encodeURIComponent(redirectTo)}`);
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string; error?: string };
}) {
  const redirectTo = searchParams.redirectTo ?? "/";

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-xl border border-line bg-paper p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-gold">YPO Middle East / North Africa</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Chapter Events Registry</h1>
        <p className="mt-2 text-sm text-ink/60">Enter the password to continue.</p>

        <form action={login} className="mt-6">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            required
            className="w-full rounded-lg border border-line bg-navy px-4 py-3 text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-gold"
          />
          {searchParams.error && (
            <p className="mt-2 text-sm text-red">Incorrect password — try again.</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-gold py-3 font-semibold text-navy transition-opacity hover:opacity-90"
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}
