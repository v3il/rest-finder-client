<template>
    <div class="place-form">
        <div class="form-group">
            <label for="place-name">{{ translateText('placeNameLabel') }}</label>
            <input type="text" class="form-control" id="place-name" v-model="placeName" />
            <small class="form-text text-muted">{{ translateText('placeNameHint') }} </small>
        </div>

        <div class="form-group">
            <label for="place-name">{{ translateText('placeLocation') }}</label>
            <div id="placeFormMap" class="place-form__map"></div>
        </div>

        <div class="form-group">
            <label for="place-name">{{ translateText('categories') }}</label>

            <select
                multiple
                class="form-control"
                :size="filters.categories.length / 2"
                v-model="categories"
            >
                <option
                    v-for="category in filters.categories"
                    :key="category.id"
                    :value="category.id"
                    >{{ category.name }}</option
                >
            </select>
        </div>

        <div class="form-group">
            <label for="place-name">{{ translateText('costs') }}</label>

            <select class="form-control" v-model="restCost">
                <option v-for="cost in filters.costs" :value="cost.id" :key="cost.id">{{
                    cost.name
                }}</option>
            </select>
        </div>

        <div class="form-group">
            <label for="place-name">{{ translateText('companySizes') }}</label>

            <select class="form-control" v-model="companySize">
                <option
                    v-for="companySize in filters.companySizes"
                    :value="companySize.id"
                    :key="companySize.id"
                    >{{ companySize.name }}</option
                >
            </select>
        </div>

        <div class="form-group">
            <label for="place-name">{{ translateText('restDurations') }}</label>

            <select class="form-control" v-model="restDuration">
                <option
                    v-for="restDuration in filters.restDurations"
                    :value="restDuration.id"
                    :key="restDuration.id"
                    >{{ restDuration.name }}</option
                >
            </select>
        </div>

        <div class="form-group">
            <label for="place-name">{{ translateText('restTypes') }}</label>

            <select class="form-control" v-model="restType">
                <option :value="1">{{ translateText('activeRestType') }}</option>
                <option :value="2">{{ translateText('passiveRestType') }}</option>
            </select>
        </div>

        <div class="form-group">
            <label for="place-name">{{ translateText('placePeriods') }}</label>

            <div class="form-group period-picker" v-for="(period, index) in periods" :key="index">
                <select
                    v-model="period.dayStart"
                    :disabled="period.dayOff || period.worksAllDay"
                    class="period-picker__start-day-picker"
                >
                    <option :value="period.dayStart">{{
                        translateText(`daysOfWeek.${period.dayStart}`)
                    }}</option>
                </select>

                <input
                    type="time"
                    class="period-picker__start-time-picker"
                    :value="period.timeStart"
                    :disabled="period.dayOff || period.worksAllDay"
                />

                <span class="period-picker__separator">&mdash;</span>

                <input
                    type="time"
                    class="period-picker__end-time-picker"
                    :value="period.timeEnd"
                    :disabled="period.dayOff || period.worksAllDay"
                />

                <select
                    v-model="period.dayEnd"
                    class="period-picker__end-day-picker"
                    :disabled="period.dayOff || period.worksAllDay"
                >
                    <option :value="period.dayEnd">{{
                        translateText(`daysOfWeek.${period.dayEnd}`)
                    }}</option>

                    <option :value="period.dayEnd + 1 === 7 ? 0 : period.dayEnd + 1">{{
                        translateText(
                            `daysOfWeek.${period.dayEnd + 1 === 7 ? 0 : period.dayEnd + 1}`,
                        )
                    }}</option>
                </select>

                <div>
                    <div class="form-check">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            :id="`period${index}-day-off`"
                            v-model="period.dayOff"
                            :disabled="period.worksAllDay"
                        />

                        <label class="form-check-label" :for="`period${index}-day-off`">{{
                            translateText('placeDayOff')
                        }}</label>
                    </div>

                    <div class="form-check">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            :id="`period${index}-works-all-day`"
                            v-model="period.worksAllDay"
                            :disabled="period.dayOff"
                        />

                        <label class="form-check-label" :for="`period${index}-works-all-day`">{{
                            translateText('placeWorksAllDay')
                        }}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { FiltersData } from '@/index.d';
import eventBus from '@/eventBus';

const filtersModule = namespace('filters');

const cherkasyCenter = {
    lat: 49.4257529,
    lng: 32.0580019,
};

@Component({
    name: 'PlaceForm',
})
export default class PlaceForm extends Vue {
    placeName = '';

    placeLatitude = 0;

    placeLongitude = 0;

    restDuration = 1;

    restCost = 1;

    companySize = 1;

    categories = [1];

    restType = 1;

    periods: any = [];

    map!: any;

    layer!: any;

    marker!: any;

    @filtersModule.State('filters') filters!: FiltersData;

    @Prop({ default: null }) place!: any;

    created() {
        this.periods = Array.from({ length: 7 }).map((_, index) => {
            return {
                dayStart: index,
                dayOff: false,
                worksAllDay: false,
                dayEnd: index,
                timeStart: '09:00',
                timeEnd: '18:00',
            };
        });

        if (this.place) {
            this.placeName = this.place.name;
            this.placeLatitude = this.place.latitude;
            this.placeLongitude = this.place.longitude;
        }
    }

    mounted() {
        const { L } = window;

        this.map = L.map('placeFormMap');
        this.zoomToPoint(cherkasyCenter.lat, cherkasyCenter.lng, 14);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);

        this.layer = L.layerGroup().addTo(this.map);

        this.marker = L.marker([
            this.placeLatitude || cherkasyCenter.lat,
            this.placeLongitude || cherkasyCenter.lng,
        ]).addTo(this.layer);

        L.circle([cherkasyCenter.lat, cherkasyCenter.lng], {
            radius: 1000 * 6,
        }).addTo(this.map);

        this.map.on('click', (data: any) => {
            const clickPoint = data.latlng;

            if (this.isPointInsideCherkasy(clickPoint)) {
                this.marker.setLatLng(clickPoint);
            } else {
                eventBus.$emit('notify-error', this.translateText('placeIsNotInCherkasy'));
            }
        });

        this.$nextTick(() => {
            // eslint-disable-next-line no-underscore-dangle
            this.map._onResize();
        });
    }

    zoomToPoint(latitude: number, longitude: number, zoom: number) {
        this.map.setView([latitude, longitude], zoom);
    }

    isPointInsideCherkasy(pointToCheck: { lat: number; lng: number }) {
        const circleCenter = cherkasyCenter;
        const cherkasyRadius = 6;

        const latitudeKmPerDegree = 40000 / 360;
        const longitudeKmPerDegree =
            Math.cos((Math.PI * circleCenter.lat) / 180.0) * latitudeKmPerDegree;

        const latitudeDelta = Math.abs(circleCenter.lng - pointToCheck.lng) * longitudeKmPerDegree;
        const longitudeDelta = Math.abs(circleCenter.lat - pointToCheck.lat) * latitudeKmPerDegree;

        return (
            Math.sqrt(latitudeDelta * latitudeDelta + longitudeDelta * longitudeDelta) <=
            cherkasyRadius
        );
    }
}
</script>

<style scoped lang="scss">
.place-form {
    &__map {
        height: 300px;
    }
}

.period-picker {
    &__start-day-picker {
        width: 130px;
        margin-right: 12px;
        height: 30px;
    }

    &__separator {
        margin: 0 12px;
    }

    &__end-time-picker {
        margin-right: 12px;
    }

    &__end-day-picker {
        width: 130px;
        height: 30px;
        vertical-align: bottom;
    }
}
</style>
