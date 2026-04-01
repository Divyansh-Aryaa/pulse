
// this is Contributor card code //

export default function ContributorCard({ contributors }) {
  return (
    <div className="space-y-2">
      {contributors.slice(0, 8).map((c, i) => (
        <div
          key={i}
          className="flex justify-between text-sm border-b border-gray-800 pb-2"
        >
          <span className="text-gray-300">{c.name}</span>
          <span className="text-gray-400">{c.commits}</span>
        </div>
      ))}
    </div>
  );
}