<template>
    <base-page-layout>
        <template slot="pageTitle">
            {{ translateText('placesSearch') }}
        </template>

        <div class="main-page">
            <div class="main-page__map">
                <div id="mapid" style=""></div>
            </div>

            <div class="main-page__filters">
                <div v-if="filtersLoading">Loading...</div>

                <div class="main-page__place-info" v-else-if="selectedPlace">
                    {{ selectedPlace }}

                    <button class="btn btn-secondary btn-block" @click="closePlaceInfo">
                        {{ translateText('close') }}
                    </button>
                </div>

                <div v-else class="main-page__filters-content">
                    <h6>{{ translateText('categories') }}</h6>

                    <div class="form-group">
                        <select
                            multiple
                            class="form-control"
                            :size="filters.categories.length / 2"
                            v-model="selectedCategories"
                        >
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
                            <option v-for="cost in filters.costs" :value="cost.id" :key="cost.id">{{
                                cost.name
                            }}</option>
                        </select>
                    </div>

                    <h6>{{ translateText('companySizes') }}</h6>

                    <div class="form-group">
                        <select class="form-control" v-model="selectedCompanySize">
                            <option
                                v-for="companySize in filters.companySizes"
                                :value="companySize.id"
                                :key="companySize.id"
                                >{{ companySize.name }}</option
                            >
                        </select>
                    </div>

                    <h6>{{ translateText('restDurations') }}</h6>

                    <div class="form-group">
                        <select class="form-control" v-model="selectedRestDuration">
                            <option
                                v-for="restDuration in filters.restDurations"
                                :value="restDuration.id"
                                :key="restDuration.id"
                                >{{ restDuration.name }}</option
                            >
                        </select>
                    </div>

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

                    <button class="btn btn-primary btn-block" @click="findPlaces">
                        {{ translateText('findPlaces') }}
                    </button>
                </div>
            </div>
        </div>
    </base-page-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import VueSlider from 'vue-slider-component';

import { namespace } from 'vuex-class';
import { FiltersData } from '@/index.d';
import eventBus from '@/eventBus';
import BasePageLayout from './BasePageLayout.vue';

import axios from '../axios';

const userModule = namespace('user');
const filtersModule = namespace('filters');

const cherkasyCenter = {
    lat: 49.4257529,
    lng: 32.0580019,
};

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

@Component({
    name: 'MainPage',
    components: {
        BasePageLayout,
        VueSlider,
    },
})
export default class MainPage extends Vue {
    @userModule.Action('loadUser') loadUser!: Function;

    @filtersModule.Action('loadFilters') loadFilters!: Function;

    @filtersModule.State('filters') filters!: FiltersData;

    @filtersModule.State('dataLoading') filtersLoading!: boolean;

    selectedCategories = [0];

    selectedCost = 0;

    selectedRestDuration = 0;

    selectedCompanySize = 0;

    selectedRestType = 0;

    selectedDistance = 0;

    findWorkingOnly = true;

    distanceFilterAllowed = navigator.geolocation;

    distanceSliderDisabled = true;

    selectedPlace = null;

    selectedPlaceCircle: any = null;

    map!: any;

    layer!: any;

    get distanceString() {
        return this.selectedDistance === 0
            ? this.translateText('anyVariant3')
            : this.translateText('distanceDescription', [this.selectedDistance]);
    }

    async created() {
        this.loadUser();
        this.loadFilters();

        if (this.distanceFilterAllowed) {
            const queryResult = await navigator.permissions.query({ name: 'geolocation' });

            this.distanceSliderDisabled = queryResult.state !== 'granted';

            queryResult.onchange = () => {
                this.distanceSliderDisabled = queryResult.state !== 'granted';
            };

            getGeoPosition();
        }
    }

    async mounted() {
        const { L } = window;

        this.map = L.map('mapid');
        this.zoomToPoint(cherkasyCenter.lat, cherkasyCenter.lng, 14);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);

        this.layer = L.layerGroup().addTo(this.map);
    }

    async findPlaces() {
        const { L } = window;

        const params: any = {};

        const selectedCategories = this.selectedCategories.filter((categoryId) => categoryId > 0);

        if (selectedCategories.length) {
            params.categories = selectedCategories;
        }

        if (this.selectedCost > 0) {
            params.restCost = this.selectedCost;
        }

        if (this.selectedRestDuration > 0) {
            params.restDuration = this.selectedRestDuration;
        }

        if (this.selectedCompanySize > 0) {
            params.companySize = this.selectedCompanySize;
        }

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

        this.layer.clearLayers();

        try {
            const places = await axios.get('/places', { params });

            places.data.places.forEach((place: any) => {
                const marker = L.marker([place.latitude, place.longitude]).addTo(this.layer);

                marker.on('click', () => {
                    this.selectedPlace = place;
                    this.zoomToPoint(place.latitude, place.longitude, 18);

                    if (this.selectedPlaceCircle) {
                        this.selectedPlaceCircle.remove();
                    }

                    this.selectedPlaceCircle = L.circle([place.latitude, place.longitude], {
                        radius: 20,
                    }).addTo(this.map);

                    console.log(this.selectedPlaceCircle);
                });
            });

            this.zoomToPoint(cherkasyCenter.lat, cherkasyCenter.lng, 13);

            eventBus.$emit(
                'notify-success',
                this.translateText('loadedPlaceCount', [places.data.places.length]),
            );
        } catch (error) {
            eventBus.$emit('notify-error', error.response.data.error);
        }
    }

    zoomToPoint(latitude: number, longitude: number, zoom: number) {
        this.map.setView([latitude, longitude], zoom);
    }

    closePlaceInfo() {
        this.selectedPlace = null;
        this.zoomToPoint(cherkasyCenter.lat, cherkasyCenter.lng, 13);

        if (this.selectedPlaceCircle) {
            this.selectedPlaceCircle.remove();
            this.selectedPlaceCircle = null;
        }
    }
}
</script>

<style scoped lang="scss">
#mapid {
    height: 100%;
}

.main-page {
    display: flex;
    height: 100%;

    &__map {
        flex: 1;
    }

    &__filters {
        flex-basis: 400px;
        padding: 12px 18px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    &__categories-cb {
        margin-bottom: 0;
    }
}
</style>
