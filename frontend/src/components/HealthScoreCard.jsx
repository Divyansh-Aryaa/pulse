
// this is health score card // 

export default function HealthScoreCard({ score }) {
  return (
    <div className="border p-4 my-4 rounded bg-gray-800">
      <h2 className="text-lg font-bold">Health Score</h2>
      <p className="text-2xl">{score}</p>
    </div>
  );
}