import { ref } from 'vue';
import type { StudyConfig } from '@/types/studyConfig';

const studyConfig = ref<StudyConfig | null>(null);

export function useStudy() {
    return {
        studyConfig,
    };
}
