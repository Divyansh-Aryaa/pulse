import { useState } from "react";

export default function RepoInput({ onAnalyze }) {
  const [repoUrl, setRepoUrl] = useState("");

  return (
    <div className="flex gap-3 w-full max-w-2xl mx-auto mb-6">
      <input
        className="flex-1 bg-[#0d1117] border border-gray-700 p-3 rounded text-sm focus:outline-none focus:border-gray-500"
        placeholder="Enter GitHub repo URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />

      <button
        className="bg-gray-200 text-black px-4 rounded text-sm font-medium hover:bg-white"
        onClick={() => onAnalyze(repoUrl)}
      >
        Analyze
      </button>
    </div>
  );
}
