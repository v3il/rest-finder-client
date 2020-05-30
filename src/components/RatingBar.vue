<template>
    <div class="rating">
        <font-awesome-icon
            :icon="['fa', 'star']"
            v-for="(star, index) in stars"
            :key="index"
            @click="setMark(index + 1)"
            class="rating__star"
            :class="{
                'rating__star--active': selectedMark >= index + 1,
                'rating__star--disabled': disabled,
            }"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({
    name: 'Review',
})
export default class Review extends Vue {
    @Prop({ default: 1 }) mark!: number;

    @Prop({ default: 5 }) maxMark!: number;

    @Prop({ default: false }) disabled!: boolean;

    selectedMark = 1;

    stars!: any;

    created() {
        this.selectedMark = parseInt(this.mark.toString(), 10);
        this.stars = Array.from({ length: this.maxMark }).fill(0);
    }

    setMark(mark: number) {
        if (this.disabled) {
            return;
        }

        this.selectedMark = mark;
        this.$emit('mark-updated', this.selectedMark);
    }
}
</script>

<style scoped lang="scss">
.rating {
    &__star {
        cursor: pointer;
        color: #6c757d;
    }

    &__star--active {
        color: #ffc107;
    }

    &__star--disabled {
        cursor: default;
    }
}
</style>
