<template>
    <k-layout class="feat-screen" :title="title" :modals="modals"
        :subtitle="dialog.t(232)" @cancel="cancel()" @ok="ok()"
    >
        <div class="feat-screen__header" slot="header">
            <div class="pane">
                <span>{{name}}</span>
            </div>
            <div class="pane">
                <span>{{remainingFeats}}</span>
                <span>{{dialog.t(32062)}}</span>
            </div>
        </div>
    
        <scroll-pane class="feat-screen__content" :left="true" slot="left">
            <div v-for="(featProgression, index) in featProgressions"
                :key="index"
            >
                <ability-input v-for="feat in featProgression" 
                    :key="feat.name"
                    :ref="feat.name"
                    v-model="feat.learned"
                    :img="'static/png/icons/' + feat.icon + '.png'"
                    @activate="activeFeat = feat" 
                    :active="feat === activeFeat"
                    :enabled="enabled(feat)"
                    @add="add(feat)"
                    @remove="remove(feat)"
                    @try-add="tryAdd(feat)"
                    @try-remove="tryRemove(feat)"  	
                />
            </div>
        </scroll-pane>
    
        <div slot="right">
            <description-pane>{{description}}</description-pane>
            <div class="btn-container pane">
                <div @click="interact()" class="btn btn--feat-interact">{{featInteractLabel}}</div>
            </div>
        </div>
    
        <template slot="modals">
            <k-modal v-model="youHaveGainedModal">
                {{dialog.t(48215)}}
            </k-modal>
            
            <k-modal v-model="prerequisitesNotMetModal">
                {{dialog.t(42184)}}        
            </k-modal>
            
            <k-modal v-model="alreadyTakenModal">
                {{dialog.t(42182)}}
            </k-modal>
            
            <k-modal v-model="requiredFeatModal">
                {{dialog.t(42183)}}    
            </k-modal>
            
            <k-modal v-model="noneAvailableModal">
                {{dialog.t(42530)}}    
            </k-modal>

            <k-modal class="modal--granted" v-model="youHaveBeenGrantedModal">
                <div>{{dialog.t(42258)}}</div>
                <div class="modal--granted__feats">
                    <ability-tile v-for="(feat, index) in grantedFeats" :key="index" 
                        :img="'static/png/icons/' + feat.icon + '.png'"
                        :label="feat.name"
                    />
                </div>
            </k-modal>
        </template>
    </k-layout>
</template>

<script>
import KModal from '../KotorModal'
import KLayout from '../KotorLayout'
import DescriptionPane from '../DescriptionPane'
import AbilityInput from '../AbilityInput'
import ScrollPane from '../ScrollPane'
import AbilityTile from '../AbilityTile'

import { mapState, mapGetters } from 'vuex'
import Mutations from '../../store/mutations'
import dialogPromise from '../../dialog'
import featServicePromise from '../../services/featService'

export default {
    name: 'feat-screen',
    components: {
        KModal, KLayout, DescriptionPane, AbilityInput, ScrollPane, AbilityTile
    },
    props: {
        title: String
    },
	data() {
        return {
            activeFeat: null,
            remainingFeats: 0,
            learnedFeats: [],
            featProgressions: [],
            youHaveGainedModal: false,
            prerequisitesNotMetModal: false,
            alreadyTakenModal: false,
            requiredFeatModal: false,
            noneAvailableModal: false,
            youHaveBeenGrantedModal: false
        }
    },
    asyncComputed: {
        dialog: {
            get: () => dialogPromise,
            default: { t: () => null }
        },
        featService: () => featServicePromise
    },
    computed: {
        modals() {
            return this.youHaveGainedModal || this.prerequisitesNotMetModal || this.alreadyTakenModal || 
                this.requiredFeatModal || this.noneAvailableModal || this.youHaveBeenGrantedModal
        },
        build() {
            return { ...this.$store.state, ...this.$store.getters }
        },
        featInteractLabel() {
            return this.activeFeat && 
                (this.dialog.t(this.activeFeat.learned ? 38456 : 38455)
                    + ' ' + this.dialog.t(42487))
        },
        grantedFeats() {
            return (this.featService && this.featService.getGrantedFeats(this.build)) || []
        },
        name() {
            return this.activeFeat && this.activeFeat.name
        },
        description() {
            return this.activeFeat && this.activeFeat.description
        }
    },
    methods: {
        async opened() {
            this.$store.commit(Mutations.DiscardFeats)
            const featService = await featServicePromise

            this.featProgressions = featService.getFeatProgressions(this.build)
            this.activeFeat = this.featProgressions[0][0]
            this.remainingFeats = featService.getGainedFeatCount(this.build)

            if (this.grantedFeats.length) {
                this.youHaveBeenGrantedModal = true
                const grantedFeatIds = this.grantedFeats.map(feat => feat.index)
                this.$store.commit(Mutations.GrantFeats, grantedFeatIds)
            }
        },
        cancel() {
            this.$emit('prev')
        },
        ok() {
            if (this.remainingFeats > 0) {
                this.youHaveGainedModal = true
            } else {
                this.$emit('next')
            }
        },
        interact() {
            //since the feat inputs are in iteration, each ref returns an array
            this.activeFeat && this.$refs[this.activeFeat.name][0].input()
        },
        add(feat) {
            this.remainingFeats--
            this.$store.commit(Mutations.AddFeat, this.activeFeat.index)
        },
        remove(feat) {
            this.remainingFeats++
            this.$store.commit(Mutations.RemoveFeat, this.activeFeat.index)
        },
        tryAdd(feat) {
            if (this.canLearn(feat)) {
                this.noneAvailableModal = true
            } else {
                this.prerequisitesNotMetModal = true
            }
        },
        tryRemove(feat) {
            if (!this.featService) {
                return
            }
            if (this.featService.justGranted(feat, this.build)) {
                this.requiredFeatModal = true
            } else {
                this.alreadyTakenModal = true
            }
        },
        canLearn(feat) {
            return this.featService && this.featService.canLearn(feat, this.build)
        },
        enabled(feat) {
            if (!this.featService) {
                return false
            }
            if (this.featService.alreadyLearned(feat, this.build)) {
                return false
            }
            if (this.canLearn(feat)) {
                if (this.remainingFeats === 0) {
                    return feat.learned
                }
                return true             
            }
            return false
        }
    }
}
</script>

<style>
.feat-screen__header {
    display: grid;
    grid-template-columns: 50% 50%;
}

.feat-screen__header > * {
    line-height: 250%;
}

.feat-screen__content .scroll-pane__content > div {
    display: grid;
    grid-template-columns: repeat(3, auto);
}

.feat-screen .description-pane {
    height: 260.5px;
    margin-bottom: 4px;
}

.feat-screen .btn-container {
    margin-top: 2px;
}

.btn.btn--feat-interact {
    width: 80%;
    margin: 1px auto;
}

.modal--granted__feats {
    direction: rtl;
    overflow-y: scroll;
    height: 120px;
    margin: 12px auto;
}

.modal--granted__feats > * {
    direction: ltr;
}
</style>

