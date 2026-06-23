import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export async function verifyGoogleToken(
  token: string
) {
  const ticket = await client.verifyIdToken({
    idToken: token,

    audience:
      process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error(
      "Invalid Google Token"
    );
  }

  return {
    googleId: payload.sub,

    email: payload.email,

    name: payload.name,

    picture: payload.picture,

    emailVerified:
      payload.email_verified,
  };
}