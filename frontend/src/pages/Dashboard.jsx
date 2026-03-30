
// Dashboard code //
import { useContext, useEffect, useState } from "react"; // UPDATED: added useEffect & useState
import { RepoContext } from "../context/RepoContext";
import RepoHeader from "../components/dashboard/RepoHeader";
import InsightCards from "../components/dashboard/InsightCards";
import Charts from "../components/dashboard/Charts";
import Contributors from "../components/dashboard/Contributors";
import Commits from "../components/dashboard/Commits";
import { motion } from "framer-motion"; // UPDATED: animation library
import Navbar from "../components/common/Navbar";

export default function Dashboard() {
  const { repoData } = useContext(RepoContext);

  const [step, setStep] = useState(0); // UPDATED: step-based reveal
  // const[data, setData] = useState(null);
  // UPDATED: section-by-section animation timing
  useEffect(() => {
  const interval = setInterval(() => {
    setStep((prev) => {
      if (prev >= 4) {
        clearInterval(interval);
        return prev;
      }
      return prev + 1;
    });
  }, 600);

  return () => clearInterval(interval);
  }, []);

  if (!repoData) return <div className="text-white">No Data</div>;

  return (
    <div className="bg-[#020617] text-white p-6 space-y-6 min-h-screen">

      <Navbar />

      {/* UPDATED: Animated Repo Header */}
      {step >= 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <RepoHeader repo={repoData.repo} />
        </motion.div>
      )}

      {/* UPDATED: Animated Insights */}
      {step >= 1 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <InsightCards insights={repoData.insights} ai={repoData.ai} />
        </motion.div>
      )}

      {/* UPDATED: Animated Charts */}
      {step >= 2 && (
        <motion.div
        layout
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        >
        <div className="w-full min-h-75">
        <Charts data={repoData} ai={repoData.ai} />
        </div>
        </motion.div>
      )}

      {/* UPDATED: Animated Contributors */}
      {step >= 3 && (
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Contributors contributors={repoData.contributors} ai={repoData.ai} />
        </motion.div>
      )}

      {/* UPDATED: Animated Commits */}
      {step >= 4 && (
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Commits list={repoData.commits} />
        </motion.div>
      )}


      <section id="about" className="py-24 px-6 border-t border-white/5 bg-[#0d1321]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-cyan-400 mb-8 flex items-center gap-3">
            <span className="h-px w-12 bg-cyan-500/50"></span>
            About PageDone
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-400 leading-relaxed">
            <p>
              PageDone is a specialized tool designed to bring clarity to complex GitHub repositories. 
              By analyzing commit frequency, developer impact, and language distribution, we provide 
              a high-level "Pulse" of any open-source or private project.
            </p>
            <p>
              Built as part of an advanced engineering assessment, this platform integrates 
              Hugging Face AI (Kimi-K2) to generate human-like summaries and developer personas, 
              turning raw data into actionable insights.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CONTACT & FEEDBACK SECTION (Two columns) */}
      <section id="contact" className="py-24 px-6 bg-[#0f172a] border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Contact Details */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-6 italic">Connect</h2>
            <p className="text-gray-400 mb-8">Have questions about the analysis or the tech stack? Reach out to the developer.</p>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer">
                <p className="text-xs text-cyan-400 uppercase">Developer</p>
                <p className="font-bold">Divyansh Shukla</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer">
                <p className="text-xs text-cyan-400 uppercase">Education</p>
                <p className="font-bold">B.Tech Final Year, HBTU</p>
              </div>
            </div>
          </div>

          {/* Feedback Form */}
          <div id="feedback" className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Feedback</h3>
            <textarea 
              className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-sm mb-4 h-32 outline-none focus:border-cyan-500 transition-all"
              placeholder="How can I make the AI insights more accurate?"
            ></textarea>
            <button className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20">
              Send Feedback
            </button>
          </div>

        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-8 text-center text-gray-600 text-[10px] uppercase tracking-widest border-t border-white/5">
        Designed & Developed by Divyansh Shukla © 2026
      </footer>


    </div>
  );
}