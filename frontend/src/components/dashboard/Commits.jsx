export default function Commits({ list }) {
  return (
    <div className="glass neon bg-white/10 p-4 rounded-xl">
      <h3 className="text-xl mb-3">Commits</h3>

      {list.map((c, i) => (
        <div key={i} className="border-b border-gray-700 py-2">
          <p>{c.message}</p>
          <small>
            {c.author} | {c.date}
          </small>
        </div>
      ))}
    </div>
  );
}