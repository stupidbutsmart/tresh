import { cmdModuleAliased } from "./commands.js";

const args = process.argv.slice(2);

try {
  if (args.length == 0) {
    cmdModuleAliased.help.execute(args);
  }
  cmdModuleAliased[args.shift().toLowerCase()].execute(args);
} catch (err) {
  console.log(`There is no such command.`);
}
