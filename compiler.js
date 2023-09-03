const sass = require('node-sass');
const fs = require('fs');
const path = require('path');

// Input and output directories
const inputDir = './src'; // Directory containing .bcss files
const outputDir = './dist'; // Directory to output .css files

const spellingReplacements = {
    'color': 'colour',
    'center': 'centre',
    'gray': 'grey'
}

// Compile .bcss files to .css
fs.readdirSync(inputDir).forEach((file) => {
    console.log(file);
    if (file.endsWith('.bcss')) {
        let filePath = inputDir + "/" + file;
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading file: ${err}`);
                return;
            }

            // Replace British spellings with CSS spellings
            let updatedContent = data;
            for (const [britishSpelling, cssSpelling] of Object.entries(spellingReplacements)) {
                const regex = new RegExp(britishSpelling, 'g');
                updatedContent = updatedContent.replace(regex, cssSpelling);
            }

            // Write the updated content back to the file
            fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
                if (err) {
                    console.error(`Error writing file: ${err}`);
                } else {
                    console.log('Spellings replaced successfully.');
                }
            });
        });

        const inputFile = path.join(inputDir, file);
        const outputFile = path.join(outputDir, `${file.replace('.bcss', '')}.css`);

        sass.render({
            file: inputFile,
        }, (error, result) => {
            if (!error) {
                fs.writeFileSync(outputFile, result.css);
                console.log(`Compiled: ${inputFile} -> ${outputFile}`);
            } else {
                console.error(`Error compiling ${inputFile}:`, error);
            }
        });
    }
});