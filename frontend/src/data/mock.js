// Mock data pour le jeu d'agriculture idle/clicker

export const WHEAT_TYPES = {
  COMMON: 'common',
  GOLD: 'gold',
  DIAMOND: 'diamond',
  CRYSTAL: 'crystal'
};

export const WHEAT_TYPE_INFO = {
  [WHEAT_TYPES.COMMON]: {
    emoji: '🌾',
    name: 'Blé Commun',
    value: 1,
    rarity: 1,
    color: '#DAA520'
  },
  [WHEAT_TYPES.GOLD]: {
    emoji: '✨',
    name: 'Blé Doré',
    value: 10,
    rarity: 0.1, // 1/10
    color: '#FFD700'
  },
  [WHEAT_TYPES.DIAMOND]: {
    emoji: '💎',
    name: 'Blé Diamant',
    value: 100,
    rarity: 0.01, // 1/100
    color: '#B9F2FF'
  },
  [WHEAT_TYPES.CRYSTAL]: {
    emoji: '🔮',
    name: 'Blé Cristal',
    value: 1000,
    rarity: 0.001, // 1/1000
    color: '#DDA0DD'
  }
};

export const WHEAT_STATES = {
  SEED: 'seed',
  SPROUT: 'sprout', 
  GROWING: 'growing',
  MATURE: 'mature'
};

export const WHEAT_STATE_INFO = {
  [WHEAT_STATES.SEED]: {
    emoji: '🌱',
    name: 'Graine',
    canHarvest: false
  },
  [WHEAT_STATES.SPROUT]: {
    emoji: '🌿',
    name: 'Pousse',
    canHarvest: false
  },
  [WHEAT_STATES.GROWING]: {
    emoji: '🌾',
    name: 'En croissance',
    canHarvest: false
  },
  [WHEAT_STATES.MATURE]: {
    emoji: '🌾',
    name: 'Mature',
    canHarvest: true
  }
};

export const GRID_SIZES = {
  1: { size: 1, level: 1, name: "Petit Terrain" },
  4: { size: 4, level: 5, name: "Terrain Moyen" },
  9: { size: 9, level: 15, name: "Grand Terrain" },
  16: { size: 16, level: 30, name: "Énorme Terrain" }
};

export const UPGRADES = {
  GRID_SIZE: 'gridSize',
  GROWTH_SPEED: 'growthSpeed',
  HARVEST_AMOUNT: 'harvestAmount',
  RARE_CHANCE: 'rareChance',
  MULTI_HARVEST: 'multiHarvest'
};

export const UPGRADE_INFO = {
  [UPGRADES.GRID_SIZE]: {
    name: "Taille du Terrain",
    description: "Augmente le nombre de cases cultivables",
    baseCost: 50,
    maxLevel: 4,
    levels: [
      { cost: 0, value: 1, description: "1 case" },
      { cost: 50, value: 4, description: "4 cases" },
      { cost: 200, value: 9, description: "9 cases" },
      { cost: 500, value: 16, description: "16 cases" }
    ]
  },
  [UPGRADES.GROWTH_SPEED]: {
    name: "Vitesse de Croissance",
    description: "Réduit le temps de pousse du blé",
    baseCost: 20,
    maxLevel: 10,
    baseValue: 10000, // 10 secondes de base
    reduction: 0.15 // 15% de réduction par niveau
  },
  [UPGRADES.HARVEST_AMOUNT]: {
    name: "Récolte Abondante",
    description: "Augmente le nombre de blé récolté",
    baseCost: 30,
    maxLevel: 15,
    baseValue: 1,
    increment: 1 // +1 blé par niveau
  },
  [UPGRADES.RARE_CHANCE]: {
    name: "Chance de Rareté",
    description: "Améliore les chances de blé rare",
    baseCost: 100,
    maxLevel: 20,
    baseValue: 1,
    multiplier: 1.2 // +20% de chance par niveau
  },
  [UPGRADES.MULTI_HARVEST]: {
    name: "Récolte Multiple",
    description: "Chance de récolter plusieurs blés simultanément",
    baseCost: 150,
    maxLevel: 25,
    baseChance: 0.1, // 10% de base
    increment: 0.05, // +5% par niveau
    unlockLevel: 5 // Déblocké au niveau 5
  }
};

