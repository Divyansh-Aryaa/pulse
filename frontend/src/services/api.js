
// Write your code here // 

const BASE_URL = "http://localhost:8000";

export const analyzeRepo = async (repoUrl) => {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ repo_url: repoUrl }),
  });

  return res.json();
};

export const getResults = async (jobId) => {
  const res = await fetch(`${BASE_URL}/results/${jobId}`);
  return res.json();
};