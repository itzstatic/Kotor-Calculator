<template>
    <k-layout class="power-screen" :title="title" :modals="modals"
        :subtitle="dialog.t(1072)" @cancel="cancel()" @ok="ok()"
    >
        <div class="power-screen__header" slot="header">
            <div class="pane">
                <span>{{name}}</span>
            </div>
            <div class="pane">
                <span>{{remainingPowers}}</span>
                <span>{{dialog.t(1074)}}</span>
            </div>
        </div>

        <scroll-pane slot="left" :left="true">
            <table>
                <tr v-for="(powerProgression, index) in powerProgressions" :key="index">
                    <td v-for="power in powerProgression" :key="power.name">
                        <ability-input 
                            :ref="power.name"
                            v-model="power.learned"
                            :img="'static/png/icons/' + power.icon + '.png'"
                            @activate="activePower = power" 
                            :active="power === activePower"
                            :enabled="enabled(power)"
                            @add="add(power)"
                            @remove="remove(power)"
                            @try-add="tryAdd(power)"
                            @try-remove="tryRemove(power)"  
                        />
                    </td>
                </tr>
            </table>
        </scroll-pane>
        
        <div slot="right">
            <description-pane>{{description}}</description-pane>
            <div class="btn-container pane">
                <div @click="interact()" class="btn btn--power-interact">{{powerInteractLabel}}</div>
            </div>
        </div>

        <template slot="modals">
            <k-modal v-model="youHaveGainedModal">
                {{dialog.t(48210)}}
            </k-modal>

            <k-modal v-model="prerequisitesNotMetModal">
                {{dialog.t(42186)}}
            </k-modal>

            <k-modal v-model="alreadyTakenModal">
                {{dialog.t(42185)}}
            </k-modal>

            <k-modal v-model="noneAvailableModal">
                {{dialog.t(42529)}}
            </k-modal>
        </template>
    </k-layout>
</template>

<script>
import KLayout from '../KotorLayout'
import KModal from '../KotorModal'
import ScrollPane from '../ScrollPane'
import DescriptionPane from '../DescriptionPane'
import AbilityInput from '../AbilityInput'

import Mutations from '../../store/mutations'
import dialogPromise from '../../dialog'
import powerServicePromise from '../../services/powerService'

export default {
    name: 'power-screen',
    components: {
        KLayout, KModal, ScrollPane, DescriptionPane, AbilityInput
    },
    props: {
        title: String
    },
    data() {
        return {
            activePower: null,
            remainingPowers: 0,
            powerProgressions: [],
            youHaveGainedModal: false,
            prerequisitesNotMetModal: false,
            alreadyTakenModal: false,
            noneAvailableModal: false
        }
    },
    asyncComputed: {
        dialog: {
            get: () => dialogPromise,
            default: { t: () => null }
        },
        powerService: () => powerServicePromise 
    },
    computed: {
        powerInteractLabel() {
            return this.activePower && 
                (this.dialog.t(this.activePower.learned ? 38456 : 38455)
                    + ' ' + this.dialog.t(42488))
        },
        build() {
            return { ...this.$store.state, ...this.$store.getters }
        },
        modals() {
            return this.youHaveGainedModal || this.prerequisitesNotMetModal ||
                this.alreadyTakenModal || this.noneAvailableModal
        },
        name() {
            return this.activePower && this.activePower.name
        },
        description() {
            return this.activePower && this.activePower.description
        }
    },
    methods: {
        async opened() {
            this.$store.commit(Mutations.DiscardPowers)
            const powerService = await powerServicePromise

            this.powerProgressions = powerService.getPowerProgressions(this.build)
            this.activePower = this.powerProgressions[0][0]
            this.remainingPowers = powerService.getGainedPowerCount(this.build)
        },
        cancel() {
            this.$emit('prev')
        },
        ok() {
            if (this.remainingPowers > 0) {
                this.youHaveGainedModal = true
            } else {
                this.$emit('next')
            }
        },
        enabled(power) {
            if (!this.powerService) {
                return false
            }
            if (this.powerService.alreadyLearned(power, this.build)) {
                return false
            }
            if (this.powerService.canLearn(power, this.build)) {
                if (this.remainingPowers === 0) {
                    return power.learned
                }
                return true             
            }
            return false
        },
        interact() {
            this.activePower && this.$refs[this.activePower.name][0].input()
        },
        add(power) {
            this.remainingPowers--
            this.$store.commit(Mutations.AddPower, this.activePower.index)
        },
        remove(power) {
            this.remainingPowers++
            this.$store.commit(Mutations.RemovePower, this.activePower.index)
        },
        tryAdd(power) {
            if (this.powerService.canLearn(power, this.build)) {
                this.noneAvailableModal = true
            } else {
                this.prerequisitesNotMetModal = true
            }
        },
        tryRemove(power) {
            this.alreadyTakenModal = true
        }
    }
}
</script>

<style>
.power-screen__header {
    display: grid;
    grid-template-columns: 50% 50%;
}

.power-screen__header > * {
    line-height: 250%;
}

.power-screen__content .scroll-pane__content > div {
    display: grid;
    grid-template-columns: repeat(3, auto);
}

.power-screen .description-pane {
    height: 260.5px;
    margin-bottom: 4px;
}

.power-screen .btn-container {
    margin-top: 2px;
}

.btn.btn--power-interact {
    width: 80%;
    margin: 1px auto;
}
</style>
