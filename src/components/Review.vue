<template>
    <div class="review">
        <div style="display: flex; justify-content: space-between;">
            <span>{{ maskedEmail }}</span>
            <span>{{ formattedDate }}</span>
        </div>

        <rating-bar :mark="review.rating" :disabled="true"></rating-bar>

        <div>
            <span class="bold-label">{{ translateText('comment') }}</span>
            {{ review.comment }}
        </div>

        <a
            v-if="review.user.email === user.email || user.isAdmin"
            href="#"
            @click.prevent="$emit('remove-comment')"
        >
            {{ translateText('removeReview') }}
        </a>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import RatingBar from '@/components/RatingBar.vue';
import { namespace } from 'vuex-class';
import { UserPublicData } from '@/index.d';

const userModule = namespace('user');

@Component({
    name: 'Review',
    components: {
        RatingBar,
    },
})
export default class Review extends Vue {
    @userModule.State('user') user!: UserPublicData;

    @Prop() review!: any;

    get formattedDate() {
        const date = new Date(this.review.created * 1000);

        const day = this.formatNumber(date.getDate());
        const month = this.formatNumber(date.getMonth());
        const year = date.getFullYear();
        const hours = this.formatNumber(date.getHours());
        const minutes = this.formatNumber(date.getMinutes());
        const seconds = this.formatNumber(date.getSeconds());

        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    }

    get maskedEmail() {
        const { email } = this.review.user;

        const start = email.substr(0, 2);
        const end = email.substr(email.length - 2);

        return `${start}***${end}`;
    }

    formatNumber(number: number) {
        return number < 10 ? `0${number}` : number.toString();
    }
}
</script>

<style scoped lang="scss">
.review {
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid #ccc;
}
</style>
