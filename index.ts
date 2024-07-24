#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import figlet from "figlet";
import boxen from "boxen";

async function main() {
    
    console.log(
        boxen(figlet.textSync('Dictionary CLI', { horizontalLayout: 'full' }), { padding: 1, margin: 1, borderStyle: 'double' })
    );

    // Prompt user input
    const userInput = await inquirer.prompt(
        {
            name: "word",
            type: "input",
            message: "Enter a word:",
        }
    );

    const api: string = `https://api.dictionaryapi.dev/api/v2/entries/en/${userInput.word}`;

    try {
        
        const spinner = ora('Fetching data...').start();


        const response = await fetch(api);
        const data = await response.json();

    
        spinner.stop();

        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }


        if (data && Array.isArray(data) && data[0].meanings) {
            data[0].meanings.forEach((meaning: any) => {
                console.log(chalk.green(`\nPart of Speech: ${meaning.partOfSpeech}`));

                
                if (meaning.definitions.length > 0) {
                    const firstDefinition = meaning.definitions[0];
                    console.log(chalk.yellow(`Definition: ${firstDefinition.definition}`));
                    if (firstDefinition.example) {
                        console.log(chalk.blue(`Example: ${firstDefinition.example}`));
                    }
                } else {
                    console.log(chalk.red("No definitions available."));
                }

                console.log(); 
            });
        } else {
            console.log(chalk.red("No meanings found."));
        }
    } catch (err) {
        console.error(chalk.red("Error fetching data:"), err);
    }
}

main();
