<template>
    <div class="description-pane">
        <div class="description-pane__title pane">{{dialog.t(217)}}</div>
        <scroll-pane class="description-pane__scroll">
            <slot></slot>
        </scroll-pane>
    </div>
</template>

<script>
import ScrollPane from './ScrollPane'

import dialogPromise from '../dialog'

export default {
    name: 'description-pane',
    components: {
        ScrollPane
    },
    asyncComputed: {
        dialog: {
            get: () => dialogPromise,
            default: { t: () => null }
        }
    }
}
</script>

<style>
.description-pane {
    white-space: pre-line;
}

.description-pane__title,
.description-pane__scroll .pane {
    background: rgb(16, 20, 47);
}

.description-pane__title {
    margin: 1px 1px 3px;
}

.description-pane__scroll {
    height: 90%;
    margin: 3px 1px 0;
}

.description-pane__scroll .pane {
    text-align: left;
}

</style>


