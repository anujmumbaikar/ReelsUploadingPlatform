"use client";
import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/video.model";
import VideoPlayer from "@/components/VideoComponent";
export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        setError("Error fetching videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">ImageKit ReelsPro</h1>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="spinner-border animate-spin border-t-4 border-blue-600 rounded-full w-12 h-12"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-8 text-center">
          {error}
        </div>
      )}

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoPlayer key={video._id?.toString()} src={video.videoUrl} />
          ))}
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-500 mt-8">No videos found.</p>
        )
      )}
    </main>
  );
}
