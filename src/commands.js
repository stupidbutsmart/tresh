import color from "colors/safe.js";
import inquirer from "inquirer";
import nano, { createSpinner } from "nanospinner";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { stderr } from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sleep = (ms = 2000) => {
  return new Promise((r) => setTimeout(r, ms));
};

// rebinding the run cmd to make it awaitable
function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(`powershell -Command "${cmd}"`, (error, stdout, stderr) => {
      if (error || stderr) reject(stderr)
      resolve(stdout);
    })
  })
}
/**
 *
        const questions = [
          {
            name: "name",
            type: "input",
            message: "What is the Project Name?",
            default() {
              return process.cwd().split("\\").pop();
            },
          },
          {
            name: "framework",
            type: "list",
            message: "What framework?",
            choices: ["react", "express.js", "bootstrap", "vanila"],
          },
        ];
        const project = await inquirer.prompt(questions);
        options.push(`--${project.framework}`, project.name);
 */
const cmdModule = {
  "create-website": {
    alias: ["cw", "create_web", "createwebsite", "notes", "take_notes"],
    description: "Creates a website using one of the selected templates",
    options: [],
    execute: async function (args) {
      // 1 what kinda website
      //  - full stack (express + react)
      //  - react
      //  - Vanila
      //  - MKDOcs (notes)
      //
      //  2 run exec to create those projects 
      //  3 copy template files and folders
      //  4 yay
      try {
        const pwd = process.cwd();

        // get website type
        const questions = [
          {
            name: "projectName",
            type: "input",
            message: "Name of the Project",
            default() {
              return pwd.split('\\').pop();
            }
          },
          {
            name: "framework",
            type: "list",
            message: "What Framework?",
            choices: ['Full Stack (express + react)', 'React + Vite', 'Vanila', 'MKDocs (Notes)']
          }
        ]
        const { framework, projectName } = await inquirer.prompt(questions)
        const newProjectPath = path.join(pwd, args[0], projectName);
        // checking for path if contains stuff
        if (fs.existsSync(newProjectPath)) {
          const question = [
            {
              name: "allow",
              type: "list",
              message: `A folder at ${newProjectPath} already exists.\nCreating a project will overwrite and delete any files within, are you sure that you want to conitnue?`,
              choices: ['Yes', 'No']
            }
          ]

          const { allow } = await inquirer.prompt(question);
          if (allow == 'No') process.exit(1);
        }
        // create template
        const spinner = nano.createSpinner('Generating Template files...').start();
        switch (framework) {
          case 'Full Stack (express + react)':
            try {
              // importing template files
              const templatePath = path.join(__dirname, '../data/fullstack/')
              fs.mkdirSync(newProjectPath, { recursive: true });
              await run(`cp \\"${templatePath}*\\" \\"${newProjectPath}\\" -r -Force`);
              spinner.update({ text: "Installing Dependencies..." })
              console.log('✅ Generating Template files...');

              // installing dependencies
              const frontend = path.join(newProjectPath, 'frontend');
              const backend = path.join(newProjectPath, 'backend');
              await run(`cd \\"${frontend}\\" ; npm install --loglevel=error`);
              await run(`cd \\"${backend}\\" ; npm install --loglevel=error`);
              spinner.success();
              console.log(`Your project has been Successfully created at ${newProjectPath}`)
            } catch (err) {
              spinner.error({ text: "There was an error trying to creating this project, please try again later" })
              console.log(err);
            }
            break;

          case 'React + Vite':
            try {
              // importing template files
              const templatePath = path.join(__dirname, '../data/react/')
              fs.mkdirSync(newProjectPath, { recursive: true });
              await run(`cp \\"${templatePath}*\\" \\"${newProjectPath}\\" -r -Force`);
              spinner.update({ text: "Installing Dependencies..." })
              console.log('✅ Generating Template files...');

              // installing dependencies
              await run(`cd \\"${newProjectPath}\\" ; npm install --loglevel=error`);
              spinner.success()
              console.log(`Your project has been Successfully created at ${newProjectPath}`)
            } catch (err) {
              spinner.error({ text: "There was an error trying to creating this project, please try again later" })
              console.log(err);
            }
            break;
          case 'Vanila':
            try {
              // importing template files
              const templatePath = path.join(__dirname, '../data/vanila/')
              fs.mkdirSync(newProjectPath, { recursive: true });
              await run(`cp \\"${templatePath}*\\" \\"${newProjectPath}\\" -r -Force`);
              spinner.success();
              console.log(`Your project has been Successfully created at ${newProjectPath}`)

            } catch (err) {
              spinner.error({ text: "There was an error trying to creating this project, please try again later" })
              console.log(err);
            }
            break;

          case 'MKDocs (Notes)':
            try {
              // importing template files
              const templatePath = path.join(__dirname, '../data/mkdocs/')
              fs.mkdirSync(newProjectPath, { recursive: true });
              await run(`cp \\"${templatePath}*\\" \\"${newProjectPath}\\" -r -Force`);
              spinner.success();
              console.log(`Your project has been Successfully created at ${newProjectPath}`)

            } catch (err) {
              spinner.error({ text: "There was an error trying to creating this project, please try again later" })
              console.log(err);
            }
            break;
            break;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  help: {
    alias: ["h", "-h", "--help"],
    description: "Help command",
    options: [],
    execute: async function (args) {
      for (let i in cmdModule) {
        console.log(
          color.bold(
            color.yellow(`${i}`) +
            `
        ${cmdModule[i].description}

        options:
        ${cmdModule[i].options}

        aliases:
        ${cmdModule[i].alias}
        `
          )
        );
      }
      console.log(
        color.bold("For more information on a command, type <command name> -h")
      );
      return;
    },
  },
  version: {
    alias: ["v", "-v", "--version"],
    description: "Shows the current version of tresh",
    options: [],
    execute: async function (args) {
      console.log(npmPackage.version);
      return;
    },
  },
  "file-sort": {
    alias: [
      "fs",
      "filesort",
      "file-organize",
      "fo",
      "folder-sort",
      "foldersort",
      "folder-organise",
      "folderorganise",
      "fileorganize",
    ],
    description: "Moves files into preset folders based on their file types.",
    options: ["-c", "--coding"],
    execute: async function (args) {
      const optionsArr = [];
      args.forEach((value) => {
        if (value.startsWith("-") && this.options.includes(value)) {
          optionsArr.push(value);
        }
      });
      const filePathArr = args.filter((a) => !optionsArr.includes(a));
      if (filePathArr.length > 1 || optionsArr.length > 1) {
        console.log("Invalid Syntax");
        return;
      }
      //re assign the names for options and filepath so that i do not need to keep using index notation
      const filePath = filePathArr.pop();
      const option = optionsArr.pop();
      const absolutePath = path.resolve(process.cwd(), filePath || "");
      if (!fs.existsSync(absolutePath)) {
        console.log("Invalid Path");
        return;
      }
      //default sort moves everthing to windows created  folders
      if (option == undefined) {
        const spinner = nano.createSpinner("Organising files...").start();
        await sleep();
        //assume general sorting (i may use this is what this entire function is for instead of sorting via school folder of coding folder)
        const folderLocations = {
          png: "Pictures",
          jpg: "Pictures",
          jpeg: "Pictures",
          gif: "Pictures",
          bmp: "Pictures",
          tiff: "Pictures",
          docx: "Documents",
          doc: "Documents",
          pdf: "Documents",
          txt: "Documents",
          ppt: "Documents",
          pptx: "Documents",
          xls: "Documents",
          xlsx: "Documents",
          odt: "Documents",
          mp4: "Videos",
          avi: "Videos",
          mov: "Videos",
          mkv: "Videos",
          flv: "Videos",
          wmv: "Videos",
          mp3: "Music",
          wav: "Music",
          wma: "Music",
          flac: "Music",
          aac: "Music",
        };
        fs.readdir(absolutePath, (err, files) => {
          if (err) {
            spinner.error({ text: "There was an error organising files." });
            throw err;
          }
          files.forEach((file) => {
            const extension = path.extname(file).slice(1).toLowerCase();
            const targetFolder = folderLocations[extension];
            if (targetFolder) {
              const startPath = path.join(absolutePath, file); //lets us read the file
              const endPath = `C:\\Users\\JOVAN\\${targetFolder}\\${file}`;
              fs.copyFile(startPath, endPath, (err) => {
                if (err) {
                  spinner.error({
                    text: `There was an error organising file ${file}`,
                  });
                  throw err;
                } else {
                  fs.rmSync(startPath, { force: true, recursive: true });
                }
              });
            }
          });
          spinner.success({ text: "All files have been organised." });
        });
      } else if (["-c", "--coding"].includes(option)) {
        const spinner = nano.createSpinner("Organising files...").start();
        await sleep();
        const fileLocations = {
          //comments show folder names that gpt recommended, append back as you see fit.
          ".js": "scripts",
          ".ts": "scripts", //typescript
          ".jsx": "scripts", //react
          ".html": "static",
          ".ejs": "static",
          ".css": "styles",
          ".scss": "styles",
          ".less": "styles",
          ".json": "data",
          ".vue": "vue", //This is like a template kinda file follow html syntax
          ".png": "images",
          ".jpg": "images",
          ".gif": "images",
          ".svg": "images",
          ".webp": "images",
          ".avif": "images",
        };
        const folderLocations = {
          scripts: "src",
          styles: "src",
          static: "src",
          images: "src/styles",
        };
        fs.readdir(absolutePath, (err, files) => {
          if (err) {
            spinner.error({
              text: `There was and error with organising the files.`,
            });
            throw err;
          }
          files.forEach(async (file) => {
            //want to omit the node files otherwise everything is fucked.
            let ignore = ["package.json", "package-lock.json", "src"];
            if (ignore.includes(file)) return;
            const extension = path.extname(file).toLowerCase();
            //check if path exists
            const __filelocation = fileLocations[extension]; //is undefined if it is a folder
            const __folderlocation =
              folderLocations[
              __filelocation == undefined ? file : __filelocation
              ];
            let pathToSortTo = path.join(
              absolutePath,
              __folderlocation, //src
              __filelocation || file //scripts
            );
            fs.mkdir(path.join(absolutePath, __folderlocation), (err) => {
              if (err && err.code !== "EEXIST") {
                //this is the only time when we need to manage the error
                spinner.error({
                  text: "There was and error organising the folder.",
                });
                throw err;
              }
              fs.mkdir(pathToSortTo, (err) => {
                if (err && err.code !== "EEXIST") {
                  spinner.error({
                    text: "There was an error organising your files",
                  });
                  throw err;
                } else if (__filelocation == undefined) {
                  //it is a folder
                  let content = fs.readdirSync(path.join(absolutePath, file), {
                    encoding: "ascii",
                  });
                  content.forEach((sourceFile) => {
                    const sourcePath = path.join(
                      absolutePath,
                      file,
                      sourceFile
                    );
                    let fileContent = fs.readFileSync(sourcePath, {
                      encoding: "ascii",
                    });
                    fs.writeFile(
                      path.join(pathToSortTo, sourceFile),
                      fileContent,
                      (err) => {
                        if (err) {
                          spinner.error({
                            text: "There was and error organising your files",
                          });
                          throw err;
                        }

                        fs.rm(
                          sourcePath,
                          { force: true, recursive: true },
                          (err) => {
                            if (err) {
                              spinner.error({
                                text: "There was and error organising your files",
                              });
                              throw err;
                            }
                            fs.rmdirSync(path.join(absolutePath, file));
                            return;
                          }
                        );
                        return;
                      }
                    );
                  });
                } else {
                  //current file is actually a file
                  const content = fs.readFileSync(
                    path.join(absolutePath, file),
                    { encoding: "ascii" }
                  );
                  fs.writeFile(
                    path.join(pathToSortTo, file),
                    content,
                    (err) => {
                      if (err) {
                        spinner.error({
                          text: "There was an error organising your files",
                        });
                        throw err;
                      }
                      return;
                    }
                  );
                  fs.rmSync(path.join(absolutePath, file), {
                    recursive: true,
                    force: true,
                  });
                  return;
                }
              });
            });
          });
          spinner.success({ text: "All your files have been organised!" });
        });
      } else {
        //executes when the program fucks up or the user fucks up either way its fucked
        console.log("there was an error running this command");
        return;
      }
    },
  },
  install: {
    alias: ["i"],
    description: "installs self-made modules",
    options: ["-patricia"],
    execute: async function (args) {
      const optionsArr = [];
      args.forEach((value) => {
        if (value.startsWith("-") && this.options.includes(value)) {
          optionsArr.push(value);
        }
      });
      const filePathArr = args.filter((a) => !optionsArr.includes(a));
      if (filePathArr.length > 1 || optionsArr.length > 1) {
        console.log("Invalid Syntax");
        return;
      }
      //re assign the names for options and filepath so that i do not need to keep using index notation
      const option = optionsArr.pop();
      const filePath = filePathArr.pop();
      const absolutePath = path.resolve(
        process.cwd(),
        filePath || "",
        "node_modules",
        "patricia-db"
      );
      if (option == "-patricia") {
        const spinner = createSpinner("Installing patricia db...").start();
        await sleep();
        try {
          fs.cpSync(
            "C:\\Users\\JOVAN\\Documents\\coding\\Command line tool\\data\\patricia-db",
            absolutePath,
            { force: true, recursive: true }
          );
          const initPath = path.resolve(
            process.cwd(),
            filePath || "",
            "package.json"
          );
          const npmPackage = JSON.parse(
            fs.readFileSync(initPath, { encoding: "ascii" })
          );
          npmPackage.dependencies["patricia-db"] = "^1.0.0";
          fs.writeFileSync(initPath, JSON.stringify(npmPackage));
          spinner.success({ text: "Successfully installed Patricia!" });
        } catch (err) {
          spinner.error({ text: err });
        }
        return;
      } else {
        console.log("That is not a valid package.");
      }
    },
  },
  "create-password": {
    alias: ["cp", "create-pin", "createpassword"],
    description: "This generates a random password for me to use.",
    options: [],
    execute: async function (args) {
      let length = 8;
      args.forEach((value) => {
        if (value.startsWith("-") && !isNaN(value.slice(1, value.length))) {
          length = Number(value.slice(1, value.length));
        }
      });
      const lowerAlpha = "abcdefghijklmnopqrustvwxyz";
      const upperAlpha = "abcdefghijklmnopqrustvwxyz".toUpperCase();
      const num = "1234567890";
      const special = "!@#$%^&*()-_=+[]{}<>,./?";
      let password = "";
      for (let i = 0; i < length; i++) {
        const choices = [lowerAlpha, upperAlpha, num, special];
        const rand = Math.floor(Math.random() * choices.length);
        const rand2 = Math.floor(Math.random() * choices[rand].length);
        password += choices[rand][rand2];
      }
      console.log(password);
      return;
    },
  },
};

const cmdModuleAliased = {};
for (let property in cmdModule) {
  let aliases = cmdModule[property].alias;
  aliases.forEach((key) => (cmdModuleAliased[key] = cmdModule[property]));
  cmdModuleAliased[property] = cmdModule[property];
}
export { cmdModuleAliased };
