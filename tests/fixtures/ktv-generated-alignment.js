const fs = require("node:fs");
const path = require("node:path");

const outputPath = process.env.KTV_ALIGNMENT_PATH;
if (!outputPath) {
  throw new Error("KTV_ALIGNMENT_PATH is required");
}

const lines = [
  { start: 0, end: 2.4, text: "Generated first lyric line for automatic KTV extraction" },
  { start: 2.4, end: 4.8, text: "Generated second lyric line keeps the timing aligned" },
  { start: 4.8, end: 7.2, text: "Generated third lyric line comes from the vocal transcript" },
  { start: 7.2, end: 9.6, text: "Generated fourth lyric line is long enough to pass readiness" },
].map((line, index) => ({
  index,
  ...line,
  transcript: line.text,
  similarity: 1,
  asrSegmentIndexes: [index],
}));

const generatedLyrics = lines
  .map((line) => `[${formatLrcTime(line.start)}]${line.text}`)
  .join("\n");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(
  outputPath,
  JSON.stringify(
    {
      version: 1,
      source: "vocal-asr-generated-lyrics",
      model: "test-generated-asr",
      duration: 9.6,
      lineCount: lines.length,
      lines,
      generatedLyrics,
      transcription: {
        model: "test-generated-asr",
        language: "en",
        text: lines.map((line) => line.text).join(" "),
        segments: lines,
      },
      quality: {
        label: "asr-generated",
        averageSimilarity: 1,
        matchedLineCount: lines.length,
        segmentCount: lines.length,
        warnings: [],
      },
    },
    null,
    2,
  ),
);

function formatLrcTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds - minutes * 60;
  return `${String(minutes).padStart(2, "0")}:${remaining.toFixed(2).padStart(5, "0")}`;
}
