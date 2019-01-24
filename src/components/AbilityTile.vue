<template>
    <div class="ability-tile">
        <div class="ability-tile__icon">
            <img :src="img" />
        </div>
        <div class="ability-tile__label">
            <span>{{label}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ability-tile',
    props: {
        img: String,
        label: String
    }
}
</script>

<style>
.ability-tile {
    text-align: left;
    display: grid;
    grid-template-columns: auto 1fr;
}

.ability-tile > * {
    position: relative;
    margin: 3px;
    border: 1px solid;
    border-radius: 12px;
}

.ability-tile:not(:last-child) {
    margin-bottom: 10px
}

.ability-tile__icon {
    text-align: center;
    box-sizing: content-box;
}

.ability-tile__icon > img {
    border-radius: 50%;
    vertical-align: middle;
    width: 48px;
    height: 48px;
}

.ability-tile__label > span {
    position: absolute;
    top: 50%;
    left: 8px;
    transform: translateY(-50%);
}
</style>

