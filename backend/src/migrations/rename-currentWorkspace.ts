import "dotenv/config";
import mongoose from "mongoose";
import { config } from "../config/app.config";

async function renameField() {
  await mongoose.connect(config.MONGO_URI);

  const User = mongoose.model(
    "User",
    new mongoose.Schema({}, { strict: false }),
    "users"
  );

  const result = await User.updateMany(
    { currentWorkSpace: { $exists: true } },
    { $rename: { currentWorkSpace: "currentWorkspace" } }
  );

  console.log(
    `Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`
  );

  await mongoose.disconnect();
}

renameField()
  .then(() => {
    console.log("Field rename complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error renaming field:", err);
    process.exit(1);
  });
