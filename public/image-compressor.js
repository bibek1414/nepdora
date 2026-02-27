const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Configuration
const TARGET_DIR = path.join(__dirname, "images"); // Adjust if you want to run on the whole public folder
const SIZE_THRESHOLD = 100 * 1024; // 500KB
const QUALITY = 80; // 0-100

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

async function compress() {
  const files = getAllFiles(TARGET_DIR);
  console.log(`Checking ${files.length} files...`);

  for (const file of files) {
    const stats = fs.statSync(file);
    const ext = path.extname(file).toLowerCase();

    // Only process large images (PNG, JPG, WEBP)
    if (
      stats.size > SIZE_THRESHOLD &&
      [".png", ".jpg", ".jpeg", ".webp"].includes(ext)
    ) {
      const oldSize = (stats.size / 1024).toFixed(2);
      const tmpFile = file + ".tmp";

      try {
        console.log(`Compressing: ${file} (${oldSize} KB)`);

        await sharp(file)
          .withMetadata() // Keeps orientation info
          .toFormat(ext.replace(".", ""), { quality: QUALITY, effort: 6 })
          .toFile(tmpFile);

        // Replace original with compressed version
        fs.renameSync(tmpFile, file);

        const newSize = (fs.statSync(file).size / 1024).toFixed(2);
        console.log(
          `Done! Reduced to ${newSize} KB (${Math.round((1 - newSize / oldSize) * 100)}% saved)`
        );
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
}

compress();
