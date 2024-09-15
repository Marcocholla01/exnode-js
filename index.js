#!/usr/bin/env node

import { Command } from "commander";
import colors from "colors";
import { simpleGit } from "simple-git";
import ora from "ora";
import inquirer from "inquirer";
import { execSync } from "child_process";
import figlet from "figlet";
import Table from "cli-table3"; // Import cli-table3
import {
  // emptyNodejs,
  // emptyNextjs,
  emptyNodejsMySQL,
  emptyNodejsPostgres,
  // emptyNodejsMongoDB,
  emptyNodejsMySQLSequelize,
  emptyNodejsPostgresSequelize,
  emptyNodejsMongoDBMongoose,
  emptyNextjsMySQL,
  emptyNextjsPostgres,
  // emptyNextjsMongoDB,
  emptyNextjsMySQLSequelize,
  emptyNextjsPostgresSequelize,
  emptyNextjsMongoDBMongoose,
} from "./templates/js-templates.js";
import {
  // emptyNodets,
  // emptyNextts,
  emptyNodetsMySQL,
  emptyNodetsPostgres,
  // emptyNodetsMongoDB,
  emptyNodetsMySQLSequelize,
  emptyNodetsPostgresSequelize,
  emptyNodetsMongoDBMongoose,
  emptyNexttsMySQL,
  emptyNexttsPostgres,
  // emptyNexttsMongoDB,
  emptyNexttsMySQLSequelize,
  emptyNexttsPostgresSequelize,
  emptyNexttsMongoDBMongoose,
} from "./templates/ts-templates.js";

const program = new Command();

// Function to display the terminal name
function showTerminalInfo() {
  return new Promise((resolve) => {
    figlet("exnode-cli", function (err, data) {
      if (err) {
        console.log(colors.red.italic("Something went wrong..."));
        console.dir(err);
        return;
      }
      console.log(colors.magenta(data));
      console.log(colors.cyan("Version:      ") + colors.yellow("1.0.0"));
      console.log(
        colors.cyan("Developer:    ") +
          colors.yellow("PAUL OUMA OCHOLLA (@Marcocholla01)")
      );
      console.log(
        colors.cyan("Description:  ") +
          colors.yellow(
            "A Node.js terminal tool for spinning up Javascript & Typescript projects."
          )
      );
      console.log(
        colors.cyan("GitHub Repo: ") +
          colors.yellow(" https://github.com/marcocholla01/exnode-js")
      );
      resolve();
    });
  });
}

