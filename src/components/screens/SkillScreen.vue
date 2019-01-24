<template>
    <k-layout class="skill-screen" :subtitle="dialog.t(233)" 
        @cancel="cancel()" @ok="ok()" :modals="modals" :title="title" 
    >
        <div class="skill-screen__header" slot="header">
            <div class="skill-screen__remaining-points pane">
                <span>{{dialog.t(210)}}</span>
                <span>{{remainingPoints}}</span>
            </div>
            <div class="skill-screen__header__right">
                <div class="pane">{{pointCost}}</div>
                <div class="pane">{{dialog.t(218)}}</div>
                <div class="pane">{{skillType}}</div>
            </div>
        </div>

        <div class="skill-screen__content" slot="left">
            <div v-for="(skill, index) in skills" :key="skill.name" class="pane stat" 
                @mouseover="activeSkillIndex = index"
            >
                <div class="stat__name-container">
                    <div class="stat__name">{{skill.name}}</div>
                </div>
                <number-input v-model="skill.rank" @increase="increase()" 
                    @decrease="decrease()" :min="skill.min" :max="skill.max" 
                    :disableIncrease="!canIncrease(index, skill.rank)" 
                    :active="activeSkillIndex === index"
                />
            </div>
        </div>

        <description-pane slot="right">{{description}}</description-pane>
        
        <template slot="modals">
            <k-modal v-model="remainingPointsModal">
                {{dialog.t(41815)}}
                <template slot="controls">
                    <div class="btn" @click="remainingPointsModal = false">No</div>
                    <div class="btn" @click="yes()">Yes</div>
                </template>
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
import skillServicePromise from '../../services/skillService'
import dialogPromise from '../../dialog'

export default {
    name: 'skill-screen',
    components: {
        KModal, KLayout, DescriptionPane, NumberInput
    },
    props: {
        title: String
    },
    data() {
        return {
            activeSkillIndex: 0,
            skills: [],
            remainingPoints: 0,
            remainingPointsModal: false
        }
    },
    asyncComputed: {
        skillService: () => skillServicePromise,
        dialog: {
            get: () => dialogPromise,
            default: { t: () => null }
        }
    },
    computed: {
        build() {
            return { ...this.$store.getters, ...this.$store.state }
        },
        activeSkill() {
            return this.skills && this.skills[this.activeSkillIndex]
        },
        modals() {
            return this.remainingPointsModal
        },
        skillType() {
            return this.activeSkill &&
                this.dialog.t(this.activeSkill.isClassSkill ? 38152 : 38153)
        },
        pointCost() {
            return this.activeSkill && this.activeSkill.pointCost
        },
        description() {
            return this.activeSkill && this.activeSkill.description
        }
    },
    methods: {
        async opened() {
            this.$store.commit(Mutations.DiscardSkills)
            const skillService = await skillServicePromise
            
            this.skills = skillService.getSkills(this.build)
            this.remainingPoints = skillService.getRemainingPoints(this.build)
        },
        canIncrease(skillIndex, skillRank) {
            return this.skillService && 
                this.skillService.canIncrease(skillIndex, this.build, this.remainingPoints, skillRank)
        },
        cancel() {
            this.$emit('prev')
        },
        ok() {
            this.$store.commit(Mutations.SkillPoints, this.remainingPoints)
            if (this.remainingPoints > 0) {
                this.remainingPointsModal = true
            } else {
                this.$emit('next')
            }
        },
        yes() {
            this.remainingPointsModal = false
            this.$emit('next')
        },
        increase() {
            this.remainingPoints -= this.pointCost
            this.$store.commit(Mutations.IncreaseSkill, this.activeSkillIndex)
        },
        decrease(){
            this.remainingPoints += this.pointCost
            this.$store.commit(Mutations.DecreaseSkill, this.activeSkillIndex)
        }
    }
}
</script>

<style>
.skill-screen__header {
  display: grid;
  grid-template-columns: 50% 50%;
}

.skill-screen__header__right {
  display: grid;
  grid-template-areas: 
    'a b b b b b b b b b'
    'c c c c c c c c c c'
}

.skill-screen__header__right > :nth-child(1) {
  grid-area: a;
}
.skill-screen__header__right > :nth-child(2) {
  grid-area: b;
  border-top-right-radius: 50px;
}
.skill-screen__header__right > :nth-child(3) {
  grid-area: c;
  text-align: left;
}

.skill-screen__content {
  display: grid;
}
</style>

