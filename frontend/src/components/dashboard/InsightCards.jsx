// 🔥 UPDATED: InsightCards.jsx

export default function InsightCards({ insights, ai }) {

  // 🔥 GUARD: PREVENT CRASH IF NO DATA
  if (!insights && !ai) return null;

  return (
    <div className="space-y-6">

      {/* 🔥 NEW: AI SUMMARY SECTION (TOP PRIORITY FOR EVALUATION) */}
      {ai?.summary && (
        <div className="glass neon p-5 rounded-xl border border-cyan-400">
          
          <h2 className="text-lg mb-2 text-cyan-300">
            🧠 PageDone Overview (AI)
          </h2>

          {/* 🔥 AI GENERATED TEXT */}
          <p className="italic text-gray-300 leading-relaxed">
            {ai.summary}
          </p>

          {/* 🔥 IMPACT SCORE */}
          <div className="mt-4 text-sm text-cyan-400">
            🚀 Impact Score: <span className="font-bold">{ai.impact_score}</span>
          </div>
        </div>
      )}

      {/* 🔥 EXISTING INSIGHTS (COLORED CARDS) */}
      <div className="glass neon grid grid-cols-1 md:grid-cols-3 gap-4">

        {insights?.map((item, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105
              ${
                item.type === "danger"
                  ? "bg-red-500"
                  : item.type === "warning"
                  ? "bg-yellow-400 text-black"
                  : "bg-green-500"
              }`}
          >
            {/* 🔥 MESSAGE */}
            <p className="font-semibold">{item.message}</p>
          </div>
        ))}

      </div>
    </div>
  );
}