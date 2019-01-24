import UnionFind from 'union-find'

export function connect(abilities) {
    const forest = new UnionFind(abilities.length)
        , progressions = []

    abilities.forEach((ability, index) => {
        if (ability.name) {
            ability.prerequisites.forEach(p => forest.link(index, p))
        }
    })

    abilities.forEach((ability, index) => {
        if (ability.name) {
            const edge = forest.find(index)
            if (!progressions[edge]) {
                progressions[edge] = []
            }
            progressions[edge].push(ability)
        }   
    })

    progressions.forEach(progression => {
        progression.sort((a, b) => a.tier - b.tier)
    })

    return progressions.filter(p => p)
}