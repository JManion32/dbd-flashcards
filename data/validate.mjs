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
    assertField,
    validateField,
    assertLowerKebabCase,
    validateList,
    assertAlphabeticalList,
} from './validation/validate-helper.mjs';
import validateFieldOrder from './validation/validateFieldOrder.mjs';

validateArgLength(process.argv.length, 4);

const characterType = process.argv[2];
validateArgContent(2, characterType, 'killer', 'survivor');

const itemType = process.argv[3];
validateArgContent(3, itemType, 'perks', 'add-ons');

// For the switch statement.
const dataSetType = `${characterType}_${itemType}`;

// Location of data to be validated.
const dataDir = path.join(`${characterType}/${itemType}`);

// Create the validation function (for helper)
createValidationFunction(`schema.json`);

// exhaustion, elusive, exposed, etc
const allowedTags = getAllowList('tags.json');

const jsonFiles = getJsonFiles(dataDir);

let hasErrors = false;

for (const file of jsonFiles) {
    const parsedFile = JSON.parse(fs.readFileSync(file, 'utf8'));

    if (validateSchema(file, parsedFile)) {
        hasErrors = true;
    }
    if (validateFieldOrder(file, parsedFile)) {
        hasErrors = true;
    }
    if (assertLowerKebabCase(file, 'id', parsedFile.id)) {
        hasErrors = true;
    }
    if (validateList(file, 'tag', parsedFile.tags, allowedTags)) {
        hasErrors = true;
    }
    if (assertAlphabeticalList(file, 'Tags', parsedFile.tags)) {
        hasErrors = true;
    }

    switch (dataSetType) {
        case 'survivor_perks': {
            if (assertField(file, 'side', parsedFile.side, 'survivor')) {
                hasErrors = true;
            }
            if (assertField(file, 'type', parsedFile.type, 'perk')) {
                hasErrors = true;
            }
            const allowedCharacters = getAllowList('survivors.json');
            if (validateField(file, 'survivor', parsedFile.owner, allowedCharacters)) {
                hasErrors = true;
            }
            break;
        }

        case 'survivor_add-ons': {
            if (assertField(file, 'side', parsedFile.side, 'survivor')) {
                hasErrors = true;
            }
            if (assertField(file, 'type', parsedFile.type, 'add-on')) {
                hasErrors = true;
            }
            if (assertLowerKebabCase(file, 'id', parsedFile.id)) {
                hasErrors = true;
            }

            const allowedItems = getAllowList('items.json');
            if (validateField(file, 'item', parsedFile.owner, allowedItems)) {
                hasErrors = true;
            }
            const allowedRarities = getAllowList('rarities.json');
            if (validateField(file, 'rarity', parsedFile.rarity, allowedRarities)) {
                hasErrors = true;
            }
            break;
        }

        case 'killer_perks': {
            if (assertField(file, 'side', parsedFile.side, 'killer')) {
                hasErrors = true;
            }
            if (assertField(file, 'type', parsedFile.type, 'perk')) {
                hasErrors = true;
            }
            const allowedCharacters = getAllowList('killers.json');
            if (validateField(file, 'killer', parsedFile.owner, allowedCharacters)) {
                hasErrors = true;
            }
            break;
        }

        case 'killer_add-ons': {
            if (assertField(file, 'side', parsedFile.side, 'killer')) {
                hasErrors = true;
            }
            if (assertField(file, 'type', parsedFile.type, 'add-on')) {
                hasErrors = true;
            }
            const allowedCharacters = getAllowList('killers.json');
            if (validateField(file, 'killer', parsedFile.owner, allowedCharacters)) {
                hasErrors = true;
            }
            const allowedRarities = getAllowList('rarities.json');
            if (validateField(file, 'rarity', parsedFile.rarity, allowedRarities)) {
                hasErrors = true;
            }
            break;
        }

        default: {
            console.error('Error: No such dataset.');
        }
    }
}

if (hasErrors) {
    process.exit(1);
}

console.log(`✅ All ${characterType} ${itemType} are valid.`);
