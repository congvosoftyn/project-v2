
export type AppleIdTokenType = {
    /** The issuer-registered claim key, which has the value https://appleid.apple.com. */
    iss: string,
    /** The unique identifier for the user. */
    sub: string,
    /** Your client_id in your Apple Developer account. */
    aud: string,
    /** The expiry time for the token. This value is typically set to five minutes. */
    exp: string,
    /** The time the token was issued. */
    iat: string,
    /** A String value used to associate a client session and an ID token. This value is used to mitigate replay attacks and is present only if passed during the authorization request. */
    nonce: string,
    /** A Boolean value that indicates whether the transaction is on a nonce-supported platform. If you sent a nonce in the authorization request but do not see the nonce claim in the ID token, check this claim to determine how to proceed. If this claim returns true you should treat nonce as mandatory and fail the transaction; otherwise, you can proceed treating the nonce as optional. */
    nonce_supported: boolean,
    /** The user's email address. */
    email: string,
    /** A String or Boolean value that indicates whether the service has verified the email. The value of this claim is always true because the servers only return verified email addresses. */
    email_verified: 'true' | 'false' | boolean,
    /** A String or Boolean value that indicates whether the email shared by the user is the proxy address. */
    is_private_email: 'true' | 'false' | boolean,
};

export type AppleWebhookTokenEventType = {
    /** The type of event. */
    type:
    | 'email-disabled'
    | 'email-enabled'
    | 'consent-revoked'
    | 'account-delete',
    /** The unique identifier for the user. */
    sub: string,
    /** The time the event occurred. */
    event_time: number,
    /** The email address for the user. Provided on `email-disabled` and `email-enabled` events only. */
    email?: string,
    /** A String or Boolean value that indicates whether the email shared by the user is the proxy address. The value of this claim is always true because the email events relate only to the user's private relay service forwarding preferences. Provided on `email-disabled` and `email-enabled` events only. */
    is_private_email?: 'true' | 'false' | boolean,
};

export type AppleWebhookTokenType = {
    /** The issuer-registered claim key, which has the value https://appleid.apple.com. */
    iss: string,
    /** Your client_id in your Apple Developer account. */
    aud: string,
    /** The expiry time for the token. This value is typically set to five minutes. */
    exp: string,
    /** The time the token was issued. */
    iat: string,
    /** The unique identifier for this token. */
    jti: string,
    /** The event description. */
    events: AppleWebhookTokenEventType,
};

export type RawAppleWebhookTokenType = {
    /** The issuer-registered claim key, which has the value https://appleid.apple.com. */
    iss: string,
    /** Your client_id in your Apple Developer account. */
    aud: string,
    /** The expiry time for the token. This value is typically set to five minutes. */
    exp: string,
    /** The time the token was issued. */
    iat: string,
    /** The unique identifier for this token. */
    jti: string,
    /** The JSON-stringified event description. */
    events: string,
};

export type AppleAuthorizationTokenResponseType = {
    /** A token used to access allowed data. */
    access_token: string,
    /** It will always be Bearer. */
    token_type: 'Bearer',
    /** The amount of time, in seconds, before the access token expires. */
    expires_in: 300,
    /** used to regenerate (new) access tokens. */
    refresh_token: string,
    /** A JSON Web Token that contains the user’s identity information. */
    id_token: string,
};
