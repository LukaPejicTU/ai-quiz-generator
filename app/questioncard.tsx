'use client'

import { useState } from "react";

interface Props {
  question: string;
  answer: string;
  options: string[];
};

export default function QuestionCard(props: Props) {

  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleClick = () => {
    setSelectedOption(props.answer);
  }
  
  const handleCheck = (selectedOption: string) => {
    setSelectedOption(selectedOption);
  }

  return (
    <div className="flex flex-col items-center justify-center border p-4 rounded bg-gray-100">
      <p>{props.question}</p>
      {props.options.map((o) => (
        <button key={o} className={`border rounded p-1 m-0.5 ${
            o === selectedOption && o === props.answer
            ? "bg-green-100 border-green-500"
            : o === selectedOption
            ? "bg-red-100 border-red-500"
            : "bg-blue-100 border-blue-500"
        }`} onClick={() => handleCheck(o)}>
            {o}
        </button>
      ))}
      <button onClick={handleClick} className=" bg-blue-500 border-2 rounded p-1 text-white">Reveal Answer</button>
    </div>
    
  );
}