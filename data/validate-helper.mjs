/* Abstracts boilerplate to simplify validate.mjs */

import Ajv from 'ajv';
import fs from 'node:fs';
import path from 'node:path';

const usage = `Usage: node validate <killer/survivor> <perks/add-ons>`;

const ajv = new Ajv({
    allErrors: true,
});

let __validate_schema;
export function createValidationFunction(validationDir, schemaFile) {
    const schema = JSON.parse(fs.readFileSync(path.join(`${validationDir}/${schemaFile}`), 'utf8'));
    __validate_schema = ajv.compile(schema);
}

export function validateArgLength(actualArgs, expectedArgs) {
    if (actualArgs !== expectedArgs) {
        console.error(`Argument error: Expected ${expectedArgs}, got ${actualArgs}.`);
        console.error(usage);
        process.exit(1);
    }
}

export function validateArgContent(argNum, type, type1, type2) {
    if (type !== type1 && type !== type2) {
        console.error(`Error: Argument ${argNum} must be <${type1}> or <${type2}>.`);
        console.error(usage);
        process.exit(1);
    }
}

export function getAllowList(filePath, file) {
    return new Set(JSON.parse(fs.readFileSync(path.join(`${filePath}/${file}`), 'utf8')));
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
