
import { useState } from "react";

import RepoInput from "../components/RepoInput";
import LoadingSpinner from "../components/LoadingSpinner";
import ContributionBar from "../components/ContributionBar";
import ActivityHeatmap from "../components/ActivityHeatmap";
import ContributorCard from "../components/ContributorCard";

import { analyzeRepo } from "../services/api";
import usePollJob from "../hooks/usePollJob";

export default function DashboardPage() {
  const [jobId, setJobId] = useState(null);

  const { status, data } = usePollJob(jobId);

  const handleAnalyze = async (repoUrl) => {
    try {
      const res = await analyzeRepo(repoUrl);
      setJobId(res.job_id);
    } catch (err) {
      console.error("Analyze error:", err);
      alert("Failed to start analysis");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex justify-center">
      <div className="w-full max-w-6xl px-6 py-8 text-gray-200">

        {/* HEADER */}
        <h1 className="text-3xl font-semibold text-center mb-8">
          Pulse Dashboard
        </h1>

        {/* INPUT */}
        <RepoInput onAnalyze={handleAnalyze} />

        {/* STATUS */}
        {status && (
          <p className="text-center text-sm text-gray-400 mt-2">
            Status: {status}
          </p>
        )}

        {/* LOADING */}
        {status === "running" && (
          <div className="mt-6 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {/* MAIN DASHBOARD */}
        {data && data.ai && (
          <>
            {/* REPO HEADER */}
            <div className="flex items-center justify-between bg-[#161b22] p-4 rounded border border-gray-800 mt-10">

            <div>
                <h2 className="text-lg font-semibold">
                {data.owner} / {data.repo_name}
                </h2>
                <p className="text-sm text-gray-400">
                {data.language}
                </p>
            </div>

            <div className="flex gap-6 text-sm text-gray-400">
                <span>⭐ {data.stars}</span>
                <span>🍴 {data.forks}</span>
                <span>🐛 {data.open_issues}</span>
            </div>

            </div>  
            {/* OVERVIEW CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-[#161b22] p-5 rounded border border-gray-800 hover:border-gray-600 transition">
                    <p className="text-xs text-gray-400 uppercase">Health Score</p>
                    <h2 className="text-3xl font-semibold mt-2">
                    {data.ai.health_score}
                    </h2>
                </div>

                <div className="bg-[#161b22] p-5 rounded border border-gray-800 hover:border-gray-600 transition">
                    <p className="text-xs text-gray-400 uppercase">Impact Score</p>
                    <h2 className="text-3xl font-semibold mt-2">
                    {data.ai.impact_score}
                    </h2>
                </div>

                <div className="bg-[#161b22] p-5 rounded border border-gray-800 hover:border-gray-600 transition">
                    <p className="text-xs text-gray-400 uppercase">Bus Factor</p>
                    <h2 className="text-3xl font-semibold mt-2">
                    {data.ai.bus_factor?.bus_factor}
                    </h2>
                </div>

            </div>
            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

              <div className="bg-[#161b22] p-4 rounded border border-gray-800">
                <h2 className="font-semibold mb-4">
                  Contributions
                </h2>
                <ContributionBar data={data.contributors} />
              </div>

              <div className="bg-[#161b22] p-4 rounded border border-gray-800">
                <h2 className="font-semibold mb-4">
                  Commit Activity
                </h2>
                <ActivityHeatmap data={data.commit_activity} />
              </div>

            </div>

            {/* CONTRIBUTORS */}
            <div className="bg-[#161b22] p-4 rounded border border-gray-800 mt-10">
              <h2 className="font-semibold mb-4">
                Top Contributors
              </h2>
              <ContributorCard contributors={data.contributors} />
            </div>

            {/* SUMMARY */}
            <div className="bg-[#161b22] p-4 rounded border border-gray-800 mt-10">
              <h2 className="font-semibold mb-2">
                Summary
              </h2>
              <p className="text-gray-400">
                {data.ai.summary || "No summary available"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}