'use client';
import { useState } from "react";
import QuestionCard from "./questioncard";

interface Question {
  id: number;
  question: string;
  answer: string;
  options: string[];
};

export default function Home() {

  const [topic, setTopic] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("Easy");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [enableRefresh, setEnableRefresh] = useState(false);
  const [touched, setTouched] = useState(false);

  const isError = touched && topic === "";

  const handleCreate = async () => {
    setLoading(true);
    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic, difficulty }),
    });

    const data = await response.json();
    console.log("Frontend recieved:", data);
   
    setQuestions(data.questions);
    setLoading(false);
    setTouched(false);
    setEnableRefresh(true);
    
  }

  const handleRefresh = () => {
    setQuestions([]);
    setTopic("");
    setDifficulty("Easy");
    setEnableRefresh(false);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 gap-2">
      <h1 className="text-4xl font-bold mb-8">AI Quiz Generator</h1>
      <input className={`border p-2 rounded ${isError ? "border-red-500" : "border-gray-300"}`} type="text" placeholder="Enter topic" value={topic} onChange={(e) => setTopic(e.target.value) }  onBlur={() => setTouched(true)} />
      <select className="border p-2 rounded" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
      <button className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400" onClick={handleCreate} disabled={loading || topic === ""}>{loading ? "Generating..." : "Generate Quiz"}</button>

      <div className="mt-8 w-3xl">
        {questions.map((q) => (
          <QuestionCard key={q.id} question={q.question} answer={q.answer} options={q.options} />
        ))}
      </div>

      {enableRefresh && <button className="bg-red-500 text-white p-2 rounded" onClick={handleRefresh}>Refresh</button>}
    </main>
  );
}

