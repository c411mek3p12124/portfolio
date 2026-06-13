// ───────────────────────────────────────────────────────────────
//  Client-side gate for /operator. Only the SHA-256 HASH of the
//  password lives in the bundle — never the password itself.
//
//  Default password: "keppra-admin"
//  To set your own (recommended for production):
//    1. Get the hash of your password:
//         node -e "console.log(require('crypto').createHash('sha256').update('YOUR_PASSWORD').digest('hex'))"
//    2. Put it in .env.local AND in Vercel env vars:
//         NEXT_PUBLIC_OPERATOR_HASH=<the hash>
//  (No code change or telling anyone your password.)
// ───────────────────────────────────────────────────────────────

export const OPERATOR_HASH =
  process.env.NEXT_PUBLIC_OPERATOR_HASH ||
  "ad381aa00a6f8341da914d97f8e630a1263321a0310af97fdaa60c59cc636c26"; // sha256("keppra-admin")

export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
