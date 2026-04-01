// this is summary card //

export default function SummaryCard({ summary }) {
  return (
    <div className="border p-4 my-4">
      <h2>Summary</h2>
      <p>{summary || "No summary available"}</p>
    </div>
  );
}