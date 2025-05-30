import "dotenv/config";
import mongoose from "mongoose";
import { config } from "../config/app.config";

async function renameProjectDescriptionToEmoji() {
  await mongoose.connect(config.MONGO_URI);

  // Use a loose schema for the migration
  const Project = mongoose.model(
    "Project",
    new mongoose.Schema({}, { strict: false }),
    "projects" // Explicitly name the collection
  );

  const result = await Project.updateMany(
    { description: { $exists: true } },
    { $rename: { description: "emoji" } }
  );

  console.log(
    `Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`
  );

  await mongoose.disconnect();
}

renameProjectDescriptionToEmoji()
  .then(() => {
    console.log("Migration complete: 'description' → 'emoji'");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
