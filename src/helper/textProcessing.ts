import { fillerWords } from "./lib";

export function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[.,/#!$%^&*;:{}=\-_`~()@"']|\b\d+\b/g, "") //remove common punctuation, quotes,etc
    .replace(/\s{2,}/g, " ") //replace multiple spaces with a single one
    .trim();
}

export function extractKeywords(
  text: string
): { topic: string; frequency: number }[] {
  const cleaned = cleanText(text);
  // console.log("text", cleaned);

  const words = cleaned.split(" ").filter(
    (word) => word.length > 2 && !fillerWords.has(word) && !/^\d+$/.test(word) //remove numbers
  );

  const wordCounts: { [word: string]: number } = {};
  words.forEach((word) => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  }); //sample={ "project": 5, "data": 3, "tool": 1 }.

  return Object.entries(wordCounts) // becomes [ ["project", 5], ["data", 3], ["tool", 1] ]
    .map(([topic, frequency]) => ({ topic, frequency })) //map as objects
    .filter((item) => item.frequency > 1)
    .sort((a, b) => b.frequency - a.frequency) //descending
    .slice(0, 10);
}
