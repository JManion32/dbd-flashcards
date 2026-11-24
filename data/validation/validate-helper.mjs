/* Abstracts function implementation to simplify validate.mjs */

import Ajv from 'ajv';
import fs from 'node:fs';
import path from 'node:path';

const usage = `Usage: node validate <killer-perks/killer-add-ons/survivor-perks/survivor-add-ons>`;

const ajv = new Ajv({
    allErrors: true,
});

let __validate_schema;
export function createValidationFunction(schemaFile) {
    const schema = JSON.parse(fs.readFileSync(path.join(`validation/${schemaFile}`), 'utf8'));
    __validate_schema = ajv.compile(schema);
}

export function validateArgLength(actualArgs, expectedArgs) {
    if (actualArgs !== expectedArgs) {
        console.error(`Argument error: Expected ${expectedArgs}, got ${actualArgs}.`);
        console.error(usage);
        process.exit(1);
    }
}

export function validateArgContent(argNum, type, allowedTypes) {
    if (!allowedTypes.includes(type)) {
        console.error(`Error: Argument ${argNum} must be one of <${allowedTypes.join('/')}>.`);
        console.error(usage);
        process.exit(1);
    }
}

export function getAllowList(file) {
    return new Set(JSON.parse(fs.readFileSync(path.join(`validation/${file}`), 'utf8')));
}

export function getJsonFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(`${dir}/${entry.name}`);

        if (entry.isDirectory()) {
            return getJsonFiles(fullPath);
        }

        if (entry.name.endsWith('.json')) {
            return [
                fullPath,
            ];
        }

        return [];
    });
}

export function validateSchema(file, parsedFile) {
    if (!__validate_schema(parsedFile)) {
        console.error(`\n❌ ${file}`);
        console.error(__validate_schema.errors);
        return true;
    }
    return false;
}

export function assertLowerKebabCase(file, field, value) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
        console.error(`\n❌ ${file}: Invalid ${field}: "${value}".`);
        console.error('Must be kebab-case and all lowercase.');
        return true;
    }
    return false;
}

export function assertField(file, field, value, expectedValue) {
    if (value !== expectedValue) {
        console.error(`\n❌ ${file}: Invalid ${field}: "${value}".`);
        console.error(`Expected: ${expectedValue}.`);
        return true;
    }
    return false;
}

export function validateField(file, field, value, allowList) {
    if (!allowList.has(value)) {
        console.error(`\n❌ ${file}: Invalid ${field}: "${value}"`);
        return true;
    }
    return false;
}

export function validateList(file, listType, list, allowList) {
    let hasError = false;
    for (const item of list) {
        if (!allowList.has(item)) {
            console.error(`\n❌ ${file}: Invalid ${listType}: "${item}"`);
            hasError = true;
        }
    }
    return hasError;
}

export function assertAlphabeticalList(file, field, list) {
    const sortedList = [
        ...list,
    ].sort((a, b) => a.localeCompare(b));
    if (JSON.stringify(list) !== JSON.stringify(sortedList)) {
        console.error(`❌ ${file}: ${field} must be in alphabetical order`);
        return true;
    }
    return false;
}

const SEMVER_REGEX =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)[a-z]?(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
export function assertSemanticVersion(file, field, version) {
    if (!SEMVER_REGEX.test(version)) {
        console.error(`❌ ${file}: Invalid ${field}: ${version}, must be <MAJOR>.<MINOR>.<PATCH>[letter].`);
        return true;
    }
    return false;
}

const closingBrackets = { '(': ')', '[': ']', '{': '}', '<': '>' };
const openingBrackets = { ')': '(', ']': '[', '}': '{', '>': '<' };

// Every string value (descriptions, list items, quotes, etc.) must open and close its brackets in order.
export function assertBalancedBrackets(file, value, field = '') {
    if (Array.isArray(value)) {
        return value.map((item, i) => assertBalancedBrackets(file, item, `${field}[${i}]`)).some(Boolean);
    }
    if (value && typeof value === 'object') {
        return Object.entries(value)
            .map(
                ([
                    key,
                    item,
                ]) => assertBalancedBrackets(file, item, field ? `${field}.${key}` : key)
            )
            .some(Boolean);
    }
    if (typeof value !== 'string') {
        return false;
    }

    const stack = [];
    for (const char of value) {
        if (char in closingBrackets) {
            stack.push(char);
        } else if (char in openingBrackets) {
            if (stack.pop() !== openingBrackets[char]) {
                console.error(`\n❌ ${file}: Unexpected "${char}" in ${field}: "${value}"`);
                return true;
            }
        }
    }
    if (stack.length > 0) {
        console.error(`\n❌ ${file}: Unclosed "${stack.at(-1)}" in ${field}: "${value}"`);
        return true;
    }
    return false;
}

// The site looks images up by id, so each item needs images/<id>.webp (or .png) next to its JSON.
export function assertImageExists(file, id) {
    const imageDir = path.join(path.dirname(file), 'images');
    if (
        ![
            `${id}.webp`,
            `${id}.png`,
        ].some((image) => fs.existsSync(path.join(imageDir, image)))
    ) {
        console.error(`❌ ${file}: No image found at ${imageDir}/${id}.webp`);
        return true;
    }
    return false;
}

// Every image should belong to an item in the folder above its images/ folder.
export function assertNoOrphanImages(jsonFiles, parsedFiles) {
    let hasErrors = false;
    const idsByDir = new Map();
    jsonFiles.forEach((file, i) => {
        const dir = path.dirname(file);
        if (!idsByDir.has(dir)) {
            idsByDir.set(dir, new Set());
        }
        idsByDir.get(dir).add(parsedFiles[i].id);
    });
    for (const [
        dir,
        ids,
    ] of idsByDir) {
        const imageDir = path.join(dir, 'images');
        if (!fs.existsSync(imageDir)) {
            continue;
        }
        for (const image of fs.readdirSync(imageDir)) {
            if (!ids.has(image.replace(/\.(png|webp)$/, ''))) {
                console.error(`❌ ${imageDir}/${image}: No item with this id.`);
                hasErrors = true;
            }
        }
    }
    return hasErrors;
}
