import fs from "fs";
import prompts from "prompts";

const DATA_FILE = "data.json";

interface Translation {
  id: string;
  content: string;
}

interface Paragraph {
  source: string;
  translations: Translation[];
}

interface DataSource {
  id: string;
  paragraphs: Paragraph[];
}

interface Data {
  papers: DataSource[];
}

const loadData = () => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  return data as Data;
};

const saveData = (data: Data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

const compareTranslations = async (paragraph: Paragraph) => {
  const translations = [
    { id: "source", content: paragraph.source },
    ...paragraph.translations,
  ];
  const rankings: Record<string, number> = {};

  for (const translation of translations) {
    rankings[translation.id] = 0;
  }

  const comparisons: [Translation, Translation][] = [];
  for (let i = 0; i < translations.length; i++) {
    for (let j = i + 1; j < translations.length; j++) {
      comparisons.push([translations[i], translations[j]]);
    }
  }

  for (const [a, b] of comparisons) {
    const { value } = await prompts({
      type: "select",
      name: "value",
      message: `Which translation is better?\n\n${a.content}\n\n---\n\n${b.content}`,
      choices: [
        { title: "First one", value: "first" },
        { title: "Second one", value: "second" },
        { title: "They are equal", value: "equal" },
      ],
    });

    if (value === "first") {
      rankings[a.id]++;
    } else if (value === "second") {
      rankings[b.id]++;
    }
  }

  const sortedRankings = Object.entries(rankings).sort((a, b) => b[1] - a[1]);
  return sortedRankings.map(([id], index) => ({ id, rank: index + 1 }));
};

const main = async () => {
  const data = loadData();

  for (const paper of data.papers) {
    for (const paragraph of paper.paragraphs) {
      const rankings = await compareTranslations(paragraph);
      paragraph.translations = rankings.map(({ id, rank }) => {
        const translation = paragraph.translations.find((t) => t.id === id);
        if (translation) {
          return { ...translation, rank };
        } else if (id === "source") {
          return { id: "source", content: paragraph.source, rank };
        } else {
          throw new Error(`Translation with id ${id} not found`);
        }
      });
    }
  }

  saveData(data);
};

main();
