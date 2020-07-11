<template>
    <div class="main-page__filters-content">
        <h6>{{ translateText('categories') }}</h6>

        <div class="form-group">
            <select
                multiple
                class="form-control"
                :size="filters.categories.length / 2"
                v-model="selectedCategories"
            >
                <option :value="0">{{ translateText('anyVariant2') }}</option>

                <option
                    v-for="category in filters.categories"
                    :key="category.id"
                    :value="category.id"
                    >{{ category.name }}</option
                >
            </select>
        </div>

        <h6>{{ translateText('costs') }}</h6>

        <div class="form-group">
            <select class="form-control" v-model="selectedCost">
                <option :value="0">{{ translateText('anyVariant2') }}</option>

                <option v-for="cost in filters.costs" :value="cost.id" :key="cost.id">{{
                    cost.name
                }}</option>
            </select>
        </div>

        <!--        <h6>{{ translateText('companySizes') }}</h6>-->

        <!--        <div class="form-group">-->
        <!--            <select class="form-control" v-model="selectedCompanySize">-->
        <!--                <option :value="0">{{ translateText('anyVariant1') }}</option>-->

        <!--                <option-->
        <!--                    v-for="companySize in filters.companySizes"-->
        <!--                    :value="companySize.id"-->
        <!--                    :key="companySize.id"-->
        <!--                    >{{ companySize.name }}</option-->
        <!--                >-->
        <!--            </select>-->
        <!--        </div>-->

        <!--        <h6>{{ translateText('restDurations') }}</h6>-->

        <!--        <div class="form-group">-->
        <!--            <select class="form-control" v-model="selectedRestDuration">-->
        <!--                <option :value="0">{{ translateText('anyVariant2') }}</option>-->

        <!--                <option-->
        <!--                    v-for="restDuration in filters.restDurations"-->
        <!--                    :value="restDuration.id"-->
        <!--                    :key="restDuration.id"-->
        <!--                    >{{ restDuration.name }}</option-->
        <!--                >-->
        <!--            </select>-->
        <!--        </div>-->

        <h6>{{ translateText('restTypes') }}</h6>

        <div class="form-group">
            <select class="form-control" v-model="selectedRestType">
                <option :value="0">{{ translateText('anyVariant1') }}</option>
                <option :value="1">{{ translateText('activeRestType') }}</option>
                <option :value="2">{{ translateText('passiveRestType') }}</option>
            </select>
        </div>

        <h6>
            {{ translateText('distanceToPlace') }}
            <span class="badge badge-secondary">{{ distanceString }}</span>
        </h6>

        <div class="form-group" v-if="distanceFilterAllowed">
            <vue-slider
                v-model="selectedDistance"
                :min="0"
                :max="6"
                :interval="0.5"
                :disabled="distanceSliderDisabled"
            />

            <small class="form-text text-muted" v-if="distanceSliderDisabled"
                >{{ translateText('distancePermissions') }}
            </small>
        </div>

        <div class="form-group form-check">
            <input
                type="checkbox"
                class="form-check-input"
                id="working-only"
                v-model="findWorkingOnly"
            />

            <label class="form-check-label" for="working-only">{{
                translateText('findWorkingOnly')
            }}</label>
        </div>

        <button
            class="btn btn-primary btn-block"
            @click="emitPlacesSearch"
            :disabled="placesLoading"
        >
            {{ translateText('findPlaces') }}
        </button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import VueSlider from 'vue-slider-component';

import { FiltersData } from '@/index.d';
import { namespace } from 'vuex-class';
import eventBus from '@/eventBus';
import { Prop } from 'vue-property-decorator';

const getGeoPosition = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve(position.coords);
            },
            (error) => {
                reject(error);
            },
        );
    });
};

const filtersModule = namespace('filters');

@Component({
    name: 'PlaceInfo',
    components: {
        VueSlider,
    },
})
export default class PlaceInfo extends Vue {
    selectedCategories = [0];

    selectedCost = 0;

    // selectedRestDuration = 0;
    //
    // selectedCompanySize = 0;

    selectedRestType = 0;

    selectedDistance = 0;

    findWorkingOnly = false;

    distanceFilterAllowed = navigator.geolocation;

    distanceSliderDisabled = true;

    @filtersModule.State('filters') filters!: FiltersData;

    @Prop() placesLoading!: boolean;

    get distanceString() {
        return this.selectedDistance === 0
            ? this.translateText('allCity')
            : this.translateText('distanceDescription', [this.selectedDistance]);
    }

    async created() {
        if (this.distanceFilterAllowed) {
            const queryResult = await navigator.permissions.query({ name: 'geolocation' });

            this.distanceSliderDisabled = queryResult.state !== 'granted';

            queryResult.onchange = () => {
                this.distanceSliderDisabled = queryResult.state !== 'granted';
            };

            getGeoPosition();
        }
    }

    async emitPlacesSearch() {
        const params: any = {};

        const selectedCategories = this.selectedCategories.filter((categoryId) => categoryId > 0);

        if (selectedCategories.length) {
            params.categories = selectedCategories;
        }

        if (this.selectedCost > 0) {
            params.restCost = this.selectedCost;
        }

        // if (this.selectedRestDuration > 0) {
        //     params.restDuration = this.selectedRestDuration;
        // }
        //
        // if (this.selectedCompanySize > 0) {
        //     params.companySize = this.selectedCompanySize;
        // }

        if (this.selectedRestType > 0) {
            params.restType = this.selectedRestType === 1;
        }

        if (this.distanceFilterAllowed && !this.distanceSliderDisabled) {
            try {
                if (this.selectedDistance > 0) {
                    const geoPosition = (await getGeoPosition()) as Coordinates;

                    params.distance = this.selectedDistance;
                    params.userLatitude = geoPosition.latitude;
                    params.userLongitude = geoPosition.longitude;
                }
            } catch (error) {
                eventBus.$emit('notify-error', error.message);
            }
        }

        if (this.findWorkingOnly) {
            params.workingOnly = true;
        }

        this.$emit('search-places', params);
    }
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
