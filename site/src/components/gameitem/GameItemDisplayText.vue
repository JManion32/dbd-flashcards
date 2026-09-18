<script setup lang="ts">
type HighlightType = 'status' | 'value' | 'variable';

type TextPart = {
    text: string;
    type: 'normal' | 'italic' | 'highlight';
    highlightType?: HighlightType;
};

const props = defineProps<{
    text: string;
}>();

function getHighlightType(text: string): HighlightType {
    if (text.startsWith('@')) {
        return 'variable';
    }

    if (/^\d+(%|s)?$/.test(text)) {
        return 'value';
    }

    return 'status';
}

function parseText(text: string): TextPart[] {
    return text
        .split(/(\[[^\]]+\]|<[^>]+>)/g)
        .filter((part) => part.length > 0)
        .map((part) => {
            if (part.startsWith('[') && part.endsWith(']')) {
                const content = part.slice(1, -1);

                return {
                    text: content,
                    type: 'highlight',
                    highlightType: getHighlightType(content),
                };
            }

            if (part.startsWith('<') && part.endsWith('>')) {
                return {
                    text: part.slice(1, -1),
                    type: 'italic',
                };
            }

            return {
                text: part,
                type: 'normal',
            };
        });
}
</script>

<template>
    <template
        v-for="(part, index) in parseText(props.text)"
        :key="index"
    >
        <em v-if="part.type === 'italic'">
            {{ part.text }}
        </em>

        <span
            v-else-if="part.type === 'highlight'"
            class="highlight"
            :class="`highlight-${part.highlightType}`"
        >
            {{ part.text }}
        </span>

        <span v-else>
            {{ part.text }}
        </span>
    </template>
</template>

<style scoped>
.highlight {
    font-weight: 900;
}

.highlight-status {
    color: var(--status-color);
}

.highlight-value {
    color: var(--value-color);
}

.highlight-variable {
    color: var(--variable-color);
}
</style>
