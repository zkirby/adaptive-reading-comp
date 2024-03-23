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
      if (translations[i].id !== translations[j].id) {
        comparisons.push([translations[i], translations[j]]);
      }
    }
  }

  let remainingComparisons = comparisons.length;
  for (const [a, b] of comparisons) {
    const { value } = await prompts({
      type: "select",
      name: "value",
      message: `\n\n--------------------\nWhich translation is better?\n\n${a.content}\n\n---\n\n${b.content}\n\nRemaining comparisons for this paragraph: ${remainingComparisons}`,
      choices: [
        { title: "First one", value: "first" },
        { title: "Second one", value: "second" },
        { title: "They are equal", value: "equal" },
      ],
    });

    remainingComparisons--;

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

  const { paperChoice } = await prompts({
    type: "select",
    name: "paperChoice",
    message: "Which papers would you like to rank?",
    choices: [
      { title: "All papers", value: "all" },
      ...data.papers.map(({ id }, index) => ({
        title: `Paper ${index + 1}: ${id}`,
        value: id,
      })),
    ],
  });

  let totalComparisons = 0;
  const papersToRank =
    paperChoice === "all"
      ? data.papers
      : [data.papers.find((paper) => paper.id === paperChoice)!];

  for (const paper of papersToRank) {
    console.log(`Ranking paper: ${paper.id}`);
    for (const paragraph of paper.paragraphs) {
      totalComparisons +=
        (paragraph.translations.length * (paragraph.translations.length + 1)) /
        2;
    }
  }

  let remainingComparisons = totalComparisons;

  for (const paper of papersToRank) {
    console.log(`Ranking paper: ${paper.id}`);
    for (const paragraph of paper.paragraphs) {
      console.log(`Paragraph: ${paragraph.source.slice(0, 50)}...`);
      const rankings = await compareTranslations(paragraph);
      paragraph.translations = rankings.map(({ id, rank }) => {
        const translation = paragraph.translations.find((t) => t.id === id);
        if (translation) {
          remainingComparisons -= paragraph.translations.length;
          return { ...translation, rank };
        } else if (id === "source") {
          remainingComparisons -= paragraph.translations.length;
          return { id: "source", content: paragraph.source, rank };
        } else {
          throw new Error(`Translation with id ${id} not found`);
        }
      });
      console.log(`Remaining comparisons: ${remainingComparisons}`);
    }
  }

  saveData(data);
};

main();
