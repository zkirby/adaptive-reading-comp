import fs from "fs";
import prompts from "prompts";

interface Translation {
  id: string;
  content: string;
  rank?: number;
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

const DATA_FILE = "data.json";

const loadData = () => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  return data as Data;
};

const getOverallRankings = (data: Data) => {
  const rankings: Record<string, number> = {};

  for (const paper of data.papers) {
    for (const paragraph of paper.paragraphs) {
      for (const translation of paragraph.translations) {
        if (translation.rank !== undefined) {
          rankings[translation.id] =
            (rankings[translation.id] || 0) + translation.rank;
        }
      }
    }
  }

  const sortedRankings = Object.entries(rankings)
    .sort((a, b) => a[1] - b[1])
    .map(([id, rank], index) => ({ id, rank: index + 1, score: rank }));

  return sortedRankings;
};

const displayOverallRankings = (
  overallRankings: { id: string; rank: number; score: number }[]
) => {
  console.log("Overall Rankings:");
  for (const { id, rank, score } of overallRankings) {
    console.log(`${rank} (${score}). ${id}`);
  }
};

const displayParagraphRankings = (paragraph: Paragraph) => {
  const sortedTranslations = [...paragraph.translations];
  sortedTranslations.sort(
    (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity)
  );

  console.log("Source:", paragraph.source.slice(0, 50), "...");
  for (const translation of sortedTranslations) {
    console.log(`${translation.rank ?? "-"}. ${translation.id}`);
  }
  console.log();
};

const main = async () => {
  const data = loadData();

  const { showParagraphRankings } = await prompts({
    type: "confirm",
    name: "showParagraphRankings",
    message: "Do you want to show rankings for each paragraph?",
    initial: false,
  });

  const overallRankings = getOverallRankings(data);
  displayOverallRankings(overallRankings);

  if (showParagraphRankings) {
    console.log();
    for (const paper of data.papers) {
      for (const paragraph of paper.paragraphs) {
        displayParagraphRankings(paragraph);
      }
    }
  }
};

main();
