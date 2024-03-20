import fs from "fs";
import path from "path";
import prompt from "prompts";
import { askAI } from "./lib/api";

const PROMPTS_DIR = "prompts";
const DATA_FILE = "data.json";
const MODEL = "gpt-3.5-turbo";

interface Paragraph {
  source: string;
  translations: { id: string; content: string }[];
}

interface DataSource {
  id: string;
  paragraphs: Paragraph[];
}

interface Data {
  papers: DataSource[];
}

const loadPrompts = () => {
  const promptFiles = fs.readdirSync(PROMPTS_DIR);
  const prompts = promptFiles.map((file) => {
    const fullPath = path.join(process.cwd(), PROMPTS_DIR, file);
    const { prompt } = require(fullPath);
    return { file, prompt };
  });
  return prompts;
};

const loadData = () => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  return data as Data;
};

const saveData = (data: Data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

const runPrompt = async (
  file: string,
  prompt: string,
  paragraph: Paragraph
) => {
  const response = await askAI(MODEL, `${prompt}\n"${paragraph.source}"`);
  paragraph.translations.push({ id: file, content: response ?? "" });
};

const main = async () => {
  const prompts = loadPrompts();
  const data = loadData();

  const { promptChoice } = await prompt({
    type: "select",
    name: "promptChoice",
    message: "Which prompt would you like to run?",
    choices: [
      { title: "All prompts", value: "all" },
      ...prompts.map(({ file }) => ({
        title: file,
        value: file,
      })),
    ],
  });

  for (const paper of data.papers) {
    for (const paragraph of paper.paragraphs) {
      if (promptChoice === "all") {
        for (const { file, prompt } of prompts) {
          await runPrompt(file, prompt, paragraph);
        }
      } else {
        const selectedPrompt = prompts.find(
          ({ file }) => file === promptChoice
        );
        if (selectedPrompt) {
          const { file, prompt } = selectedPrompt;
          await runPrompt(file, prompt, paragraph);
        }
      }
    }
  }

  saveData(data);
};

main();
