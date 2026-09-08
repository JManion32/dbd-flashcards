import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';

const usage = `Usage: node validate <killer/survivor> <perks/add-ons>`;

if (process.argv.length !== 4) {
    console.error(`Argument error: Expected 4, got ${process.argv.length}.`);
    console.error(usage);
    process.exit(1);
}

const CHARACTER_TYPE = process.argv[2];
if (CHARACTER_TYPE !== 'killer' && CHARACTER_TYPE !== 'survivor') {
    console.error('Error: The third argument must be <killer> or <survivor>.');
    console.error(usage);
    process.exit(1);
}

const ITEM_TYPE = process.argv[3];
if (ITEM_TYPE !== 'perks' && ITEM_TYPE !== 'add-ons') {
    console.error('Error: The fourth argument must be <perks> or <add-ons>.');
    console.error(usage);
    process.exit(1);
}

const __data_dir = path.join(`${CHARACTER_TYPE}/${ITEM_TYPE}`);
const __validation_dir = path.join(`${CHARACTER_TYPE}/validation`);

const schema = JSON.parse(
    fs.readFileSync(
        path.resolve(__validation_dir, `${ITEM_TYPE}.schema.json`),
        'utf8'
    )
);

const allowedCharacters = new Set(
    JSON.parse(
        fs.readFileSync(
            path.resolve(__validation_dir, 'characters.json'),
            'utf8'
        )
    )
);

const allowedTags = new Set(
    JSON.parse(
        fs.readFileSync(path.resolve(__validation_dir, 'tags.json'), 'utf8')
    )
);

const ajv = new Ajv({
    allErrors: true,
});

const validateSchema = ajv.compile(schema);

function getJsonFiles(directory) {
    return fs
        .readdirSync(directory, { withFileTypes: true })
        .flatMap((entry) => {
            const fullPath = path.join(directory, entry.name);

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

let hasErrors = false;

for (const file of getJsonFiles(__data_dir)) {
    const parsed_file = JSON.parse(fs.readFileSync(file, 'utf8'));

    // Run ajv
    if (!validateSchema(parsed_file)) {
        console.error(`\n❌ ${file}`);
        console.error(validateSchema.errors);
        hasErrors = true;
        continue;
    }

    // Assert character is valid.
    if (CHARACTER_TYPE !== 'survivor' && ITEM_TYPE !== 'add-on') {
        if (!allowedCharacters.has(parsed_file.character)) {
            console.error(
                `\n❌ ${file}: Invalid character "${parsed_file.character}"`
            );
            hasErrors = true;
        }

        // Assert tags are valid.
        for (const tag of parsed_file.tags) {
            if (!allowedTags.has(tag)) {
                console.error(`\n❌ ${file}: Invalid tag "${tag}"`);
                hasErrors = true;
            }
        }

        // Assert tags in alphabetical order.
        const sortedTags = [
            ...parsed_file.tags,
        ].sort((a, b) => a.localeCompare(b));
        if (JSON.stringify(parsed_file.tags) !== JSON.stringify(sortedTags)) {
            console.error(`❌ ${file}: Tags must be in alphabetical order`);
            hasErrors = true;
        }
    }
    // Is Survivor add-on
    else {
        // TODO: Add validation for type.
    }
}

if (hasErrors) {
    process.exit(1);
}

console.log(`✅ All ${CHARACTER_TYPE} ${ITEM_TYPE} are valid.`);
