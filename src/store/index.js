import Mutations from './mutations'

function LevelUp() {
    this.attributes = [0, 0, 0, 0, 0, 0]
    this.skills = [0, 0, 0, 0, 0, 0, 0, 0]
    this.feats = []
    this.grantedFeats = []
    this.powers = []
}

export default {
    state: {
        levelUps: [],
        baseClass: 'sol',
        baseLevel: 0,
        jediClass: null,
        skillPoints: 0,
        currentLevelUp: new LevelUp(),
        currentSkillPoints: 0
    },
    getters: {
        level: state => state.levelUps.length + 1
        , currentLevel: (state, getters) => getters.level - state.baseLevel
        , currentClassId: state=> state.jediClass || state.baseClass
        , hasLearnedFeat: state => feat => {
            return state.levelUps.some(levelUp => 
                levelUp.feats.includes(feat.index) ||
                levelUp.grantedFeats.includes(feat.index)
            )
        }
        , hasLearnedPower: state => powerIndex => {
            return state.levelUps.some(levelUp =>
                levelUp.powers.includes(powerIndex)
            )
        }
        , getBaseAttributeIncreases: state => attributeIndex => {
            return state.levelUps.
                map(levelUp => levelUp.attributes[attributeIndex]).
                reduce((sum, rank) => sum + rank, 0)    
        }
        , getBaseSkillRank: state => skillIndex => {
            return state.levelUps.
                map(levelUp => levelUp.skills[skillIndex]).
                reduce((sum, rank) => sum + rank, 0)
        }
        , getCurrentAttributeIncreases: (state, getters) => attributeIndex => {
            return getters.getBaseAttributeIncreases(attributeIndex) +
                state.currentLevelUp.attributes[attributeIndex]
        }
    },
    mutations: {
        [Mutations.Jedi] (state, jediClass) {
            state.jediClass = jediClass
            state.baseLevel = state.levelUps.length
        },
        [Mutations.LevelUp] (state) {
            state.levelUps.push(state.currentLevelUp)
            state.skillPoints = state.currentSkillPoints
            state.currentLevelUp = new LevelUp()
        },
        [Mutations.SkillPoints] (state, count) {
            state.currentSkillPoints = count
        },
        [Mutations.IncreaseAttribute] (state, index) {
            state.currentLevelUp.attributes[index]++
        },
        [Mutations.DecreaseAttribute] (state, index) {
            state.currentLevelUp.attributes[index]--
        },
        [Mutations.DiscardAttributes] (state) {
            state.currentLevelUp.attributes.fill(0)
        },
        [Mutations.IncreaseSkill] (state, index) {
            state.currentLevelUp.skills[index]++
        },
        [Mutations.DecreaseSkill] (state, index) {
            state.currentLevelUp.skills[index]--
        },
        [Mutations.DiscardSkills] (state) {
            state.currentLevelUp.skills.fill(0)
            state.currentSkillPoints = 0
        },
        [Mutations.GrantFeats] (state, featIndices) {
            state.currentLevelUp.grantedFeats = featIndices
        },
        [Mutations.AddFeat] (state, featIndex) {
            state.currentLevelUp.feats.push(featIndex)
        },
        [Mutations.DiscardFeats] (state) {
            state.currentLevelUp.feats = []
        },
        [Mutations.RemoveFeat] (state, featIndex) {
            const index = state.currentLevelUp.feats.indexOf(featIndex)
            if (index >= 0) {
                state.currentLevelUp.feats.splice(index, 1)
            }
        },
        [Mutations.AddPower] (state, powerIndex) {
            state.currentLevelUp.powers.push(powerIndex)
        },
        [Mutations.RemovePower] (state, powerIndex) {
            const index = state.currentLevelUp.powers.indexOf(powerIndex)
            if (index >= 0) {
                state.currentLevelUp.powers.splice(index, 1)
            }
        },
        [Mutations.DiscardPowers] (state) {
            state.currentLevelUp.powers = []
        }
    }
}