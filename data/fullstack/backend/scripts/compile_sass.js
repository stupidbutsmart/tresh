const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const inputPath = "./public/sass/";

// only supports one nested level
(function compileSass(scssPath, subfolder = "") {
  fs.readdir(scssPath, { withFileTypes: true }, (err, files) => {
    if (err) return console.error(err);

    // compiling
    for (const file of files) {
      if (file.isDirectory()) {
        const subfolderPath = path.join(file.parentPath, file.name);
        // recursive call
        compileSass(subfolderPath, file.name);
      }

      const fileName = file.name.split(".").slice(0, -1).join(".");
      const filePath = path.join(scssPath, fileName);
      const resultPath = path.join("./public/css/", subfolder, fileName);
      if (!file.name.endsWith(".scss")) continue;

      console.log(`Compiling ${fileName}.scss to ${resultPath}.css`);
      execSync(
        `npx sass ${filePath}.scss ${resultPath}.css -q --style=compressed
        `
      );
      // done with compiling
      console.log(`Compiled ${fileName}.scss to ${resultPath}.css`);
    }

    // on done
  });
})(inputPath, "");
