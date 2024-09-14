#!/usr/bin/env node

import { Command } from "commander";
import colors from "colors";
import fs from "fs-extra";
import path from "path";
import { simpleGit } from "simple-git";
import ora from "ora";
import inquirer from "inquirer";
import { execSync } from "child_process";
import figlet from "figlet";
import { emptyNodejs } from "./templates/js-templates.js";
import { emptyNodets } from "./templates/ts-templates.js";

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

// Main function
async function main() {
  await showTerminalInfo();
  console.log("                                  ");

  // Ask the user if they wish to continue
  const { continueSetup } = await inquirer.prompt([
    {
      type: "confirm",
      name: "continueSetup",
      message: "Do you wish to continue?",
      default: true,
    },
  ]);

  if (!continueSetup) {
    console.log("                                  ");
    console.log(colors.yellow("Thank you for using exnode-cli!"));
    process.exit(0);
  }

  // Ask for the preferred package manager
  let packageManager;
  while (!packageManager) {
    const { selectedPackageManager } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedPackageManager",
        message: "Which package manager would you like to use?",
        choices: ["npm", "yarn", "pnpm"],
        default: "npm",
      },
    ]);

    // Check if the selected package manager is installed
    if (isPackageManagerInstalled(selectedPackageManager)) {
      packageManager = selectedPackageManager;
    } else {
      const { installPackage } = await inquirer.prompt([
        {
          type: "confirm",
          name: "installPackage",
          message: `${selectedPackageManager} is not installed. Do you wish to install it?`,
          default: true,
        },
      ]);

      if (installPackage) {
        installPackageManager(selectedPackageManager);
        packageManager = selectedPackageManager;
      } else {
        console.log(colors.yellow("Please select another package manager."));
      }
    }
  }

  // Continue with the project setup
  program
    .name("exnode-js")
    .version("1.0.0")
    .description(
      "A Node.js terminal tool to set up JavaScript/TypeScript projects"
    )
    .argument("<project-name>", "name of the project")
    .action(async (projectName) => {
      const projectPath = path.join(process.cwd(), projectName);

      if (fs.existsSync(projectPath)) {
        console.error(
          colors.red.italic(`Error: Directory ${projectName} already exists.`)
        );
        process.exit(1);
      }

      // Prompt for language selection
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "language",
          message: "Which language would you like to use?",
          choices: [
            { name: "TypeScript", value: "ts" },
            { name: "JavaScript", value: "js" },
          ],
          default: "ts",
        },
      ]);

      const repoUrl = answers.language === "js" ? emptyNodejs : emptyNodets;

      fs.mkdirSync(projectPath);

      const spinner = ora(
        `Downloading ${
          answers.language === "js" ? "JavaScript" : "TypeScript"
        } language...`
      ).start();

      const git = simpleGit();

      try {
        await git.clone(repoUrl, projectPath);
        spinner.succeed(
          `${
            answers.language === "js" ? "JavaScript" : "TypeScript"
          } language downloaded successfully!`
        );

        process.chdir(projectPath);

        spinner.start("Installing dependencies...");
        execSync(`${packageManager} install`, { stdio: "inherit" });
        spinner.succeed("Dependencies installed successfully!");

        console.log(colors.green(`Project ${projectName} is ready!`));
        console.log(
          colors.green(`cd ${projectName} and run ${packageManager} run dev`)
        );
      } catch (error) {
        spinner.fail("Failed to set up the project.");
        console.error(colors.red.italic(error.message));
        process.exit(1);
      }
    });

  program.parse(process.argv);
}

// Start the main function
main();
