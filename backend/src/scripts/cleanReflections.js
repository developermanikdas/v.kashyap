import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootStoriesPath = path.resolve(__dirname, "../../../data/stories.json");
const frontendStoriesPath = path.resolve(__dirname, "../../../frontend/src/data/stories.json");

const raw = JSON.parse(fs.readFileSync(rootStoriesPath, "utf-8"));
const cleaned = (Array.isArray(raw) ? raw : raw.stories || []).map((story) => {
  const { reflections, ...rest } = story;
  return {
    ...rest,
    reflections: []
  };
});

fs.writeFileSync(rootStoriesPath, JSON.stringify(cleaned, null, 2), "utf-8");
fs.writeFileSync(frontendStoriesPath, JSON.stringify(cleaned, null, 2), "utf-8");
console.log("Successfully removed all pre-existing reflections from stories.json");