// Function to check if the package manager is installed
function isPackageManagerInstalled(packageManager) {
  try {
    execSync(`${packageManager} --version`, { stdio: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to install the selected package manager
function installPackageManager(packageManager) {
  console.log(colors.yellow(`Installing ${packageManager}...`));
  try {
    if (packageManager === "yarn") {
      execSync("npm install -g yarn", { stdio: "inherit" });
    } else if (packageManager === "pnpm") {
      execSync("npm install -g pnpm", { stdio: "inherit" });
    }
    console.log(colors.green(`${packageManager} installed successfully!`));
  } catch (error) {
    console.log(
      colors.red.italic(`Failed to install ${packageManager}: ${error.message}`)
    );
    process.exit(1);
  }
}

// Function to dynamically ask questions based on the user's choices
async function askQuestions() {
  const questions = [
    {
      type: "list",
      name: "language",
      message: "Which language would you like to use?",
      choices: [
        { name: "TypeScript", value: "ts" },
        { name: "JavaScript", value: "js" },
      ],
    },
    {
      type: "list",
      name: "framework",
      message: "Which framework would you like to use?",
      choices: [
        { name: "Node.js", value: "node" },
        { name: "Next.js", value: "next" },
      ],
    },
    {
      type: "list",
      name: "database",
      message: "Which database would you like to use?",
      choices: [
        { name: "MySQL", value: "mysql" },
        { name: "PostgreSQL", value: "postgresql" },
        { name: "MongoDB", value: "mongodb" },
      ],
    },
    {
      type: "confirm",
      name: "useOrm",
      message: "Do you wish to use an ORM/ODM?",
      when: (answers) => answers.database !== "mongodb", // Skip for MongoDB
    },
    {
      type: "list",
      name: "ormChoice",
      message: "Which ORM would you like to use?",
      choices: [
        { name: "Prisma", value: "prisma" },
        { name: "Sequelize", value: "sequelize" },
      ],
      when: (answers) => answers.useOrm && answers.database !== "mongodb",
    },
    {
      type: "list",
      name: "odmChoice",
      message: "Which ODM would you like to use?",
      choices: [{ name: "Mongoose", value: "mongoose" }],
      when: (answers) => answers.database === "mongodb",
    },
    {
      type: "list",
      name: "packageManager",
      message: "Which package manager would you like to use?",
      choices: ["npm", "yarn", "pnpm"],
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers;
}

// Main function
async function main() {
  await showTerminalInfo();
  console.log("                                  ");

  const answers = await askQuestions();
  let projectTemplate;

  // Select project template based on language, framework, database, ORM/ODM
  if (answers.language === "js" && answers.framework === "node") {
    if (answers.database === "mysql") {
      projectTemplate = answers.useOrm
        ? emptyNodejsMySQLSequelize
        : emptyNodejsMySQL;
    } else if (answers.database === "postgresql") {
      projectTemplate = answers.useOrm
        ? emptyNodejsPostgresSequelize
        : emptyNodejsPostgres;
    } else if (answers.database === "mongodb") {
      projectTemplate = emptyNodejsMongoDBMongoose;
    }
  } else if (answers.language === "js" && answers.framework === "next") {
    if (answers.database === "mysql") {
      projectTemplate = answers.useOrm
        ? emptyNextjsMySQLSequelize
        : emptyNextjsMySQL;
    } else if (answers.database === "postgresql") {
      projectTemplate = answers.useOrm
        ? emptyNextjsPostgresSequelize
        : emptyNextjsPostgres;
    } else if (answers.database === "mongodb") {
      projectTemplate = emptyNextjsMongoDBMongoose;
    }
  } else if (answers.language === "ts" && answers.framework === "node") {
    if (answers.database === "mysql") {
      projectTemplate = answers.useOrm
        ? emptyNodetsMySQLSequelize
        : emptyNodetsMySQL;
    } else if (answers.database === "postgresql") {
      projectTemplate = answers.useOrm
        ? emptyNodetsPostgresSequelize
        : emptyNodetsPostgres;
    } else if (answers.database === "mongodb") {
      projectTemplate = emptyNodetsMongoDBMongoose;
    }
  } else if (answers.language === "ts" && answers.framework === "next") {
    if (answers.database === "mysql") {
      projectTemplate = answers.useOrm
        ? emptyNexttsMySQLSequelize
        : emptyNexttsMySQL;
    } else if (answers.database === "postgresql") {
      projectTemplate = answers.useOrm
        ? emptyNexttsPostgresSequelize
        : emptyNexttsPostgres;
    } else if (answers.database === "mongodb") {
      projectTemplate = emptyNexttsMongoDBMongoose;
    }
  }

  // Check if the package manager is installed, else install
  let packageManager = answers.packageManager;
  while (!isPackageManagerInstalled(packageManager)) {
    const { install } = await inquirer.prompt({
      type: "confirm",
      name: "install",
      message: `${packageManager} is not installed. Do you want to install it?`,
    });

    if (install) {
      installPackageManager(packageManager);
    } else {
      const { newPackageManager } = await inquirer.prompt({
        type: "list",
        name: "newPackageManager",
        message: "Which package manager would you like to install?",
        choices: ["npm", "yarn", "pnpm"],
      });
      packageManager = newPackageManager;
    }
  }

  // Return this to use in the action handler
  return {
    projectTemplate,
    packageManager,
    answers,
  };
}

program
  .argument("[projectName]", "name of the project")
  .action(async (projectName) => {
    const { projectTemplate, packageManager, answers } = await main();

    let projectPath = projectName || ".";
    if (projectName === undefined) {
      // Prompt for project name if not provided
      const { projectNameInput } = await inquirer.prompt({
        type: "input",
        name: "projectNameInput",
        message: "Enter the project name:",
        default: "exnode-cli-project",
      });
      projectPath = projectNameInput;
    }

    const spinner = ora(
      colors.cyan(`Creating project at ${projectPath}...`)
    ).start();

    // Initialize simple-git for cloning
    const git = simpleGit();

    try {
      // Clone the template from the Git repository instead of creating a file
      await git.clone(projectTemplate, projectPath);
      spinner.succeed(
        colors.green(`Project created successfully at ${projectPath}!`)
      );

      // Create and display the table
      const table = new Table({
        head: ["Language", "Framework", "Database", "ORM/ODM"],
        colWidths: [15, 20, 15, 15],
      });

      table.push([
        answers.language === "ts" ? "TypeScript" : "JavaScript",
        answers.framework === "next" ? "Next.js" : "Node.js",
        answers.database.charAt(0).toUpperCase() + answers.database.slice(1),
        answers.database === "mongodb"
          ? answers.odmChoice.charAt(0).toUpperCase() +
            answers.odmChoice.slice(1)
          : answers.ormChoice
          ? answers.ormChoice.charAt(0).toUpperCase() +
            answers.ormChoice.slice(1)
          : "None",
      ]);

      console.log("\nProject Details:");
      console.log(table.toString());
      console.log(
        colors.cyan(`Installing dependencies using ${packageManager}...`)
      );
      execSync(`${packageManager} install`, {
        cwd: projectPath,
        stdio: "inherit",
      });
      console.log(colors.green(`Dependencies installed successfully!`));
    } catch (error) {
      spinner.fail(colors.red(`Failed to create project: ${error.message}`));
    }
  });

program.parse(process.argv);
