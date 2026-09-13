/* Validate the perks and add-ons, ensuring all fields are correctly filled in. */

import fs from 'node:fs';
import path from 'node:path';

import {
    createValidationFunction,
    validateArgLength,
    validateArgContent,
    getAllowList,
    getJsonFiles,
    validateSchema,
    validateField,
    validateList,
    assertAlphabeticalList,
} from './validate-helper.mjs';

validateArgLength(process.argv.length, 4);

const characterType = process.argv[2];
validateArgContent(2, characterType, 'killer', 'survivor');

const itemType = process.argv[3];
validateArgContent(3, itemType, 'perks', 'add-ons');

// For the switch statement.
const dataSetType = `${characterType}_${itemType}`;

// Location of data to be validated.
const dataDir = path.join(`${characterType}/${itemType}`);

// Location of this data's validation (allow lists, schema, etc).
const validationDir = path.join(`${characterType}/validation`);

// Create the validation function (for helper)
createValidationFunction(validationDir, `${itemType}.schema.json`);

// exhaustion, elusive, exposed, etc
const allowedTags = getAllowList('shared', 'tags.json');

const jsonFiles = getJsonFiles(dataDir);

let hasErrors = false;

switch (dataSetType) {
    case 'survivor_perks':

        for (const file of jsonFiles) {
            const parsedFile = JSON.parse(fs.readFileSync(file, 'utf8'));

            validateSchema(file, parsedFile);

            const allowedCharacters = getAllowList(validationDir, 'survivors.json');
            if (validateField(file, 'survivor', parsedFile.character, allowedCharacters)) {
                hasErrors = true;
            }
            if (validateList(file, 'tag', parsedFile.tags, allowedTags)) {
                hasErrors = true;
            }
            if (assertAlphabeticalList(file, 'Tags', parsedFile.tags)) {
                hasErrors = true;
            }
        }
        break;

    case 'survivor_add-ons':
        for (const file of jsonFiles) {
            const parsedFile = JSON.parse(fs.readFileSync(file, 'utf8'));

            validateSchema(file, parsedFile);

            const allowedItems = getAllowList(validationDir, 'items.json');
            if (validateField(file, 'item', parsedFile.type, allowedItems)) {
                hasErrors = true;
            }
            const allowedRarities = getAllowList('shared', 'rarities.json');
            if (validateField(file, 'rarity', parsedFile.rarity, allowedRarities)) {
                hasErrors = true;
            }
        }
        break;

    case 'killer_perks':

        for (const file of jsonFiles) {
            const parsedFile = JSON.parse(fs.readFileSync(file, 'utf8'));

            validateSchema(file, parsedFile);

            const allowedCharacters = getAllowList(validationDir, 'killers.json');
            if (validateField(file, 'killer', parsedFile.character, allowedCharacters)) {
                hasErrors = true;
            }
            if (validateList(file, 'tag', parsedFile.tags, allowedTags)) {
                hasErrors = true;
            }
            if (assertAlphabeticalList(file, 'Tags', parsedFile.tags)) {
                hasErrors = true;
            }
        }
        break;

    case 'killer_add-ons':

        for (const file of jsonFiles) {
            const parsedFile = JSON.parse(fs.readFileSync(file, 'utf8'));

            validateSchema(file, parsedFile);

            const allowedCharacters = getAllowList(validationDir, 'killers.json');
            if (validateField(file, 'killer', parsedFile.character, allowedCharacters)) {
                hasErrors = true;
            }
            const allowedRarities = getAllowList('shared', 'rarities.json');
            if (validateField(file, 'rarity', parsedFile.character, allowedRarities)) {
                hasErrors = true;
            }
            if (validateList(file, 'tag', parsedFile.tags, allowedTags)) {
                hasErrors = true;
            }
            if (assertAlphabeticalList(file, 'Tags', parsedFile.tags)) {
                hasErrors = true;
            }
        }
        break;

    default:
        console.error('Error: No such dataset.');
}

if (hasErrors) {
    process.exit(1);
}

console.log(`✅ All ${characterType} ${itemType} are valid.`);
