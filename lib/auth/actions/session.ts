import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

export const serverGetSessionToken = unstable_cache(
  async (sessionToken: string, sessionData?: string) => {
    return [
      `better-auth.session_token=${sessionToken}`,
      sessionData ? `better-auth.session_data=${sessionData}` : "",
    ]
      .filter(Boolean)
      .join("; ");
  },
  ["session-token"],
  {
    revalidate: 60,
    tags: ["session"],
  }
);

export async function getSessionTokenFromCookies(): Promise<string> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token");
  const sessionData = cookieStore.get("better-auth.session_data");

  if (!sessionToken?.value) {
    console.error("Session token missing:", {
      allCookies: cookieStore.getAll().map((c) => c.name),
    });
    throw new Error("No session token found");
  }

  return serverGetSessionToken(sessionToken.value, sessionData?.value);
}
