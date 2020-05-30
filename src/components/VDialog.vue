<template>
    <transition name="fade3" @after-leave="close">
        <div
            class="vdialog js-vdialog-overlay"
            :class="{ 'vdialog--pinned': isPinned }"
            :style="{ zIndex }"
            v-show="visible"
        >
            <div class="vdialog__inner-wrap" @click.self="processOverlayClick">
                <div class="vdialog__inner" :style="{ maxWidth: `${maxWidth}px` }">
                    <div class="u-content_h3 vdialog__header">
                        <div class="vdialog__title">
                            <h5>
                                <slot name="header">
                                    Title
                                </slot>
                            </h5>
                        </div>

                        <i
                            class="material-icons vdialog__close-btn"
                            :class="{ 'vdialog__close-btn--disabled': !ableToBeClosed }"
                            @click="triggerClose"
                            >clear</i
                        >
                    </div>

                    <div class="vdialog__content">
                        <slot></slot>
                    </div>

                    <div class="vdialog__footer">
                        <slot name="footer" :closePopup="triggerClose"></slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import Vue from 'vue';
import { Component, Prop, Ref } from 'vue-property-decorator';

@Component({
    name: 'VDialog',
})
export default class VDialog extends Vue {
    // Отображается ли сейчас диалог
    visible = false;

    // "Заморожен" ли сейчас диалог (в диалоге отображается лоадер загрузки)
    frozen = false;

    // Можно ли сейчас закрыть диалог
    ableToBeClosed = true;

    // Входные параметры:
    // Максимальная ширина диалога
    @Prop({ type: Number, default: 1000 }) maxWidth;

    // ZIndex диалога
    @Prop({ type: Number, default: 9999 }) zIndex;

    // Если false, диалог будет отцентрирован вертикально, если true - прибит к верху
    @Prop({ type: Boolean, default: false }) isPinned;

    // Нужно ли подтверждать закрытие диалога
    @Prop({ type: Boolean, default: false }) confirmClose;

    // Ссылка на инстанс диалога подтверждения закрытия
    @Ref() confirmCloseDialog;

    /**
     * Открыть текущий диалог
     */
    open() {
        this.visible = true;
        document.addEventListener('keyup', this.keyUpHandler);
    }

    /**
     * Манипуляции с диалогом при помощи клавиатуры
     */
    keyUpHandler(event) {
        if (event.which === /* esc */ 27) {
            this.triggerClose();
        }
    }

    /**
     * При полном закрытии диалога (после окончания анимации исчезновения) подчищаем хендлеры событий,
     * разблокируем возможность скролла страницы
     */
    close() {
        this.$emit('close');
        document.removeEventListener('keyup', this.keyUpHandler);
    }

    /**
     * Закрыть текущий диалог
     * Запускает анимацию закрытия диалога. После окончания анимации вызывается метод close(),
     * который подчищает эвенты диалога
     */
    triggerClose() {
        if (!this.ableToBeClosed) {
            return;
        }

        this.frozen = false;
        this.visible = false;
    }

    /**
     * "Заморозить диалог" (показать лоадер поверх контента диалога)
     */
    freezeDialog() {
        this.frozen = true;
    }

    /**
     * "Разморозить диалог" (скрыть лоадер поверх контента диалога)
     */
    unfreezeDialog() {
        this.frozen = false;
    }

    /**
     * Метод установки возможности закрытия диалога
     */
    setAbleToClose(state) {
        this.ableToBeClosed = state;
    }

    /**
     * Обработка клика по оверлею диалога
     */
    processOverlayClick() {
        if (this.confirmClose) {
            this.confirmCloseDialog.open();
        } else {
            this.triggerClose();
        }
    }

    mounted() {
        // После окончания рендера диалога перемещаем его в конец body, чтобы не было проблем
        // с z-index'ами и диалог был поверх всех элементов
        // todo: Как ПУ перейдет полностью на Vue, использовать vue-portal
        document.body.appendChild(this.$el);
    }

    beforeDestroy() {
        // При уничтожении компонента удаляем элемент диалога
        this.$el.remove();
        document.removeEventListener('keyup', this.keyUpHandler);
    }
}
</script>

<style scoped lang="scss">
.vdialog {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.55);
    overflow-y: scroll;
    overflow-x: hidden;

    &__inner-wrap {
        padding: 12px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100% - 12px * 2);
        cursor: pointer;
    }

    &--pinned &__inner-wrap {
        align-items: flex-start;
    }

    &__inner {
        background-color: #fafafa;
        box-sizing: border-box;
        width: calc(100% - 12px);
        height: auto;
        padding: 18px;
        border-radius: 6px;
        cursor: default;
        position: relative;
    }

    &__title {
        max-width: calc(100% - 24px);
        width: 100%;
    }

    &__header {
        display: flex;
        align-items: center;
        margin-bottom: 12px !important;
        padding: 0 !important;
        position: relative;
        line-height: 24px;
    }

    &__loader-wrap {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.6);
        z-index: 2;
        border-radius: inherit;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__close-btn {
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 0;

        &--disabled {
            opacity: 0.5;
        }
    }

    &__footer {
        margin-top: 6px;
    }

    &__confirm-dialog-content {
        margin: 12px 0;
    }
}
</style>
