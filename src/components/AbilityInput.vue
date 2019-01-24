<template>
    <div class="ability-input" :class="cssClass" @click="activate()" @dblclick="input()">
	    <img :src="img" />
    </div>
</template>

<script>
export default {
    name: 'ability-input',
    props: {
        value: Boolean,
        img: String,
        enabled: {
            type: Boolean,
            default: true
        },
        active: Boolean
    },
    methods: {
        activate() {
            this.$emit('activate')
        },
        input() {
            if (this.enabled) {
                this.$emit('input', this.enabled != this.value)
                if (this.value) {
                    this.$emit('remove')
                } else {
                    this.$emit('add')
                }
            } else {
                if (this.value) {
                    this.$emit('try-remove')
                } else {
                    this.$emit('try-add')
                }
            }
        }
    },
    computed: {
        cssClass() {
            return {
                'ability-input--enabled': this.enabled,
                'ability-input--checked': this.value,
                'ability-input--active': this.active
            }
        }
    }    
}
</script>

<style>
.ability-input {
  display: inline-block;
  position: relative;
  margin: 6px;
  width: 52px;
  height: 52px;
  background-image: linear-gradient(rgb(41, 44, 50), rgb(25, 28, 34));
  border-radius: 6px;
}

.ability-input > img,
.ability-input::after {
  position: absolute;
  width: 84%;
  height: 84%;
  left: 8%;
  top: 8%;
}

.ability-input > img {
  z-index: 2;
  pointer-events: none;
}

.ability-input::after {
  content: '';
  display: block;
  z-index: 1;
  border-radius: 5px;
  box-shadow: inset 1px 2px 3px 2px rgb(13, 15, 26), inset -1px -3px 8px 3px rgb(41, 41, 51);
}

/* Out of level range */
.ability-input:not(.ability-input--enabled):not(.ability-input--checked) {
  opacity: 0.5;
}

/* In level range, or already obtained */
.ability-input--enabled, .ability-input--checked {
  opacity: 1;
}

/* Obtained (Green) */
.ability-input--checked:not(.ability-input--selected) {
  box-shadow: inset 0 0 4px 3px rgba(0, 255, 0, 0.4), 0 0 4px 1px rgba(0, 255, 0, 0.4);
}
</style>


