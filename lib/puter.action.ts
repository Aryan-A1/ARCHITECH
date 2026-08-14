import puter from "@heyputer/puter.js";
import { isHostedUrl } from "./utils";
import { getOrCreateHostingConfig, uploadImageToHosting } from "./puter.hoisting";
import { PUTER_WORKER_URL } from "./constants";

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

export const createProject = async ({item, visibility = "private"}: CreateProjectParams):
Promise<DesignItem | null | undefined > => {

    if(!PUTER_WORKER_URL){
        console.warn('Missing VITE_PUTER_WORKER_URL, skip deployment to puter');
        return null;
    }
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
        const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/save`, {
            method : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ project: payload, visibility }),
        });
        if(!response.ok){
            console.error('Failed to save project', await response.text());
                return null;
        }
        const data = (await response.json()) as {project? : DesignItem | null};
        return data ?.project ?? null;
  
    }catch(e){
        console.log('Failed to save project',e);
        return null;
    }
    

        
}  

export const getProjects = async() => {
    if(!PUTER_WORKER_URL){
        console.warn('Missing VITE_PUTER_WORKER_URL; skip hsitory fetch');
        return[];
    }
    try{
        const response = await puter.workers.exec(`${PUTER_WORKER_URL}/api/projects/list`, {method: 'GET'});

        if(!response.ok){
            console.error('Failed to fetch history', await response.text());
            return[];
        }

        const data = (await response.json()) as { projects?: DesignItem[] | null};
        return Array.isArray(data ?.projects) ? data?.projects:[];
    }
    catch(e){
        console.error('Failed to get projects', e);
        return[];
    }
}


export const getProjectById = async ({ id }: { id: string }) => {
    if (!PUTER_WORKER_URL) {
        console.warn("Missing VITE_PUTER_WORKER_URL; skipping project fetch.");
        return null;
    }

    console.log("Fetching project with ID:", id);

    try {
        const response = await puter.workers.exec(
            `${PUTER_WORKER_URL}/api/projects/get?id=${encodeURIComponent(id)}`,
            { method: "GET" },
        );

        console.log("Fetch project response:", response);

        if (!response.ok) {
            console.error("Failed to fetch project:", await response.text());
            return null;
        }

        const data = (await response.json()) as {
            project?: DesignItem | null;
        };

        console.log("Fetched project data:", data);

        return data?.project ?? null;
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return null;
    }
};

