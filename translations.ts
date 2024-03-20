import fs from "fs";
import prompts from "prompts";
import wrap from "word-wrap";

const DATA_FILE = "data.json";

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

const loadData = () => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  return data as Data;
};

const displayParagraph = (paragraph: Paragraph) => {
  console.log("Source:");
  console.log(
    wrap(paragraph.source, { width: process.stdout.columns - 2, indent: "" })
  );
  console.log();

  const sortedTranslations = [...paragraph.translations];
  sortedTranslations.sort(
    (a, b) => (b.rank ?? Infinity) - (a.rank ?? Infinity)
  );

  for (const translation of sortedTranslations) {
    console.log(`Translation (${translation.id}):`);
    console.log(
      wrap(translation.content, {
        width: process.stdout.columns - 2,
        indent: "",
      })
    );
    console.log();
  }
};

const main = async () => {
  const data = loadData();

  const { paperChoice } = await prompts({
    type: "select",
    name: "paperChoice",
    message: "Select a paper to view:",
    choices: data.papers.map(({ id }, index) => ({
      title: `Paper ${index + 1}: ${id}`,
      value: id,
    })),
  });

  const selectedPaper = data.papers.find((paper) => paper.id === paperChoice);

  if (!selectedPaper) {
    console.error(`Paper with ID ${paperChoice} not found.`);
    return;
  }

  for (const paragraph of selectedPaper.paragraphs) {
    displayParagraph(paragraph);
    console.log("-------------------------------------------");
  }
};

main();
