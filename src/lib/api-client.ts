import { IVideo } from "@/models/video.model";
export type VideoFormData = Omit<IVideo,"_id">
type FetchOptions = {
    method?:"GET" | "POST" | "PUT" | "DELETE";
    body?:any;
    headers?:Record<string, string>;

}
class ApiClient {
    private baseUrl: string;
    
    constructor() {
        // Use absolute URL in production, relative in development
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
    }
    
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        const { method = "GET", body, headers = {} } = options;
        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        };
        
        const url = endpoint.startsWith('/') 
            ? `${this.baseUrl}${endpoint}` 
            : `${this.baseUrl}/${endpoint}`;
            
        const response = await fetch(url, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        return response.json();
    }
    async getVideos(){
        return this.fetch<IVideo[]>("/videos")
    }
    async getAVideo(id:string){
        return this.fetch<IVideo>(`/videos/${id}`)
    }
    async createVideo(videoData:VideoFormData){
        return this.fetch("/videos",{
            method: "POST",
            body: videoData
        })
    }
}

export const apiClient = new ApiClient();