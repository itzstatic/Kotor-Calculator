import filesPromise from '../backend/files'
import { connect } from '../connect'

export default (async() => {
    const files = await filesPromise
        , feats = files.getFeats()
        , gains = files.getFeatGains()
        , progressions = connect(feats)

    function getFeatProgressions(build) {  
        function shouldListFeat(feat) {
            if (feat.name.startsWith('XXXX')) {
                return false
            }
            return shouldListFeatForClass(feat, build, build.baseClass) ||
                shouldListFeatForClass(feat, build, build.jediClass)
        }

        function shouldListFeatForClass(feat, build, classId) {
            if (!classId) {
                return false
            }
            const list = feat.lists[classId]
            return list === 0 || list === 1 ||
                (feat.learned && list === 3) ||
                (justGranted(feat, build) && list === 3)
        }

        return progressions.map(progression => 
            progression.map(feat => ({
                name: feat.name
                , description: feat.description
                , icon: feat.icon
                , index: feat.index
                , learned: alreadyLearned(feat, build)
            })).filter(shouldListFeat)
        ).filter(progression => progression.length)
    }

    function getGainedFeatCount(build) {
        return gains[build.currentLevel - 1][build.currentClassId]
    }

    function canLearn(feat, build) {
        return feat.level <= build.level && 
            feat.prerequisites.every(p => alreadyLearned(feats[p], build))
    }

    function justGranted(feat, build) {
        return feat.grants[build.currentClassId] === build.currentLevel &&
            !build.hasLearnedFeat(feat)
    }

    function getGrantedFeats(build) {
        return feats.filter(feat => justGranted(feat, build))
    }

    function alreadyLearned(feat, build) {
        return justGranted(feat, build) || build.hasLearnedFeat(feat)
    }

    function getLearnedFeats(build) {
        return feats.filter(feat => alreadyLearned(feat, build))
    }

    return {
        getFeatProgressions
        , getGainedFeatCount
        , canLearn
        , justGranted
        , getGrantedFeats
        , alreadyLearned
        , getLearnedFeats
    }
})()