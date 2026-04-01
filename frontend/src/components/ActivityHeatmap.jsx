// this is the Activity Heatmap code // 

export default function ActivityHeatmap({ data }) {
  return (
    <div className="border p-4 my-4 rounded bg-gray-800">
      <h2 className="font-bold">Commit Activity</h2>

      {data.slice(0, 5).map((week, i) => (
        <p key={i}>
          Week: {week.week} → {week.total_commits}
        </p>
      ))}
    </div>
  );
}