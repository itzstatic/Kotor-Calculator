<template>
    <div class="scroll-pane" :class="cssClass">
        <hr
        ><div class="scroll-pane__scroll">
            <div class="scroll-pane__flex">
                <div class="scroll-pane__content pane">
                    <slot></slot>
                </div>
            </div>
        </div
        ><hr>
    </div>
</template>

<script>
export default {
    name: 'scroll-pane',
    props: {
        left: Boolean
    },
    computed: {
        cssClass() {
            return  {
                'scroll-pane--left': this.left
            }
        }
    }
}
</script>

<style>

.scroll-pane {
    margin-top: 1px;
    margin-bottom: 2px;
    position: relative;
    /*display: grid;
    grid-template-rows: 1px calc(100% - 2px) 1px;*/
}

.scroll-pane__scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
}

.scroll-pane--left .scroll-pane__scroll {
    direction: rtl;
}

.scroll-pane__flex {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.scroll-pane__content {
    flex-grow: 1;
    direction: ltr;
    box-sizing: border-box;
    padding: 4px;
    margin-right: 2px;
    margin-left: 0;
    border-top: none;
    border-bottom: none;
}

.scroll-pane--left .scroll-pane__content {
    margin-left: 2px;
}

hr {
    display: block;
    height: 0;
    margin: 0;
    border: 0;
    border-bottom: 1px solid var(--border-color);
    width: calc(100% - 17px);
}

.scroll-pane--left hr {
    margin-left: 17px;
    width: calc(100% - 19px);
}

hr:last-child {
    margin-bottom: 2px;
}
</style>


