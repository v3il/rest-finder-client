import Vue, { VNode } from 'vue';

declare global {
    namespace JSX {
        // tslint:disable no-empty-interface
        interface Element extends VNode {}

        // tslint:disable no-empty-interface
        interface ElementClass extends Vue {}

        interface IntrinsicElements {
            [elem: string]: any;
        }
    }

    interface Window {
        gapi: any;
        FB: any;
        L: any;
    }
}

declare module 'vue/types/vue' {
    interface Vue {
        translateText: Function;
    }

    interface VueConstructor {
        translateText: Function;
    }
}
