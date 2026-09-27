<script setup lang="ts">
import '@/styles/footer.css';
import '@/styles/modal.css';

import Modal from '@/components/Modal.vue';

const props = defineProps<{
    visible: boolean;
}>();

const visible = props.visible;
</script>
<template>
    <Modal
        :visible="props.visible"
        transition="scale"
        required
        @close="visible = false"
    >
        <div class="modal-content">
            <h2>Impressive!</h2>
        </div>
    </Modal>
</template>
<style scoped></style>
