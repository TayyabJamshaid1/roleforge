type GitHubAccessTokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
};

type GitHubUserResponse = {
  id: number;
  name: string | null;
  login: string;
  avatar_url: string;
  email: string | null;
};

type GitHubEmailResponse = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
};

export function getGitHubAuthUrl() {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID as string,
    redirect_uri: process.env.GITHUB_REDIRECT_URI as string,
    scope: "read:user user:email",
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeGitHubCodeForToken(code: string) {
  const response = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to exchange GitHub code");
  }

  const data =
    (await response.json()) as GitHubAccessTokenResponse;

  if (!data.access_token) {
    throw new Error("GitHub access token not found");
  }

  return data.access_token;
}

export async function getGitHubUser(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub user");
  }

  return (await response.json()) as GitHubUserResponse;
}

export async function getGitHubPrimaryEmail(accessToken: string) {
  const response = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub emails");
  }

  const emails =
    (await response.json()) as GitHubEmailResponse[];

  const primaryEmail = emails.find(
    (item) => item.primary && item.verified
  );

  if (!primaryEmail) {
    throw new Error("No verified primary GitHub email found");
  }

  return primaryEmail.email;
}