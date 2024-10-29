declare module "genius-lyrics-api";

type GeniusOptions = {
    title: string;
    artist: string;
    apiKey: string; // Genius developer access token
    optimizeQuery?: boolean; // (optional, default: false) If true, perform some cleanup to maximize the chance of finding a match
    authHeader?: boolean; // (optional, default: false) Whether to include auth header in the search request
};
