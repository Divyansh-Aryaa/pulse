
// Write your code here // 
import axios from "axios";

export const analyzeRepo = async (url) => {
  const res = await axios.post("http://127.0.0.1:8000/analyze-repo", {
    repo_url: url,
  });
  return res.data;
};