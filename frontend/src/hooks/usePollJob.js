
// write you code here // 

import { useEffect, useState } from "react";
import { getResults } from "../services/api";

export default function usePollJob(jobId) {
  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const res = await getResults(jobId);

      setStatus(res.status);

      if (res.status === "completed") {
        setData(res.result);
        clearInterval(interval);
      }

      if (res.status === "failed") {
        clearInterval(interval);
        alert("Analysis failed");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  return { status, data };
}