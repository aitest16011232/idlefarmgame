// Mock data pour le jeu d'agriculture idle/clicker

export const WHEAT_TYPES = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
  MYTHIC: 'mythic',
  TRANSCENDENT: 'transcendent',
  DIVINE: 'divine',
  CELESTIAL: 'celestial',
  COSMIC: 'cosmic',
  OMNIPOTENT: 'omnipotent'
};

export const WHEAT_TYPE_INFO = {
  [WHEAT_TYPES.COMMON]: {
    emoji: '🌾',
    name: 'Blé Commun',
    value: 1,
    rarity: 1,
    color: '#DAA520',
    bgColor: '#F5F5DC'
  },
  [WHEAT_TYPES.UNCOMMON]: {
    emoji: '🌾',
    name: 'Blé Peu Commun',
    value: 3,
    rarity: 0.2, // 1/5
    color: '#228B22',
    bgColor: '#F0FFF0'
  },
  [WHEAT_TYPES.RARE]: {
    emoji: '🌾',
    name: 'Blé Rare',
    value: 8,
    rarity: 0.1, // 1/10
    color: '#4169E1',
    bgColor: '#E6F3FF'
  },
  [WHEAT_TYPES.EPIC]: {
    emoji: '🌾',
    name: 'Blé Épique',
    value: 25,
    rarity: 0.05, // 1/20
    color: '#8A2BE2',
    bgColor: '#F3E5F5'
  },
  [WHEAT_TYPES.LEGENDARY]: {
    emoji: '🌾',
    name: 'Blé Légendaire',
    value: 100,
    rarity: 0.01, // 1/100
    color: '#FFD700',
    bgColor: '#FFFACD'
  },
  [WHEAT_TYPES.MYTHIC]: {
    emoji: '🌾',
    name: 'Blé Mythique',
    value: 500,
    rarity: 0.002, // 1/500
    color: '#FF1493',
    bgColor: '#FFF0F5'
  },
  [WHEAT_TYPES.TRANSCENDENT]: {
    emoji: '🌾',
    name: 'Blé Transcendant',
    value: 2500,
    rarity: 0.0004, // 1/2500
    color: '#00CED1',
    bgColor: '#F0FFFF'
  },
  [WHEAT_TYPES.DIVINE]: {
    emoji: '🌾',
    name: 'Blé Divin',
    value: 10000,
    rarity: 0.0001, // 1/10000
    color: '#9370DB',
    bgColor: '#E6E6FA'
  },
  [WHEAT_TYPES.CELESTIAL]: {
    emoji: '🌾',
    name: 'Blé Céleste',
    value: 50000,
    rarity: 0.00002, // 1/50000
    color: '#FF6347',
    bgColor: '#FFF8DC'
  },
  [WHEAT_TYPES.COSMIC]: {
    emoji: '🌾',
    name: 'Blé Cosmique',
    value: 250000,
    rarity: 0.000004, // 1/250000
    color: '#8A2BE2',
    bgColor: '#4B0082'
  },
  [WHEAT_TYPES.OMNIPOTENT]: {
    emoji: '🌾',
    name: 'Blé Omnipotent',
    value: 1000000,
    rarity: 0.0000008, // 1/1250000
    color: '#FFD700',
    bgColor: '#2F1B69'
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
  16: { size: 16, level: 30, name: "Énorme Terrain" },
  25: { size: 25, level: 50, name: "Terrain Massif" },
  36: { size: 36, level: 75, name: "Terrain Gigantesque" },
  49: { size: 49, level: 100, name: "Terrain Colossal" },
  64: { size: 64, level: 130, name: "Terrain Titanesque" },
  81: { size: 81, level: 170, name: "Terrain Légendaire" },
  100: { size: 100, level: 220, name: "Terrain Mythique" },
  121: { size: 121, level: 280, name: "Terrain Divin" }
};

export const UPGRADES = {
  GRID_SIZE: 'gridSize',
  GROWTH_SPEED: 'growthSpeed',
  HARVEST_AMOUNT: 'harvestAmount',
  RARE_CHANCE: 'rareChance',
  HARVEST_CHANCE: 'harvestChance',
  AUTO_HARVEST: 'autoHarvest',
  CRITICAL_HARVEST: 'criticalHarvest',
  EXPERIENCE_BOOST: 'experienceBoost'
};

export const GROWTH_SPEED_THRESHOLDS = [
  { clicks: 0, level: 0, name: "Vitesse Normale" },
  { clicks: 5, level: 1, name: "Vitesse Améliorée" },
  { clicks: 50, level: 2, name: "Vitesse Rapide" },
  { clicks: 250, level: 3, name: "Vitesse Très Rapide" },
  { clicks: 1000, level: 4, name: "Vitesse Ultra" },
  { clicks: 5000, level: 5, name: "Vitesse Turbo" },
  { clicks: 25000, level: 6, name: "Vitesse Supersonique" },
  { clicks: 100000, level: 7, name: "Vitesse Hypersonique" },
  { clicks: 500000, level: 8, name: "Vitesse Lumière" },
  { clicks: 1000000, level: 9, name: "Vitesse Quantique" }
];

export const UPGRADE_INFO = {
  [UPGRADES.GRID_SIZE]: {
    name: "Taille du Terrain",
    description: "Augmente le nombre de cases cultivables",
    baseCost: 50,
    maxLevel: 11,
    levels: [
      { cost: 0, value: 1, description: "1 case", reqLevel: 1 },
      { cost: 50, value: 4, description: "4 cases", reqLevel: 5 },
      { cost: 200, value: 9, description: "9 cases", reqLevel: 15 },
      { cost: 500, value: 16, description: "16 cases", reqLevel: 30 },
      { cost: 1200, value: 25, description: "25 cases", reqLevel: 50 },
      { cost: 3000, value: 36, description: "36 cases", reqLevel: 75 },
      { cost: 7500, value: 49, description: "49 cases", reqLevel: 100 },
      { cost: 18000, value: 64, description: "64 cases", reqLevel: 130 },
      { cost: 45000, value: 81, description: "81 cases", reqLevel: 170 },
      { cost: 110000, value: 100, description: "100 cases", reqLevel: 220 },
      { cost: 275000, value: 121, description: "121 cases", reqLevel: 280 }
    ]
  },
  [UPGRADES.GROWTH_SPEED]: {
    name: "Vitesse de Croissance",
    description: "Se débloque automatiquement en cliquant des blés",
    isAutoUnlock: true,
    baseValue: 8000, // 8 secondes de base
    reduction: 0.12 // 12% de réduction par niveau
  },
  [UPGRADES.HARVEST_AMOUNT]: {
    name: "Récolte Abondante",
    description: "Augmente le nombre de blé récolté",
    baseCost: 30,
    maxLevel: Infinity,
    baseValue: 1,
    increment: 1 // +1 blé par niveau
  },
  [UPGRADES.RARE_CHANCE]: {
    name: "Chance de Rareté",
    description: "Améliore les chances de blé rare",
    baseCost: 100,
    maxLevel: Infinity,
    baseValue: 1,
    multiplier: 1.15 // +15% de chance par niveau
  },
  [UPGRADES.HARVEST_CHANCE]: {
    name: "Chance de Récolte",
    description: "Chance de récolter un blé mature supplémentaire",
    baseCost: 150,
    maxLevel: 25,
    baseChance: 0.1, // 10% de base
    increment: 0.04, // +4% par niveau
    unlockLevel: 5 // Déblocké au niveau 5
  },
  [UPGRADES.AUTO_HARVEST]: {
    name: "Récolte Automatique",
    description: "Récolte automatiquement les blés matures",
    baseCost: 500,
    maxLevel: Infinity,
    unlockLevel: 20,
    baseHarvestInterval: 10000, // 10 secondes de base
    intervalReduction: 500, // -0.5 secondes par niveau
    harvestUpgradeLevel: 6, // À partir du niveau 6, on récolte 2 blés
    getHarvestInterval: (level) => {
      const baseInterval = UPGRADE_INFO[UPGRADES.AUTO_HARVEST].baseHarvestInterval;
      const reduction = UPGRADE_INFO[UPGRADES.AUTO_HARVEST].intervalReduction;
      
      // Calculer le niveau dans le cycle actuel
      const cycleLevel = ((level - 1) % 6) + 1;
      return Math.max(1000, baseInterval - (cycleLevel - 1) * reduction);
    },
    getHarvestAmount: (level) => {
      return Math.floor((level - 1) / 6) + 1;
    }
  },
  [UPGRADES.CRITICAL_HARVEST]: {
    name: "Récolte Critique",
    description: "Chance d'obtenir 5x plus de blé",
    baseCost: 300,
    maxLevel: 20,
    baseChance: 0.05, // 5% de base
    increment: 0.02, // +2% par niveau
    multiplier: 5,
    unlockLevel: 15
  },
  [UPGRADES.EXPERIENCE_BOOST]: {
    name: "Boost d'Expérience",
    description: "Augmente l'XP gagnée par récolte",
    baseCost: 200,
    maxLevel: Infinity,
    baseMultiplier: 1,
    increment: 0.25, // +25% XP par niveau
    unlockLevel: 10
  }
};

// État initial du jeu
export const initialGameData = {
  grid: [
    [{ id: '0-0', state: WHEAT_STATES.SEED, plantedAt: Date.now(), wheatType: WHEAT_TYPES.COMMON, boosted: false, boostCooldown: 0 }]
  ],
  inventory: {
    wheat: 0,
    totalHarvested: 0, // Valeur réelle avec facteurs de rareté
    totalClicks: 0 // Nombre de clics sans facteur
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
    [UPGRADES.HARVEST_CHANCE]: 0,
    [UPGRADES.AUTO_HARVEST]: 0,
    [UPGRADES.CRITICAL_HARVEST]: 0,
    [UPGRADES.EXPERIENCE_BOOST]: 0
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
  
  // Calculer les chances ajustées (du plus rare au plus commun)
  const types = Object.values(WHEAT_TYPES).reverse(); // Commencer par le plus rare
  
  for (const type of types) {
    const adjustedChance = WHEAT_TYPE_INFO[type].rarity * rareMultiplier;
    if (random < adjustedChance) {
      return type;
    }
  }
  
  return WHEAT_TYPES.COMMON;
};

export const getGrowthSpeedLevel = (totalClicks) => {
  let level = 0;
  for (const threshold of GROWTH_SPEED_THRESHOLDS) {
    if (totalClicks >= threshold.clicks) {
      level = threshold.level;
    } else {
      break;
    }
  }
  return level;
};

export const getGrowthTime = (growthSpeedLevel = 0) => {
  const baseTime = UPGRADE_INFO[UPGRADES.GROWTH_SPEED].baseValue;
  const reduction = UPGRADE_INFO[UPGRADES.GROWTH_SPEED].reduction;
  return Math.max(1000, baseTime * Math.pow(1 - reduction, growthSpeedLevel));
};

export const getHarvestAmount = (harvestAmountLevel = 0) => {
  return UPGRADE_INFO[UPGRADES.HARVEST_AMOUNT].baseValue + 
         (harvestAmountLevel * UPGRADE_INFO[UPGRADES.HARVEST_AMOUNT].increment);
};

export const getHarvestChance = (harvestChanceLevel = 0) => {
  if (harvestChanceLevel === 0) return 0;
  const info = UPGRADE_INFO[UPGRADES.HARVEST_CHANCE];
  return Math.min(1, info.baseChance + ((harvestChanceLevel - 1) * info.increment));
};

export const getCriticalHarvestChance = (criticalHarvestLevel = 0) => {
  if (criticalHarvestLevel === 0) return 0;
  const info = UPGRADE_INFO[UPGRADES.CRITICAL_HARVEST];
  return Math.min(1, info.baseChance + ((criticalHarvestLevel - 1) * info.increment));
};

export const getExperienceMultiplier = (experienceBoostLevel = 0) => {
  const info = UPGRADE_INFO[UPGRADES.EXPERIENCE_BOOST];
  return info.baseMultiplier + (experienceBoostLevel * info.increment);
};

export const getUpgradeCost = (upgradeType, currentLevel) => {
  const info = UPGRADE_INFO[upgradeType];
  if (upgradeType === UPGRADES.GRID_SIZE) {
    return info.levels[currentLevel + 1]?.cost || Infinity;
  }
  if (upgradeType === UPGRADES.GROWTH_SPEED) {
    return 0; // Gratuit, auto-déblocké
  }
  if (upgradeType === UPGRADES.AUTO_HARVEST) {
    return currentLevel >= info.maxLevel ? Infinity : Math.floor(info.baseCost * Math.pow(1.5, currentLevel));
  }
  return Math.floor(info.baseCost * Math.pow(1.4, currentLevel));
};

export const getGridSize = (gridSizeLevel) => {
  const levels = UPGRADE_INFO[UPGRADES.GRID_SIZE].levels;
  return levels[gridSizeLevel]?.value || 1;
};

export const canUnlockGridSize = (playerLevel, targetGridLevel) => {
  const level = UPGRADE_INFO[UPGRADES.GRID_SIZE].levels[targetGridLevel];
  return level ? playerLevel >= level.reqLevel : false;
};

export const canUnlockUpgrade = (upgradeType, playerLevel) => {
  const info = UPGRADE_INFO[upgradeType];
  return !info.unlockLevel || playerLevel >= info.unlockLevel;
};

export const getNextGrowthSpeedThreshold = (totalClicks) => {
  for (const threshold of GROWTH_SPEED_THRESHOLDS) {
    if (totalClicks < threshold.clicks) {
      return threshold;
    }
  }
  return null; // Max niveau atteint
};