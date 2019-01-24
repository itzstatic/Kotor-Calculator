<template>
    <div class="modal" :class="cssClass">
        <div class="modal__content">
            <slot></slot>
        </div>
        <div class="modal__controls">
            <slot name="controls">
                <div class="btn" @click="ok()">OK</div>
            </slot>
        </div>
    </div>    
</template>

<script>
export default {
    name: 'k-modal',
    props: {
        value: Boolean
    },
    computed: {
        cssClass() {
            return {
                'modal--active' : this.value
            }
        }
    },
    methods: {
        ok() {
            this.$emit('input', false)
        }
    }
}
</script>

<style>
.modal {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  display: none;
  max-width: 50%;
  text-align: center;
  margin: auto;
  border: 1px solid rgb(83, 99, 157);
  color: var(--primary-color);
  border-radius: 12px;
  background-color: black;
  opacity: 0.8;
  padding: 16px 10px;
}

.modal--active {
  display: block;
}

.modal .btn {
  border: 1px solid;
  background-color: black;
  border-radius: 8px;
}
</style>


