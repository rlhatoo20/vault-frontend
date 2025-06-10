'use client';

import { useEffect, useState } from 'react';

type Video = {
  videoId: string;
  title: string;
  url: string;
  channel: string;
  timestamp: string;
  summary: string;
  tldr: string;
};

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const fetchVideos = async () => {
    const res = await fetch(`${API_URL}/api/videos`);
    const data = await res.json();
    setVideos(data.reverse());
  };

  const submitVideo = async () => {
    if (!videoId) return;
    setLoading(true);
    await fetch(`${API_URL}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoId,
        title: 'From UI',
        url: `https://www.youtube.com/watch?v=${videoId}`,
        channel: 'Unknown',
        timestamp: new Date().toISOString(),
      }),
    });
    setVideoId('');
    await fetchVideos();
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📼 Vault - YouTube Summary Tracker</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          className="border rounded p-2 w-full"
          placeholder="Enter YouTube Video ID"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={submitVideo}
          disabled={loading}
        >
          {loading ? 'Summarizing...' : 'Add'}
        </button>
      </div>
      <ul className="space-y-4">
        {videos.map((video) => (
          <li key={video.videoId} className="border p-4 rounded shadow">
            <h2 className="font-semibold text-lg">{video.title}</h2>
            <p className="text-sm text-gray-500">{new Date(video.timestamp).toLocaleString()}</p>
            <a
              href={video.url}
              target="_blank"
              className="text-blue-500 underline"
              rel="noopener noreferrer"
            >
              ▶ Watch on YouTube
            </a>
            <div className="mt-2">
              <p className="font-medium">TL;DR:</p>
              <p>{video.tldr}</p>
              <button
                className="text-sm text-blue-600 mt-2 underline"
                onClick={() => setExpanded(expanded === video.videoId ? null : video.videoId)}
              >
                {expanded === video.videoId ? 'Hide Summary' : 'Show Full Summary'}
              </button>
              {expanded === video.videoId && <p className="mt-2">{video.summary}</p>}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
