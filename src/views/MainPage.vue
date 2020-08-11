<template>
    <base-page-layout>
        <template slot="pageTitle">
            {{ translateText('placesSearch') }}
        </template>

        <template slot="topMenu">
            <button class="btn btn-success btn-sm left-button" @click="showAddPlaceDialog">
                {{ translateText('addPlace') }}
            </button>

            <button
                class="btn btn-success btn-sm"
                @click="$router.push('/admin')"
                v-if="user && user.isAdmin"
            >
                {{ translateText('controlPanel') }}
            </button>
        </template>

        <div class="main-page">
            <div class="main-page__map">
                <div id="mapid"></div>

                <button
                    @click="mobileMenuOpened = !mobileMenuOpened"
                    class="btn btn-primary main-page__mobile-menu-btn"
                    style=""
                >
                    {{ mobileMenuOpened ? 'Close menu' : 'Open menu' }}
                </button>
            </div>

            <div
                class="main-page__filters"
                :class="{
                    'main-page__filters-mobile': isMobileMode,
                    'main-page__filters-mobile--open': isMobileMode && mobileMenuOpened,
                }"
            >
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
                <button class="btn btn-primary left-button" @click="addReview">
                    {{ translateText('addReview') }}
                </button>

                <button class="btn btn-secondary" @click="addReviewDialog.triggerClose()">
                    {{ translateText('close') }}
                </button>
            </template>
        </v-dialog>

        <template v-if="addPlacePopupShown">
            <v-dialog ref="addPlaceDialog" :max-width="1000" @close="addPlacePopupShown = false">
                <template slot="header">
                    {{ translateText('addPlaceDialogTitle') }}
                </template>

                <place-form ref="placeForm"></place-form>

                <template slot="footer">
                    <button class="btn btn-primary left-button" @click="addPlace">
                        {{ translateText('addPlace') }}
                    </button>

                    <button class="btn btn-secondary" @click="addPlaceDialog.triggerClose()">
                        {{ translateText('close') }}
                    </button>
                </template>
            </v-dialog>
        </template>
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
import { UserPublicData } from '@/index.d';
import store from '@/store';
import BasePageLayout from './BasePageLayout.vue';
import PlaceInfo from '../components/PlaceInfo.vue';
import Filters from '../components/Filters.vue';
import VDialog from '../components/VDialog.vue';
import Review from '../components/Review.vue';
import PlaceForm from '../components/PlaceForm.vue';

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
        PlaceForm,
    },
    async beforeRouteEnter(to: any, from: any, next: any) {
        try {
            await store.dispatch('user/loadUser');
            await store.dispatch('filters/loadFilters');

            next();
        } catch (error) {
            eventBus.$emit('notify-error', error.response.data.error);
        }
    },
})
export default class MainPage extends Vue {
    @userModule.Action('loadUser') loadUser!: Function;

    @filtersModule.Action('loadFilters') loadFilters!: Function;

    @userModule.State('user') user!: UserPublicData;

    @filtersModule.State('dataLoading') filtersLoading!: boolean;

    @Ref() addReviewDialog!: any;

    @Ref() addPlaceDialog!: any;

    @Ref() placeForm!: any;

    selectedPlace: any = null;

    selectedPlaceCircle: any = null;

    placesLoading = false;

    reviews: any = null;

    reviewsLoading = false;

    reviewsShown = false;

    reviewRating = 3;

    reviewComment = '';

    addPlacePopupShown = false;

    map!: any;

    layer!: any;

    mobileMenuOpened = false;

    isMobileMode = false;

    async mounted() {
        const { L } = window;

        this.map = L.map('mapid');
        this.zoomToPoint(cherkasyCenter.lat, cherkasyCenter.lng, 14);

        L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);

        this.layer = L.layerGroup().addTo(this.map);

        const resizeListener = () => {
            this.isMobileMode = window.innerWidth < 900;

            if (this.map) {
                // eslint-disable-next-line no-underscore-dangle
                this.map._onResize();
            }
        };

        window.addEventListener('resize', resizeListener);

        this.$on('hook:beforeDestroy', () => {
            window.removeEventListener('resize', resizeListener);
        });

        resizeListener();
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

            const { placeMeanRating, placeReviewCount } = response.data;

            this.reviews.push(response.data.review);
            this.selectedPlace.meanRating = placeMeanRating;
            this.selectedPlace.reviewsCount = placeReviewCount;

            this.addReviewDialog.triggerClose();

            this.reviewComment = '';
            this.reviewRating = 3;

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
            const response = await axios.post('/reviews/remove', {
                reviewId: review.id,
            });

            const { placeMeanRating, placeReviewCount } = response.data;

            this.reviews = this.reviews.filter((item: any) => item !== review);
            this.selectedPlace.meanRating = placeMeanRating;
            this.selectedPlace.reviewsCount = placeReviewCount;

            eventBus.$emit('notify-success', this.translateText('reviewRemoved'));
        } catch (error) {
            eventBus.$emit('notify-error', error.response.data.error);
        }
    }

    showAddPlaceDialog() {
        this.addPlacePopupShown = true;

        this.$nextTick(() => {
            this.addPlaceDialog.open();
        });
    }

    async addPlace() {
        const placeData = this.placeForm.getPlaceData();

        try {
            await axios.post('/places/add', placeData);
            this.addPlaceDialog.triggerClose();

            eventBus.$emit('notify-success', this.translateText('placeAdded'));
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
    position: relative;

    &__map {
        flex: 1;
    }

    &__filters {
        flex-basis: 350px;
        padding: 12px 18px;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #fff;
        z-index: 999;
    }

    &__filters-mobile {
        position: absolute;
        right: 0;
        bottom: 0;
        top: 0;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }

    &__filters-mobile--open {
        transform: translateX(0);
    }

    &__categories-cb {
        margin-bottom: 0;
    }

    &__mobile-menu-btn {
        z-index: 9999;
        position: fixed;
        left: 5px;
        bottom: 5px;
    }
}

.reviews-block {
    margin-top: 12px;
}
</style>
