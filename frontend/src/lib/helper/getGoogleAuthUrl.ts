export function getGoogleAuthUrl() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT!,
        response_type: "code",
        scope: [
            "openid",
            "profile",
            "email"
        ].join(" "),
        access_type: "offline",
        prompt: "consent"
    });

    return `${rootUrl}?${params.toString()}`;
}
