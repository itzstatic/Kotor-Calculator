<template>
    <k-layout class="attribute-screen" :title="title" 
        @ok="ok()" :modals="modals" :subtitle="dialog.t(209)"
    >
        <div class="attribute-screen__header" slot="header">
            <div class="attribute-screen__remaining-points pane">
                <span>{{dialog.t(210)}}</span>
                <span>{{remainingPoints}}</span>
            </div>
            <div class="attribute-screen__header__right">
                <div class="pane">{{pointCost}}</div>
                <div class="pane">{{dialog.t(218)}}</div>
                <div class="pane">{{modifier}}</div>
                <div class="pane">{{dialog.t(32112)}}</div>
            </div>
        </div>

        <div class="attribute-screen__content" slot="left">
            <div v-for="(attribute, index) in attributes" :key="attribute.name" 
                class="pane stat" @mouseover="activeAttributeIndex = index"
            >
                <div class="stat__name-container">
                    <div class="stat__name">{{attribute.name}}</div>
                </div>
                <number-input v-model="attribute.rank" @increase="increase()" @decrease="decrease()"
                    :min="attribute.min" :max="max" :disableIncrease="!canIncrease(attribute.rank)"
                    :active="activeAttributeIndex === index"
                />
            </div>
        </div>

        <description-pane slot="right">{{description}}</description-pane>
        
        <template slot="modals">
            <k-modal v-model="mustSpendAllPointsModal">
                {{dialog.t(48217)}}
            </k-modal>
        </template>
    </k-layout>
</template>

<script>
import KModal from '../KotorModal'
import KLayout from '../KotorLayout'
import DescriptionPane from '../DescriptionPane'
import NumberInput from '../NumberInput'

import { mapGetters } from 'vuex'
import Mutations from '../../store/mutations'
import attributeServicePromise from '../../services/attributeService'
import dialogPromise from '../../dialog'

export default {
    name: 'attribute-screen',
    components: {
        KModal, KLayout, DescriptionPane, NumberInput
    },
    props: {
        title: String
    },
	data() {
        return {
            activeAttributeIndex: 0,
            attributes: [],
            remainingPoints: 0,
            mustSpendAllPointsModal: false
        }
    },
    asyncComputed: {
        attributeService: () => attributeServicePromise,
        dialog: {
            get: () => dialogPromise,
            default: { t: () => null }
        }
    },
    computed: {
        activeAttribute() {
            return this.attributes && this.attributes[this.activeAttributeIndex]
        },
        modals() {
            return this.mustSpendAllPointsModal
        },
        build() {
            return { ...this.$store.getters, ...this.$store.state }
        },
        ...mapGetters(['level']),
        description() {
            return this.activeAttribute && this.activeAttribute.description
        },
        pointCost() {
            return this.activeAttribute && 
                this.attributeService.getPointCostFromRank(this.activeAttribute.rank, this.level)
        },
        modifier() {
            const mod = this.activeAttribute && 
                this.attributeService.getModifierFromRank(this.activeAttribute.rank)

            return mod > 0 ? '+' + mod
                : mod === 0 ? '-'
                : mod
        },
        pointRefund() {
            return this.activeAttribute &&
                this.attributeService.getPointCostToRank(this.activeAttribute.rank, this.level)
        },
        max() {
            return this.attributeService &&
                this.attributeService.getMaximumRank(this.level)
        }
    },
    methods: {
        async opened() {
            this.$store.commit(Mutations.DiscardAttributes)
            const attributeService = await attributeServicePromise
            this.remainingPoints = attributeService.getRemainingPoints(this.level)
            this.attributes = attributeService.getAttributes(this.build)
        },
        canIncrease(attributeRank) {
            return this.attributeService && 
                this.attributeService.canIncrease(attributeRank, this.level, this.remainingPoints)
        },
        ok() {
            if (this.remainingPoints > 0) { 
                this.mustSpendAllPointsModal = true
            } else { 
                this.$emit('next')
            }
        },
        increase() {
            this.remainingPoints -= this.pointRefund
            this.$store.commit(Mutations.IncreaseAttribute, this.activeAttributeIndex)
        },
        decrease() {
            this.remainingPoints += this.pointCost
            this.$store.commit(Mutations.DecreaseAttribute, this.activeAttributeIndex)
        }
    }
}
</script>

<style>
.attribute-screen__header {
  display: grid;
  grid-template-columns: 50% 50%;
}

.attribute-screen__header__right {
  display: grid;
  grid-template-columns: 10% auto;
  grid-template-rows: 50% 50%;
}

.attribute-screen__header__right > :nth-of-type(even) {
  border-top-right-radius: 50px;
}

.attribute-screen__remaining-points > * {
  vertical-align: middle;
}

.attribute-screen__content {
  display: grid;
}
</style>


