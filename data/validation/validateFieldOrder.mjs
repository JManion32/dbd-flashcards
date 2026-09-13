const expectedOrder = [
    'name',
    'id',
    'side',
    'type',
    'rarity',
    'owner',
    'description',
    'quote',
    'tags',
];

export default function validateFieldOrder(file, data) {
    const actualOrder = Object.keys(data);

    const expectedPresentOrder = expectedOrder.filter((field) => field in data);

    if (actualOrder.join(',') !== expectedPresentOrder.join(',')) {
        console.error(`\n❌ ${file}: Invalid field order.`);
        console.error(`Expected: ${expectedPresentOrder.join(', ')}`);
        console.error(`Actual:   ${actualOrder.join(', ')}`);
        return true;
    }

    return false;
}
