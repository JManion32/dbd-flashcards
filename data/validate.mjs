/* Validate the perks and add-ons, ensuring all fields are correctly filled in. */

import fs from 'node:fs';

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
    assertSemanticVersion,
    assertBalancedBrackets,
    assertImageExists,
    assertNoOrphanImages,
} from './validation/validate-helper.mjs';
import validateFieldOrder from './validation/validateFieldOrder.mjs';

validateArgLength(process.argv.length, 3);

const DATASET = [
    'killer-powers',
    'killer-perks',
    'killer-add-ons',
    'survivor-items',
    'survivor-perks',
    'survivor-add-ons',
    'status-effects',
];

// Location of data to be validated, also used for the switch statement.
const dataDir = process.argv[2];
validateArgContent(2, dataDir, DATASET);

// Which schema each folder is validated against
const schemas = {
    'killer-perks': 'game-item-schema.json',
    'killer-add-ons': 'game-item-schema.json',
    'survivor-perks': 'game-item-schema.json',
    'survivor-items': 'game-item-schema.json',
    'survivor-add-ons': 'game-item-schema.json',
    'status-effects': 'status-effect-schema.json',
};

// Create the validation function (for helper)
createValidationFunction(schemas[dataDir]);

// exhaustion, elusive, exposed, etc
const allowedTags = getAllowList('tags.json');

// Visceral, Very Rare, Rare, Uncommon, Common
const allowedRarities = getAllowList('rarities.json');

const jsonFiles = getJsonFiles(dataDir);

let hasErrors = false;

const parsedFiles = jsonFiles.map((file) => JSON.parse(fs.readFileSync(file, 'utf8')));

if (assertNoOrphanImages(jsonFiles, parsedFiles)) {
    hasErrors = true;
}

for (const [
    i,
    file,
] of jsonFiles.entries()) {
    const parsedFile = parsedFiles[i];

    if (assertImageExists(file, parsedFile.id)) {
        hasErrors = true;
    }
    if (validateSchema(file, parsedFile)) {
        hasErrors = true;
    }
    if (validateFieldOrder(file, parsedFile)) {
        hasErrors = true;
    }
    if (assertLowerKebabCase(file, 'id', parsedFile.id)) {
        hasErrors = true;
    }
    if (assertBalancedBrackets(file, parsedFile)) {
        hasErrors = true;
    }
    if (parsedFile.version !== undefined && assertSemanticVersion(file, 'Version', parsedFile.version)) {
        hasErrors = true;
    }

    switch (dataDir) {
        case 'survivor-perks': {
            if (validateList(file, 'tag', parsedFile.tags, allowedTags)) {
                hasErrors = true;
            }
            if (assertAlphabeticalList(file, 'Tags', parsedFile.tags)) {
                hasErrors = true;
            }
            if (assertField(file, 'side', parsedFile.side, 'Survivor')) {
                hasErrors = true;
            }
            if (assertField(file, 'type', parsedFile.type, 'Perk')) {
                hasErrors = true;
            }
            const allowedCharacters = getAllowList('survivors.json');
            if (validateField(file, 'survivor', parsedFile.owner, allowedCharacters)) {
                hasErrors = true;
            }
            break;
        }

        case 'survivor-items': {
            if (validateList(file, 'tag', parsedFile.tags, allowedTags)) {
                hasErrors = true;
            }
            if (assertAlphabeticalList(file, 'Tags', parsedFile.tags)) {
                hasErrors = true;
            }
            if (assertField(file, 'side', parsedFile.side, 'Survivor')) {
                hasErrors = true;
            }
            if (assertField(file, 'type', parsedFile.type, 'Item')) {
                hasErrors = true;
            }
            const allowedItems = getAllowList('items.json');
            if (validateField(file, 'item', parsedFile.owner, allowedItems)) {
                hasErrors = true;
            }
            if (validateField(file, 'rarity', parsedFile.rarity, allowedRarities)) {
                hasErrors = true;
            }
            break;
        }

        case 'survivor-add-ons': {
            if (validateList(file, 'tag', parsedFile.tags, allowedTags)) {
                hasErrors = true;
            }
            if (assertAlphabeticalList(file, 'Tags', parsedFile.tags)) {
                hasErrors = true;
            }
            if (assertField(file, 'side', parsedFile.side, 'Survivor')) {
                hasErrors = true;
            }
            if (assertField(file, 'type', parsedFile.type, 'Add-On')) {
                hasErrors = true;
            }
            const allowedItems = getAllowList('items.json');
            if (validateField(file, 'item', parsedFile.owner, allowedItems)) {
                hasErrors = true;
            }
            if (validateField(file, 'rarity', parsedFile.rarity, allowedRarities)) {
                hasErrors = true;
            }
            break;
        }

        case 'killer-perks': {
            if (validateList(file, 'tag', parsedFile.tags, allowedTags)) {
                hasErrors = true;
            }
            if (assertAlphabeticalList(file, 'Tags', parsedFile.tags)) {
                hasErrors = true;
            }
            if (assertField(file, 'side', parsedFile.side, 'Killer')) {
                hasErrors = true;
            }
            if (assertField(file, 'type', parsedFile.type, 'Perk')) {
                hasErrors = true;
            }
            const allowedCharacters = getAllowList('killers.json');
            if (validateField(file, 'killer', parsedFile.owner, allowedCharacters)) {
                hasErrors = true;
            }
            break;
        }

        case 'killer-add-ons': {
            if (validateList(file, 'tag', parsedFile.tags, allowedTags)) {
                hasErrors = true;
            }
            if (assertAlphabeticalList(file, 'Tags', parsedFile.tags)) {
                hasErrors = true;
            }
            if (assertField(file, 'side', parsedFile.side, 'Killer')) {
                hasErrors = true;
            }
            if (assertField(file, 'type', parsedFile.type, 'Add-On')) {
                hasErrors = true;
            }
            const allowedCharacters = getAllowList('killers.json');
            if (validateField(file, 'killer', parsedFile.owner, allowedCharacters)) {
                hasErrors = true;
            }
            if (validateField(file, 'rarity', parsedFile.rarity, allowedRarities)) {
                hasErrors = true;
            }
            break;
        }

        case 'status-effects': {
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

console.log(`✅ All ${dataDir.replace('-', ' ')} are valid.`);
