export default function RepoHeader({ repo }) {
  return (
    <div className="glass neon bg-white/10 p-5 rounded-xl text-center">
      <h2 className="text-2xl glow-text font-bold text-cyan-400">{repo?.repo_name || repo?.name || "Unknown Repository"}</h2>
      {/* GitHub API returns owner as an object, or sometimes just a login string depending on your service */}
      <p className="glow-text text-gray-300">Owner: {repo?.owner}</p>
      
      <div className="flex justify-center gap-6 mt-3 text-lg">
        {/* Note the specific GitHub naming: stargazers_count, forks_count, open_issues_count */}
        <span title="Stars">⭐ {repo?.stars }</span>
        <span title="Forks">🍴 {repo?.forks }</span>
        <span title="Issues">🐞 {repo?.open_issues }</span>
      </div>
      
      {/* Primary language */}
      <p className="mt-2 text-sm text-gray-400 italic">
        🧠 Primary Language: {repo?.language || "Not specified"}
      </p>
    </div>
  );
}