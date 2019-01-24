import attributeServicePromise from './attributeService'
import skillServicePromise from './skillService'

export function serialize(build = { levelUps, baseClass, jediClass, baseLevel, skillPoints }) {
    return Buffer.from(JSON.stringify(build)).toString('base64')
}

export function deserialize(str) {
    return JSON.parse(Buffer.from(str, 'base64'))
}

const add = (sum, a) => sum + a;

export async function validate(build = { levelUps, baseClass, jediClass, baseLevel, skillPoints }, assert) {
    const attributeService = await attributeServicePromise
    const skillService = await skillServicePromise
    
    assert(['sol', 'scd', 'sct'].includes(baseClass))
    assert(!jediClass || ['jgd', 'jcn', 'jsn'].includes(jediClass))
    assert(1 <= baseLevel && baseLevel <= 8)

    /*levelUps.forEach((levelUp, index) => assert(
        levelUp.attributes.reduce(add, 0) ===
            attributeService.getRemainingPoints(index + 1) &&
        levelUp.skills.reduce(add, 0) ===
            skillService.getRemainingPoints(build)
    ))

    levelUps.forEach((levelUp, index) => {
        const level = index + 1;
        assert(levelUp.attributes.reduce(add, 0) === attributeService.getRemainingPoints(level))
        assert(levelUp.skills.reduce(add, 0) === skillService.getRemainingPoints(build))
        assert()
    })*/
    var currentBuild = {
        baseLevel: 1,
        baseClass: build.baseClass,
        jediClass: null,
        skillPoints: null 
    }
    currentBuild.skillPoints = skillService.getRemainingPoints(currentBuild)

    for (const levelUp of levelUps) {
        
    }
}
