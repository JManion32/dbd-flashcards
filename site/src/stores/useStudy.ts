import { ref } from 'vue';
import type { StudyConfig } from '@/types/StudyConfig';

const studyConfig = ref<StudyConfig | null>(null);

export function useStudy() {
    return {
        studyConfig,
    };
}
