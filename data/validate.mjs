/* Validate the perks and add-ons, ensuring all fields are correctly filled in. */

import fs from 'node:fs';

import {
    createValidationFunction,
    validateArgLength,
    validateArgContent,
    getAllowList,
    getJsonFiles,
    validateSchema,
    assertFieldPresence,
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

/*
 * Per-dataset rules layered on top of schema.json:
 *   required/forbidden: optional schema fields this dataset must have / must not have
 *   sides/types:        allowed values for side and type
 *   owners:             allow list (in validation/) that owner must come from
 */
const GAME_ITEM = {
    required: [
        'owner',
        'tags',
    ],
    forbidden: [],
};
const DATASETS = {
    'killer-perks': {
        ...GAME_ITEM,
        forbidden: [
            'rarity',
        ],
        sides: [
            'Killer',
        ],
        types: [
            'Perk',
        ],
        owners: 'killers.json',
    },
    'killer-add-ons': {
        ...GAME_ITEM,
        required: [
            ...GAME_ITEM.required,
            'rarity',
        ],
        sides: [
            'Killer',
        ],
        types: [
            'Add-On',
        ],
        owners: 'killers.json',
    },
    'killer-powers': {
        ...GAME_ITEM,
        forbidden: [
            'rarity',
        ],
        sides: [
            'Killer',
        ],
        types: [
            'Power',
        ],
        owners: 'killers.json',
    },
    'survivor-perks': {
        ...GAME_ITEM,
        forbidden: [
            'rarity',
        ],
        sides: [
            'Survivor',
        ],
        types: [
            'Perk',
        ],
        owners: 'survivors.json',
    },
    'survivor-items': {
        ...GAME_ITEM,
        required: [
            ...GAME_ITEM.required,
            'rarity',
        ],
        sides: [
            'Survivor',
        ],
        types: [
            'Item',
        ],
        owners: 'items.json',
    },
    'survivor-add-ons': {
        ...GAME_ITEM,
        required: [
            ...GAME_ITEM.required,
            'rarity',
        ],
        sides: [
            'Survivor',
        ],
        types: [
            'Add-On',
        ],
        owners: 'items.json',
    },
    'status-effects': {
        required: [],
        forbidden: [
            'owner',
            'rarity',
            'quote',
            'tags',
        ],
        sides: [
            'Survivor',
            'Killer',
            'All',
        ],
        types: [
            'Buff',
            'Debuff',
        ],
    },
};

// Location of data to be validated.
const dataDir = process.argv[2];
validateArgContent(2, dataDir, Object.keys(DATASETS));
const rules = DATASETS[dataDir];

// One schema covers the shape every data file shares; the dataset rules above handle the rest.
createValidationFunction('schema.json');

// exhaustion, elusive, exposed, etc
const allowedTags = getAllowList('tags.json');

// Visceral, Very Rare, Rare, Uncommon, Common
const allowedRarities = getAllowList('rarities.json');

const allowedOwners = rules.owners && getAllowList(rules.owners);

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
    if (assertSemanticVersion(file, 'Version', parsedFile.version)) {
        hasErrors = true;
    }
    if (assertFieldPresence(file, parsedFile, rules.required, rules.forbidden)) {
        hasErrors = true;
    }
    if (validateField(file, 'side', parsedFile.side, new Set(rules.sides))) {
        hasErrors = true;
    }
    if (validateField(file, 'type', parsedFile.type, new Set(rules.types))) {
        hasErrors = true;
    }
    if (allowedOwners && 'owner' in parsedFile && validateField(file, 'owner', parsedFile.owner, allowedOwners)) {
        hasErrors = true;
    }
    if ('rarity' in parsedFile && validateField(file, 'rarity', parsedFile.rarity, allowedRarities)) {
        hasErrors = true;
    }
    if ('tags' in parsedFile) {
        if (validateList(file, 'tag', parsedFile.tags, allowedTags)) {
            hasErrors = true;
        }
        if (assertAlphabeticalList(file, 'Tags', parsedFile.tags)) {
            hasErrors = true;
        }
    }
}

if (hasErrors) {
    process.exit(1);
}

console.log(`✅ All ${dataDir.replace('-', ' ')} are valid.`);
