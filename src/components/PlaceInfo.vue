<template>
    <div class="place-info">
        <h5>{{ placeInfo.name }} ({{ placeInfo.id }})</h5>

        <span
            class="badge badge-primary"
            v-for="category in placeInfo.categories"
            :key="category.id"
            >{{ category.name }}</span
        >

        <div class="place-info__info-block">
            <span class="bold-label">{{ translateText('costs') }}:</span>
            {{ placeInfo.restCost.name }}
        </div>

        <div class="place-info__info-block">
            <span class="bold-label">{{ translateText('restDurations') }}:</span>
            {{ placeInfo.restDuration.name }}
        </div>

        <div class="place-info__info-block">
            <span class="bold-label">{{ translateText('companySizes') }}:</span>
            {{ placeInfo.companySize.name }}
        </div>

        <div class="place-info__info-block">
            <span class="bold-label">{{ translateText('restTypes') }}:</span>
            {{
                placeInfo.isActiveRest
                    ? translateText('activeRestType')
                    : translateText('passiveRestType')
            }}
        </div>

        <div class="place-info__info-block">
            <span class="bold-label">{{ translateText('googleRating') }}:</span>

            {{
                translateText('ratingValue', [
                    placeInfo.googleMeanRating.toFixed(1),
                    placeInfo.googleReviewsCount,
                ])
            }}
        </div>

        <div class="place-info__info-block">
            <span class="bold-label">{{ translateText('systemRating') }}:</span>
            {{
                translateText('ratingValue', [
                    placeInfo.meanRating.toFixed(1),
                    placeInfo.reviewsCount,
                ])
            }}
        </div>

        <div class="place-info__info-block">
            <span class="bold-label">{{ translateText('businessHoursForToday') }}:</span>
            {{
                placeInfo.workingPeriod
                    ? placeInfo.workingPeriod.worksAllDay
                        ? translateText('allDay')
                        : placeInfo.workingPeriod.dayOff
                        ? translateText('dayOff')
                        : `${placeInfo.workingPeriod.timeStart} - ${placeInfo.workingPeriod.timeEnd}`
                    : 'No data'
            }}
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({
    name: 'PlaceInfo',
})
export default class PlaceInfo extends Vue {
    @Prop() placeInfo!: any;
}
</script>

<style scoped lang="scss">
.place-info {
    &__info-block {
        margin: 9px 0;
    }

    &__title {
        display: block;
        color: #686a6e;
        font-weight: 700;
        font-size: 0.9em;
    }
}
</style>
