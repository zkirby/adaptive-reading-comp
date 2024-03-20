import OpenAI from "openai";

const openai = new OpenAI();

interface ChatResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function askAI(
  model: "gpt-3.5-turbo" | "gpt-4",
  content: string
): Promise<string | null> {
  const chatCompletionStream = await openai.chat.completions.create({
    messages: [{ role: "user", content }],
    temperature: 0,
    stream: true,
    model,
  });

  let response = "";
  for await (const chunk of chatCompletionStream) {
    const chunkText = chunk.choices[0]?.delta?.content || "";
    response += chunkText;
    process.stdout.write(chunkText);
  }

  return response;
}
