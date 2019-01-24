<template>
    <div class="layout">
        <div class="layout__title pane">{{title}}</div>
        <div class="layout__subtitle pane">{{subtitle}}</div>

        <slot class="layout__header" name="header"></slot>
        
        <div class="layout__content">
            <slot name="left"></slot>
            <slot name="right"></slot>
        </div>
        <div class="layout__footer">
            <div class="btn" @click="recommended()">Recommended</div>
            <div class="btn" @click="ok()">OK</div>
            <div class="btn" @click="cancel()">Cancel</div>
        </div>
        
        <div class="layout__modal-container" :class="modalContainerCssClass">
            <slot name="modals"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'k-layout',
    props: {
        title: String,
        subtitle: String,
        modals: Boolean   
    },
    methods: {
        recommended() {
            this.$emit('recommended')
        },
        ok() {
            this.$emit('ok')
        },
        cancel() {
            this.$emit('cancel')
        }
    },
    computed: {
        modalContainerCssClass() {
            return {
                'layout__modal-container--active': this.modals
            }
        }
    }
}
</script>

<style>
.layout {
  width: 600px;
  position: relative;
}

.pane, 
.layout ::-webkit-scrollbar-track,
.description-pane__content {
  border: 1px solid var(--border-color);
}

.pane {
  text-align: center;
  margin: 1px;
}

.layout__title {
  text-align: center;
  display: inline-block;
  width: 80%;
  left: 10%;
  position: relative;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
}

.layout__subtitle {
  text-align: center;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
}

.layout__content {
  display: grid;
  grid-template-columns: 50% 50%;
  margin: 2px auto;
}

.layout__content > * {
  height: 300px;
}

.layout__footer,
.btn-container {
  text-align: center;
  background: rgb(0, 34, 72);
}

.layout__modal-container {
  display: none;
  background: none;
  border: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.layout__modal-container--active {
  display: block;
}
</style>