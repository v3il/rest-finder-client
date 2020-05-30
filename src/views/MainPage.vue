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
                <span v-if="filtersLoading">{{ translateText('filtersLoading') }}</span>

                <place-info
                    v-else-if="selectedPlace"
                    :place-info="selectedPlace"
                    @close-info="closePlaceInfo"
                ></place-info>

                <filters v-else @search-places="findPlaces" />
            </div>
        </div>
    </base-page-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import VueSlider from 'vue-slider-component';

import { namespace } from 'vuex-class';
import eventBus from '@/eventBus';
import BasePageLayout from './BasePageLayout.vue';
import PlaceInfo from '../components/PlaceInfo.vue';
import Filters from '../components/Filters.vue';

import axios from '../axios';

const userModule = namespace('user');
const filtersModule = namespace('filters');

const cherkasyCenter = {
    lat: 49.4257529,
    lng: 32.0580019,
};

@Component({
    name: 'MainPage',
    components: {
        BasePageLayout,
        VueSlider,
        PlaceInfo,
        Filters,
    },
})
export default class MainPage extends Vue {
    @userModule.Action('loadUser') loadUser!: Function;

    @filtersModule.Action('loadFilters') loadFilters!: Function;

    @filtersModule.State('dataLoading') filtersLoading!: boolean;

    selectedPlace = null;

    selectedPlaceCircle: any = null;

    map!: any;

    layer!: any;

    async created() {
        this.loadUser();
        this.loadFilters();
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

    async findPlaces(params: any) {
        const { L } = window;

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
