import NextAuth, { InitOptions } from "next-auth";

const CustomBungieProvider = () => ({
  id: "bungie",
  name: "Bungie",
  type: "oauth",
  version: "2.0",
  scope: "",
  params: { reauth: "true", grant_type: "authorization_code" },
  accessTokenUrl: "https://www.bungie.net/platform/app/oauth/token/",
  requestTokenUrl: "https://www.bungie.net/platform/app/oauth/token/",
  authorizationUrl:
    "https://www.bungie.net/en/OAuth/Authorize?response_type=code",
  profileUrl:
    "https://www.bungie.net/platform/User/GetBungieAccount/{membershipId}/254/",
  profile: (profile) => {
    const { bungieNetUser: user } = profile.Response;

    return {
      id: user.membershipId,
      name: user.displayName,
      image: `https://www.bungie.net${
        user.profilePicturePath.startsWith("/") ? "" : "/"
      }${user.profilePicturePath}`,
      email: null,
    };
  },
  headers: {
    "X-API-Key": process.env.BUNGIE_API_KEY,
  },
  clientId: process.env.BUNGIE_CLIENT_ID,
  // clientSecret: process.env.BUNGIE_CLIENT_SECRET,
});

const options: InitOptions = {
  providers: [CustomBungieProvider()],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: null, // If set, new users will be directed here on first sign in
  },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    encryption: true,
  },
};

export default (req, res) => NextAuth(req, res, options);