// État initial du jeu
export const initialGameData = {
  grid: [
    [{ id: '0-0', state: WHEAT_STATES.SEED, plantedAt: Date.now(), wheatType: WHEAT_TYPES.COMMON, boosted: false }]
  ],
  inventory: {
    wheat: 0,
    totalHarvested: 0
  },
  player: {
    level: 1,
    xp: 0,
    xpToNext: 100
  },
  upgrades: {
    [UPGRADES.GRID_SIZE]: 0,
    [UPGRADES.GROWTH_SPEED]: 0,
    [UPGRADES.HARVEST_AMOUNT]: 0,
    [UPGRADES.RARE_CHANCE]: 0,
    [UPGRADES.MULTI_HARVEST]: 0
  },
  settings: {
    autoPlant: false,
    notifications: true
  }
};

// Fonctions utilitaires
export const getRandomWheatType = (rareChanceLevel = 0) => {
  const rareMultiplier = Math.pow(UPGRADE_INFO[UPGRADES.RARE_CHANCE].multiplier, rareChanceLevel);
  const random = Math.random();
  
  // Calculer les chances ajustées
  const crystalChance = WHEAT_TYPE_INFO[WHEAT_TYPES.CRYSTAL].rarity * rareMultiplier;
  const diamondChance = WHEAT_TYPE_INFO[WHEAT_TYPES.DIAMOND].rarity * rareMultiplier;
  const goldChance = WHEAT_TYPE_INFO[WHEAT_TYPES.GOLD].rarity * rareMultiplier;
  
  if (random < crystalChance) return WHEAT_TYPES.CRYSTAL;
  if (random < diamondChance) return WHEAT_TYPES.DIAMOND;
  if (random < goldChance) return WHEAT_TYPES.GOLD;
  return WHEAT_TYPES.COMMON;
};

export const getGrowthTime = (growthSpeedLevel = 0) => {
  const baseTime = UPGRADE_INFO[UPGRADES.GROWTH_SPEED].baseValue;
  const reduction = UPGRADE_INFO[UPGRADES.GROWTH_SPEED].reduction;
  return Math.max(2000, baseTime * Math.pow(1 - reduction, growthSpeedLevel));
};

export const getHarvestAmount = (harvestAmountLevel = 0) => {
  return UPGRADE_INFO[UPGRADES.HARVEST_AMOUNT].baseValue + 
         (harvestAmountLevel * UPGRADE_INFO[UPGRADES.HARVEST_AMOUNT].increment);
};

export const getMultiHarvestChance = (multiHarvestLevel = 0) => {
  const info = UPGRADE_INFO[UPGRADES.MULTI_HARVEST];
  return Math.min(1, info.baseChance + (multiHarvestLevel * info.increment));
};

export const getMultiHarvestAmount = (multiHarvestLevel = 0) => {
  const chance = getMultiHarvestChance(multiHarvestLevel);
  
  // Si on a atteint 100% pour 2 blés, on passe au système de 3 blés
  if (chance >= 1) {
    const excessLevels = multiHarvestLevel - Math.ceil((1 - UPGRADE_INFO[UPGRADES.MULTI_HARVEST].baseChance) / UPGRADE_INFO[UPGRADES.MULTI_HARVEST].increment);
    const tripleChance = excessLevels * UPGRADE_INFO[UPGRADES.MULTI_HARVEST].increment;
    
    if (Math.random() < tripleChance) return 3;
    return 2; // Toujours au moins 2 si on a 100%
  }
  
  // Sinon, chance normale de 2 blés
  return Math.random() < chance ? 2 : 1;
};

export const getUpgradeCost = (upgradeType, currentLevel) => {
  const info = UPGRADE_INFO[upgradeType];
  if (upgradeType === UPGRADES.GRID_SIZE) {
    return info.levels[currentLevel + 1]?.cost || Infinity;
  }
  return Math.floor(info.baseCost * Math.pow(1.5, currentLevel));
};

export const getGridSize = (gridSizeLevel) => {
  const levels = UPGRADE_INFO[UPGRADES.GRID_SIZE].levels;
  return levels[gridSizeLevel]?.value || 1;
};

export const canUnlockGridSize = (playerLevel, targetGridLevel) => {
  const gridSizes = Object.values(GRID_SIZES);
  const targetSize = gridSizes.find(g => UPGRADE_INFO[UPGRADES.GRID_SIZE].levels[targetGridLevel]?.value === g.size);
  return targetSize ? playerLevel >= targetSize.level : false;
};

export const canUnlockMultiHarvest = (playerLevel) => {
  return playerLevel >= UPGRADE_INFO[UPGRADES.MULTI_HARVEST].unlockLevel;
};