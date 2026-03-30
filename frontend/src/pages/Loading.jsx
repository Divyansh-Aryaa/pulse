import { useEffect, useState } from "react";

// UPDATED: steps moved outside for better control
const steps = [
  "Fetching repository data...",
  "Analyzing commits...",
  "Evaluating contributors...",
  "Generating AI insights...",
];

export default function Loading() {
  // UPDATED: typing effect states
  const [text, setText] = useState("");
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    let i = 0;

    // UPDATED: typing animation logic
    const typing = setInterval(() => {
      setText(steps[stepIndex]?.slice(0, i));
      i++;

      if (i > steps[stepIndex]?.length) {
        clearInterval(typing);

        setTimeout(() => {
          setStepIndex((prev) => prev + 1);
          setText("");
        }, 1500);
      }
    }, 30);

    return () => clearInterval(typing);
  }, [stepIndex]);

  return (
    // UPDATED: premium centered UI + glow
    <div className="h-screen flex flex-col items-center justify-center bg-[#020617] text-white">
      
      {/* UPDATED: glowing heading */}
      <div className="text-2xl mb-5 animate-pulse glow-text">
        ⚡ Processing...
      </div>

      {/* UPDATED: typing effect text */}
      <div className="text-cyan-400 text-lg">
        {text}
      </div>
    </div>
  );
}