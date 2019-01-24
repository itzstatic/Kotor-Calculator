<template>
    <div class="number-input" :class="cssClass">
        <div class="number-input__decrease" :style="decreaseStyle" @click="decrease()"></div>
        <div class="number-input__value">
            <div>{{value}}</div>
        </div>
        <div class="number-input__increase" :style="increaseStyle" @click="increase()"></div>
    </div>
</template>

<script>
export default {
    name: 'number-input',
    props: {
        value: Number,
        min: Number,
        max: Number,
        active: Boolean,
        disableIncrease: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        decreaseStyle() {
            return {
                visibility : this.value > this.min ? 'visible' : 'hidden'
            }
        },
        increaseStyle() {
            return {
                visibility: this.value < this.max && !this.disableIncrease ? 'visible' : 'hidden'
            }
        },
        cssClass() {
            return {
                'number-input--active': this.active
            }
        }
    },
    methods: {
        decrease() {
            this.$emit('input', this.value - 1)
            this.$emit('decrease')
        },
        increase() {
            this.$emit('input', this.value + 1)
            this.$emit('increase')
        }
    }
}
</script>

<style>
.number-input {
  display: grid;
  grid-template-columns: auto 40% auto;
}

.number-input__increase,
.number-input__decrease {
    position: relative;
}

.number-input__increase::before,
.number-input__decrease::before {
    content: '';
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    /*84deg computed based on primary color*/
    filter: brightness(50%) saturate(100) hue-rotate(84deg);
    background-repeat: no-repeat;
    background-position: center;
}

.number-input__increase::before {
    background-image: url(/static/png/lbl_rightminus.png);
}

.number-input__decrease::before {
    background-image: url(/static/png/lbl_leftplus.png);
}

.number-input__value {
  vertical-align: middle;
}

.number-input__value > div {
  position: relative;
  top: 50%;
  transform: translateY(-50%)
}
</style>