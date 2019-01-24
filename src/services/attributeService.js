import enginePromise from '../backend/engine'

export default (async () => {
	const engine = await enginePromise
		, attributes = engine.getAttributes()

	function getAttributes(build) {
		return attributes.map((attribute, index) => ({
			name: attribute.name
			, description: attribute.description
			, rank: getBaseRank(index, build)
			, min: getBaseRank(index, build)
		}))
	}

	return {
		getMaximumRank
		, canIncrease
		, getPointCostFromRank
		, getRemainingPoints
		, getModifierFromRank
		, getPointCostToRank
		, getBaseRank
		, getAttributes
	}
})()

function getBaseRank(attributeIndex, build) {
	return 8 + build.getBaseAttributeIncreases(attributeIndex)
}

function getMaximumRank(level) {
	return level === 1 ? 18 : Number.MAX_VALUE
}

function canIncrease(attributeRank, level, remainingPoints) {
	return attributeRank < getMaximumRank(level) && 
		remainingPoints >= getPointCostFromRank(attributeRank, level) 
}

function getPointCostFromRank(attributeRank, level) {
	if (level === 1) {
		const cost = Math.floor(attributeRank / 2) - 5
		return Math.max(cost, 1)
	}
	return 1
}

function getRemainingPoints(level) {
	return level === 1 ? 30
		: level % 4 === 0 ? 1
		: 0
}

function getModifierFromRank(attributeRank) {
	return Math.floor(attributeRank / 2) - 5
}

function getPointCostToRank(attributeRank, level) {
	return this.getPointCostFromRank(attributeRank - 1, level)
}