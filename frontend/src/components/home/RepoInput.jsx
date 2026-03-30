import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeRepo } from "../../services/api";
import { RepoContext } from "../../context/RepoContext";
import { motion } from "framer-motion";

export default function RepoInput() {
  const [url, setUrl] = useState("");
  const { setRepoData } = useContext(RepoContext);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    navigate("/loading");

    try {
      const data = await analyzeRepo(url);
      setRepoData(data);

      setTimeout(() => {
        navigate("/dashboard");
      }, 4000);
    } catch (err) {
      alert("Error fetching repo");
      navigate("/");
    }
  };

  return (
    <motion.div className="glass neon p-10 text-center bg-white/10 rounded-2xl backdrop-blur-lg shadow-xl">
      <h1 className="text-4xl mb-6 glow-text font-bold">
        GitHub Analyzer ⚡
      </h1>

      <input
        type="text"
        placeholder="Enter GitHub Repo URL"
        className="p-3 w-80 rounded-lg text-black"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <br />

      <button
        onClick={handleAnalyze}
        className="mt-5 px-6 py-2 bg-cyan-400 text-black rounded-lg neon hover:bg-cyan-300"
      >
        Analyze 🚀
      </button>
    </motion.div>
  );
}