import { createContext, useState } from "react";

export const RepoContext = createContext();

export const RepoProvider = ({ children }) => {
  const [repoData, setRepoData] = useState(null);

  return (
    <RepoContext.Provider value={{ repoData, setRepoData }}>
      {children}
    </RepoContext.Provider>
  );
};