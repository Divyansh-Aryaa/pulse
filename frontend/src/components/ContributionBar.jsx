
// this is contribution chart bar code //

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ContributionBar({ data }) {
  const chartData = data.slice(0, 10);

  return (
    <div className="border p-4 my-4 rounded bg-gray-800">
      <h2 className="font-bold mb-2">Contributions</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="commits" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}