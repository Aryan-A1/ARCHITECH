import puter from "@heyputer/puter.js";
import { isHostedUrl } from "./utils";
import { getOrCreateHostingConfig, uploadImageToHosting } from "./puter.hoisting";

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

export const createProject = async ({item}: CreateProjectParams):
Promise<DesignItem | null | undefined > => {
    const projectId = item.id;
    const hosting =await getOrCreateHostingConfig();

    const hostedSource = projectId ? await uploadImageToHosting({hosting, url:item.sourceImage,projectId, label:'source',}) : null;
    const hostedRender = projectId && item.renderedImage ? await uploadImageToHosting({hosting, url:item.renderedImage, projectId, label:'rendered'}) : null;
    const resolvedSource = hostedSource?.url || (isHostedUrl(item.sourceImage) ? item.sourceImage : '');

    if(!resolvedSource){
        console.warn('Failed to host osurce Image, skipping save.');
        return null;
    }

    const resolvedRender = hostedRender?.url? hostedRender?.url : item.renderedImage && isHostedUrl(item.renderedImage) ? item.renderedImage : undefined;
    
    const{
        sourcePath : _sourcePath,
        renderedPath : _rendredPath,
        publicPath: _publicPath,
        ...rest
    } = item;

    const payload = {
        ...rest,
        sourceImage : resolvedSource,
        renderedImage: resolvedRender,
    } 

    try{
        return payload;

    }catch(e){
        console.log('Failed to save project',e);
        return null;
    }
    

        
}  