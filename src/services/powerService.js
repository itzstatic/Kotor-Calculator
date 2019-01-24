import filesPromise from '../backend/files'

import { connect } from '../connect'

export default (async () => {
    const files = await filesPromise
        , powers = files.getPowers()
        , gains = files.getPowerGains()
        , progressions = connect(powers)

    function getPowerProgressions(build) {
        function shouldListPower(power) {
            return !power.name.endsWith('XXX')
        }

        function shouldListProgression(progression) {
            return progression.length && progression.some(power => power.tier === 2)
        }

        return progressions.map(progression => 
            progression.map(power => ({
                ...power
                , learned: build.hasLearnedPower(power.index)
            })).filter(shouldListPower)
        ).filter(shouldListProgression)
    }

    function getGainedPowerCount(build) {
        return gains[build.currentLevel - 1][build.currentClassId] || 0
    }

    function canLearn(power, build) {
        return power.level <= build.level && 
            power.prerequisites.every(p => alreadyLearned(powers[p], build))
    }

    function alreadyLearned(power, build) {
        return build.hasLearnedPower(power.index)
    }

    return {
        getPowerProgressions
        , getGainedPowerCount
        , canLearn
        , alreadyLearned
    }
})()