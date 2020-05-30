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

                <template v-else-if="selectedPlace && reviewsShown">
                    <button class="btn btn-primary btn-block" @click="addReviewDialog.open()">
                        {{ translateText('addReview') }}
                    </button>

                    <button class="btn btn-secondary btn-block" @click="reviewsShown = false">
                        {{ translateText('close') }}
                    </button>

                    <div class="reviews-block">
                        <div v-if="!reviews" class="reviews-block__loading">
                            <span class="bold-label">{{ translateText('reviewsLoading') }}</span>
                        </div>

                        <div
                            v-else-if="reviews && reviews.length === 0"
                            class="reviews-block__no-reviews"
                        >
                            <span class="bold-label">{{ translateText('noReviews') }}</span>
                        </div>

                        <div v-else>
                            <review
                                v-for="review in reviews"
                                :review="review"
                                :key="review.id"
                                @remove-comment="removeReview(review)"
                            ></review>
                        </div>
                    </div>
                </template>

                <template v-else-if="selectedPlace">
                    <place-info :place-info="selectedPlace"></place-info>

                    <button class="btn btn-primary btn-block" @click="loadReviews">
                        {{ translateText('loadReviews') }}
                    </button>

                    <button class="btn btn-secondary btn-block" @click="closePlaceInfo">
                        {{ translateText('close') }}
                    </button>
                </template>

                <filters
                    v-show="!filtersLoading && !selectedPlace"
                    @search-places="findPlaces"
                    :places-loading="placesLoading"
                />
            </div>
        </div>

        <v-dialog ref="addReviewDialog" :max-width="600">
            <template slot="header">
                {{ translateText('addReviewDialogTitle') }}
            </template>

            <div class="form-group">
                <label for="reviewRating">{{ translateText('rating') }}</label>

                <rating-bar
                    id="reviewRating"
                    :mark="reviewRating"
                    @mark-updated="reviewRating = $event"
                ></rating-bar>
            </div>

            <div class="form-group">
                <label for="reviewComment">{{ translateText('comment') }}</label>

                <textarea
                    class="form-control"
                    id="reviewComment"
                    rows="10"
                    maxlength="1000"
                    v-model="reviewComment"
                ></textarea>

                <small class="form-text text-muted">{{ translateText('reviewCommentHint') }}</small>
            </div>

            <template slot="footer">
                <button class="btn btn-primary" @click="addReview">
                    {{ translateText('addReview') }}
                </button>

                <button class="btn btn-secondary" @click="addReviewDialog.triggerClose()">
                    {{ translateText('close') }}
                </button>
            </template>
        </v-dialog>
    </base-page-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import VueSlider from 'vue-slider-component';

import { namespace } from 'vuex-class';
import eventBus from '@/eventBus';
import { Ref } from 'vue-property-decorator';

import RatingBar from '@/components/RatingBar.vue';
import BasePageLayout from './BasePageLayout.vue';
import PlaceInfo from '../components/PlaceInfo.vue';
import Filters from '../components/Filters.vue';
import VDialog from '../components/VDialog.vue';
import Review from '../components/Review.vue';

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
        VDialog,
        Review,
        RatingBar,
    },
})
export default class MainPage extends Vue {
    @userModule.Action('loadUser') loadUser!: Function;

    @filtersModule.Action('loadFilters') loadFilters!: Function;

    @filtersModule.State('dataLoading') filtersLoading!: boolean;

    @Ref() addReviewDialog!: any;

    selectedPlace: any = null;

    selectedPlaceCircle: any = null;

    placesLoading = false;

    reviews: any = null;

    reviewsLoading = false;

    reviewsShown = false;

    reviewRating = 3;

    reviewComment = '';

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

        this.placesLoading = true;

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

        this.placesLoading = false;
    }

    async loadReviews() {
        this.reviewsShown = true;

        if (!this.reviews) {
            try {
                const response = await axios.get('/reviews', {
                    params: { placeId: this.selectedPlace.id },
                });

                this.reviews = response.data.reviews;
            } catch (error) {
                eventBus.$emit('notify-error', error.response.data.error);
            }
        }
    }

    async addReview() {
        try {
            const response = await axios.post('/reviews/add', {
                placeId: this.selectedPlace.id,
                comment: this.reviewComment,
                rating: +this.reviewRating,
            });

            this.reviews.push(response.data.review);
            this.addReviewDialog.triggerClose();

            eventBus.$emit('notify-success', this.translateText('reviewAdded'));
        } catch (error) {
            eventBus.$emit('notify-error', error.response.data.error);
        }
    }

    zoomToPoint(latitude: number, longitude: number, zoom: number) {
        this.map.setView([latitude, longitude], zoom);
    }

    closePlaceInfo() {
        this.reviews = null;
        this.selectedPlace = null;

        this.zoomToPoint(cherkasyCenter.lat, cherkasyCenter.lng, 13);

        if (this.selectedPlaceCircle) {
            this.selectedPlaceCircle.remove();
            this.selectedPlaceCircle = null;
        }
    }

    async removeReview(review: any) {
        try {
            await axios.post('/reviews/remove', {
                reviewId: review.id,
            });

            this.reviews = this.reviews.filter((item: any) => item !== review);

            eventBus.$emit('notify-success', this.translateText('reviewRemoved'));
        } catch (error) {
            eventBus.$emit('notify-error', error.response.data.error);
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

.reviews-block {
    margin-top: 12px;
}
</style>
