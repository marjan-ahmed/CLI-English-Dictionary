#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";
import boxen from "boxen";
async function main() {
    // Display title using figlet and boxen
    console.log(boxen(figlet.textSync('Dictionary CLI', { horizontalLayout: 'full' }), { padding: 1, margin: 1, borderStyle: 'double' }));
    // Prompt user input
    const userInput = await inquirer.prompt({
        name: "word",
        type: "input",
        message: "Enter a word:",
    });
    const api = `https://api.dictionaryapi.dev/api/v2/entries/en/${userInput.word}`;
    try {
        // Show a spinner while fetching data
        const spinner = ora('Fetching data...').start();
        // Fetch data from API using built-in fetch
        const response = await fetch(api);
        const data = await response.json();
        // Stop the spinner
        spinner.stop();
        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Process and display meanings
        if (data && Array.isArray(data) && data[0].meanings) {
            data[0].meanings.forEach((meaning) => {
                console.log(chalk.green(`\nPart of Speech: ${meaning.partOfSpeech}`));
                // Display only the first definition for each part of speech
                if (meaning.definitions.length > 0) {
                    const firstDefinition = meaning.definitions[0];
                    console.log(chalk.yellow(`Definition: ${firstDefinition.definition}`));
                    if (firstDefinition.example) {
                        console.log(chalk.blue(`Example: ${firstDefinition.example}`));
                    }
                }
                else {
                    console.log(chalk.red("No definitions available."));
                }
                console.log(); // Add an empty line between different parts of speech
            });
        }
        else {
            console.log(chalk.red("No meanings found."));
        }
    }
    catch (err) {
        console.error(chalk.red("Error fetching data:"), err);
    }
}
main();
