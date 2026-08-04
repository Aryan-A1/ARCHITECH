import puter from "@heyputer/puter.js";

export const signIn = async () => {
    try {
        const res = await puter.auth.signIn();
        return res;
    } catch (e) {
        console.error("Puter signIn error:", e);
        throw e;
    }
};

export const signOut = async () => {
    try {
        await puter.auth.signOut();
    } catch (e) {
        console.error("Puter signOut error:", e);
        throw e;
    }
};

export const getCurrentUser = async () => {
    try {
        if (typeof window === "undefined") return null;

        if (puter.auth.isSignedIn()) {
            return await puter.auth.getUser();
        }

        // Try restoring token from localStorage if present
        const token = localStorage.getItem("puter.auth.token.v2") || localStorage.getItem("puter.auth.token");
        if (token) {
            puter.setAuthToken(token);
            if (puter.auth.isSignedIn()) {
                return await puter.auth.getUser();
            }
        }

        return null;
    } catch (e) {
        console.error("getCurrentUser error:", e);
        return null;
    }
};