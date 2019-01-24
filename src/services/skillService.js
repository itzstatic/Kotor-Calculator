import filesPromise from '../backend/files'

import attributeServicePromise from './attributeService'
import { AttributeId } from '../enums'

export default (async () => {
    const files = await filesPromise
        , skills = files.getSkills()
        , classes = files.getClasses()
        , attributeService = await attributeServicePromise

    function getSkills(build) {
        return skills.map((skill, index) => ({
            name: skill.name
            , description: skill.description
            , rank: build.getBaseSkillRank(index)
            , min: build.getBaseSkillRank(index)
            , max: getMaximumRank(skill, build)
            , isClassSkill: isClassSkill(skill, build)
            , pointCost: getPointCost(skill, build)
        }))
    }

    function isClassSkillExact(skill, classId) {
        return skill.relatedClassIds.includes(classId)
    }

    function getRecommendedSkillRanks(skills, build) {
        const skillPriorities = skills.querySelectorAll(build.currentClassId + '_reco').
            map(reco => Number(reco.textContent))
            , classSkillIndices = getSkillIndicesSortedByPriority(skillPriorities)
            , result = skills.map(skill => skill.rank)

        let remainingPoints = 16
        remainingPoints = spendOnSkills(result, build.remainingPoints, classSkillIndices, 
            build.currentClassId, build.level)

        return result
    }

    function canIncrease(skillIndex, build, remainingPoints, skillRank) {
        return skillRank < getMaximumRank(skills[skillIndex], build) &&
            remainingPoints >= getPointCost(skills[skillIndex], build)
    }
    
    function getPointCost(skill, build) {
        return isClassSkill(skill, build) ? 1 : 2
    }
    
    function isClassSkill(skill, build) {
        return isClassSkillExact(skill, build.baseClass) || 
            isClassSkillExact(skill, build.jediClass)
    }

    function getMaximumRank(skill, build) {
        return isClassSkill(skill, build) ? build.level + 3
            : (build.level + 3) / 2
    }

    function spendOnSkills(skillRanks, remainingPoints, skillIndices, build) {
        for (const skillIndex of skillIndices) {
            if (!remainingPoints) {
                break
            }
            const maxSpendable = getMaximumRank(skillIndex, build) - skillRanks[skillIndex]
                , delta = Math.min(build.remainingPoints, maxSpendable)
            
            remainingPoints -= delta
            skillRanks[skillIndex] += delta
        }
    }

    function getRemainingPoints(build) {
        return build.skillPoints + getGainedSkillPoints(build)
    }

    function getGainedSkillPoints(build) {
        const intelligenceRank = 8 + build.getCurrentAttributeIncreases(AttributeId.Intelligence)
            , intelligenceMod = attributeService.getModifierFromRank(intelligenceRank)
            , base = classes.find(clazz => clazz.id === build.currentClassId).skillPoints / 2
        
        return Math.max(1, build.level === 1 ? 
            (base + Math.max(intelligenceMod, 0)) * 4
            : base + Math.floor(intelligenceMod / 2))
    }
    
    return {
        getSkills
        , isClassSkill
        , getPointCost
        , getRecommendedSkillRanks
        , canIncrease
        , getMaximumRank
        , getRemainingPoints
    }
})()

function getSkillIndicesSortedByPriority(skillPriorities) {
    return skillPriorities.map((p, i) => ({
        priority: p,
        index: i
    })).filter(x => x.priority).
        map(x => x.index).
        sort((a, b) => b - a)
}