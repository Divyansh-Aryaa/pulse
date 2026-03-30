
// Homepage code // 
import RepoInput from "../components/home/RepoInput";
import Navbar from "../components/common/Navbar"; // Make sure to create this file!

export default function Home() {
  return (
    <div className="bg-[#0f172a] min-h-screen text-white scroll-smooth">
      {/* 1. The Sticky Navbar stays at the top */}
      <Navbar />

      {/* 2. HERO SECTION: This is your current screen, now as the first section */}
      <section className="h-[90vh] flex flex-col items-center justify-center px-4">
        <div className="relative group">
          {/* Subtle glow behind your RepoInput */}
          <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          
          <div className="relative">
            <RepoInput />
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="mt-12 animate-bounce opacity-50 text-xs uppercase tracking-widest">
          Scroll to explore ↓
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
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