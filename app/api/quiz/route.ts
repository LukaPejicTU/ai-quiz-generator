import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  
  const body = await req.json();
  const {topic, difficulty} = body;

  console.log("Generating quiz for:", topic, difficulty);

  const systemPrompt = `
    You are a quiz generator. 
    Output ONLY valid JSON. 
    The JSON structure must be:
    {
      "questions": [
        {
          "id": 1,
          "question": "Question text",
          "answer": "The correct answer",
          "options": ["Option A", "Option B", "Option C", "The correct answer"]
        }
      ]
    }
    Generate 3 questions.
    Ensure 'options' contains 4 choices, including the correct answer, shuffled randomly.
  `;

  const completion = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Topic: ${topic}. Difficulty: ${difficulty}` },
    ],
  });

  let aiContent = completion.choices[0].message.content;

  if (aiContent) {
    aiContent = aiContent.replace(/```json/g, "").replace(/```/g, "").trim();
  }

  const data = JSON.parse(aiContent || "{}");

  return NextResponse.json(data);

}