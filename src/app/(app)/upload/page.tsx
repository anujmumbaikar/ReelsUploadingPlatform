'use client'
import { apiClient } from "@/lib/api-client";
import Router from "next/router";
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { VideoFormData } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const UploadExample = () => {
    const route = useRouter()
    const [progress, setProgress] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortController = new AbortController();

    const authenticator = async () => {
        try {
            const response = await fetch("/api/upload-auth");
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            toast.error("Failed to authenticate upload");
        }
    };

    const handleUpload = async () => {
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please select a file to upload");
            return;
        }
        const file = fileInput.files[0];
        if (!file.type.startsWith("video/")) {
            alert("Please select a valid video file.");
            return;
        }

        try {
            const { signature, expire, token, publicKey } = await authenticator();

            const uploadResponse = await upload({
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name,
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                abortSignal: abortController.signal,
            });

            toast.success("Video uploaded successfully!");

            const videoData: VideoFormData = {
                title,
                description,
                videoUrl: uploadResponse.url as string,
                thumbnailUrl: thumbnailUrl || "", // Or generate default if needed
                controlls: true,
                transformations: {
                    height: 1920,
                    width: 1080,
                    quality: 100,
                },
            };

            const createdVideo = await apiClient.createVideo(videoData);
            if(!createdVideo) {
                alert("Video not created");
                return
            }
            toast.success("Video saved successfully!");
            route.replace("/dashboard")

        } catch (error) {
            if (error instanceof ImageKitAbortError) {
                toast.error("Upload aborted");
            } else if (error instanceof ImageKitInvalidRequestError) {
                toast.error("Invalid request:");
            } else if (error instanceof ImageKitUploadNetworkError) {
                toast.error("Network error:");
            } else if (error instanceof ImageKitServerError) {
                toast.error("Server error:");
            } else {
                toast.error("An unexpected error occurred:");
            }
            toast.error("Upload failed");
        }
    };

    return (
        <div className="upload-container p-6 rounded-lg shadow-lg bg-white max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-4">Upload Your Video</h2>

            <div className="form-container mb-4">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field mb-4"
                    placeholder="Enter video title"
                    required
                />

                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field mb-4"
                    placeholder="Enter video description"
                    required
                />

                <label className="block text-sm font-medium text-gray-700">Thumbnail URL (optional)</label>
                <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="input-field mb-4"
                    placeholder="Enter thumbnail URL"
                />
            </div>

            <div className="file-input-container mb-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="video/*"
                    className="file-input p-3 border border-gray-300 rounded-md w-full"
                />
            </div>

            <div className="text-center mb-4">
                <button
                    type="button"
                    onClick={handleUpload}
                    className="upload-btn px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                    Upload Video
                </button>
            </div>

            <div className="progress-container text-center mt-4">
                <progress value={progress} max={100} className="progress-bar w-full h-4 rounded-lg bg-gray-200">
                    {progress}%
                </progress>
                <div className="progress-text mt-2 text-sm text-gray-600">{Math.round(progress)}%</div>
            </div>
        </div>
    );
};

export default UploadExample;
