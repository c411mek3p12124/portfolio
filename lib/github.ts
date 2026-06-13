// ───────────────────────────────────────────────────────────────
//  Commit the edited content straight to GitHub from the browser
//  using a Personal Access Token (fine-grained, "Contents: write").
//  No backend required → works on any free host.
// ───────────────────────────────────────────────────────────────

export interface GitHubSettings {
  owner: string;
  repo: string;
  branch: string;
  path: string; // e.g. "portfolio/public/content/site.json"
  token: string;
}

const LS_KEY = "operator.github";

export function loadSettings(): GitHubSettings {
  if (typeof window === "undefined") return blank();
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? { ...blank(), ...JSON.parse(raw) } : blank();
  } catch {
    return blank();
  }
}

export function saveSettings(s: GitHubSettings) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

function blank(): GitHubSettings {
  // Pre-filled for this repo so only the token is needed.
  return { owner: "c411mek3p12124", repo: "portfolio", branch: "main", path: "public/content/site.json", token: "" };
}

// UTF-8 safe base64 (handles emoji / accents in content)
function toBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

async function getSha(s: GitHubSettings): Promise<string | undefined> {
  // cache-buster + no-store: GitHub's contents GET can be served from the browser
  // cache (ETag/max-age), which returns a STALE sha → 409 "does not match" on save.
  const url = `https://api.github.com/repos/${s.owner}/${s.repo}/contents/${s.path}?ref=${s.branch}&_=${Date.now()}`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${s.token}`, Accept: "application/vnd.github+json" },
  });
  if (res.status === 404) return undefined; // first commit
  if (!res.ok) throw new Error(`Could not read file (${res.status}). Check repo/path/token.`);
  const json = await res.json();
  return json.sha as string;
}

async function putContent(s: GitHubSettings, content: unknown, sha: string | undefined) {
  const url = `https://api.github.com/repos/${s.owner}/${s.repo}/contents/${s.path}`;
  const body = {
    message: `chore(content): update site content via operator ${new Date().toISOString()}`,
    content: toBase64(JSON.stringify(content, null, 2) + "\n"),
    branch: s.branch,
    ...(sha ? { sha } : {}),
  };
  return fetch(url, {
    method: "PUT",
    cache: "no-store",
    headers: { Authorization: `Bearer ${s.token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function commitContent(s: GitHubSettings, content: unknown): Promise<string> {
  if (!s.owner || !s.repo || !s.token) throw new Error("Fill in owner, repo and token first.");
  let res = await putContent(s, content, await getSha(s));
  // On a sha conflict (409 / 422), re-read the latest sha once and retry — handles
  // the case where the file changed between read and write (e.g. a quick second save).
  if (res.status === 409 || res.status === 422) {
    res = await putContent(s, content, await getSha(s));
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Commit failed (${res.status}).`);
  }
  const json = await res.json();
  return json.commit?.html_url || "committed";
}
