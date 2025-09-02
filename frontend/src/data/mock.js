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

// Système de grades pour les blés
export const WHEAT_GRADES = {
  NONE: 'none',
  GOLD: 'gold',
  DIAMOND: 'diamond',
  RAINBOW: 'rainbow',
  VOID: 'void'
};

export const WHEAT_GRADE_INFO = {
  [WHEAT_GRADES.NONE]: {
    name: 'Aucun',
    multiplier: 1,
    probability: 0,
    starColor: '',
    starIcon: ''
  },
  [WHEAT_GRADES.GOLD]: {
    name: 'Or',
    multiplier: 20,
    probability: 0.01, // 1/100
    starColor: '#FFD700',
    starIcon: '⭐'
  },
  [WHEAT_GRADES.DIAMOND]: {
    name: 'Diamant',
    multiplier: 50,
    probability: 0.001, // 1/1000
    starColor: '#00FFFF',
    starIcon: '💎'
  },
  [WHEAT_GRADES.RAINBOW]: {
    name: 'Arc-En-Ciel',
    multiplier: 100,
    probability: 0.0001, // 1/10000
    starColor: 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)',
    starIcon: '🌈'
  },
  [WHEAT_GRADES.VOID]: {
    name: 'Void',
    multiplier: 500,
    probability: 0.00002, // 1/50000
    starColor: '#4B0082',
    starIcon: '🌌'
  }
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
  25: { size: 25, level: 75, name: "Terrain Massif" },
  36: { size: 36, level: 150, name: "Terrain Gigantesque" },
  49: { size: 49, level: 300, name: "Terrain Colossal" },
  64: { size: 64, level: 500, name: "Terrain Titanesque" }
};

export const UPGRADES = {
  GRID_SIZE: 'gridSize',
  GROWTH_SPEED: 'growthSpeed',
  HARVEST_AMOUNT: 'harvestAmount',
  RARE_CHANCE: 'rareChance',
  MULTI_HARVEST: 'multiHarvest', // Renommé de HARVEST_CHANCE
  AUTO_HARVEST_CHANCE: 'autoHarvestChance', // Nouvelle amélioration achetable
  AUTO_HARVEST_SPEED: 'autoHarvestSpeed', // Nouvelle amélioration basée sur récoltes
  CRITICAL_HARVEST: 'criticalHarvest',
  EXPERIENCE_BOOST: 'experienceBoost',
  FULL_HARVEST_SKILL: 'fullHarvestSkill', // Nouvelle compétence
  // Nouvelles améliorations pour les grades
  GOLD_GRADE_BOOST: 'goldGradeBoost',
  DIAMOND_GRADE_BOOST: 'diamondGradeBoost',
  RAINBOW_GRADE_BOOST: 'rainbowGradeBoost',
  VOID_GRADE_BOOST: 'voidGradeBoost'
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

export const AUTO_HARVEST_SPEED_THRESHOLDS = [
  { harvested: 0, level: 0, name: "Vitesse Normale" },
  { harvested: 50, level: 1, name: "Vitesse Améliorée" },
  { harvested: 200, level: 2, name: "Vitesse Rapide" },
  { harvested: 500, level: 3, name: "Vitesse Très Rapide" },
  { harvested: 750, level: 4, name: "Vitesse Ultra" },
  { harvested: 1000, level: 5, name: "Vitesse Turbo" },
  { harvested: 1500, level: 6, name: "Vitesse Supersonique" },
  { harvested: 2000, level: 7, name: "Vitesse Hypersonique" },
  { harvested: 3000, level: 8, name: "Vitesse Lumière" },
  { harvested: 5000, level: 9, name: "Vitesse Quantique" },
  { harvested: 10000, level: 10, name: "Vitesse Cosmique" },
  { harvested: 15000, level: 11, name: "Vitesse Divine" }
];

export const UPGRADE_INFO = {
  [UPGRADES.GRID_SIZE]: {
    name: "Taille du Terrain",
    description: "Augmente le nombre de cases cultivables",
    baseCost: 50,
    maxLevel: 8,
    levels: [
      { cost: 0, value: 1, description: "1 case", reqLevel: 1 },
      { cost: 50, value: 4, description: "4 cases", reqLevel: 5 },
      { cost: 200, value: 9, description: "9 cases", reqLevel: 15 },
      { cost: 500, value: 16, description: "16 cases", reqLevel: 30 },
      { cost: 1200, value: 25, description: "25 cases", reqLevel: 75 },
      { cost: 3000, value: 36, description: "36 cases", reqLevel: 150 },
      { cost: 7500, value: 49, description: "49 cases", reqLevel: 300 },
      { cost: 18000, value: 64, description: "64 cases", reqLevel: 500 }
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
  [UPGRADES.MULTI_HARVEST]: {
    name: "Récolte Multiple",
    description: "Chance de récolter un blé mature supplémentaire",
    baseCost: 150,
    maxLevel: Infinity,
    baseChance: 0.1, // 10% de base
    increment: 0.05, // +5% par niveau
    unlockLevel: 5 // Déblocké au niveau 5
  },
  [UPGRADES.AUTO_HARVEST_CHANCE]: {
    name: "Récolte Automatique",
    description: "Chance de récolte automatique et vitesse basée sur les récoltes",
    baseCost: 300,
    maxLevel: Infinity,
    baseChance: 0.1, // 10% de base
    increment: 0.05, // +5% par niveau
    unlockLevel: 20
  },
  [UPGRADES.AUTO_HARVEST_SPEED]: {
    name: "Récolte Auto - Vitesse",
    description: "Se débloque automatiquement avec les récoltes automatiques",
    isAutoUnlock: true,
    baseInterval: 10000, // 10 secondes de base
    reduction: 500 // -0.5 secondes par niveau
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
  },
  [UPGRADES.FULL_HARVEST_SKILL]: {
    name: "Maîtrise de Récolte",
    description: "Se débloque automatiquement avec le niveau du joueur",
    isAutoUnlock: true,
    baseChance: 0.25 // 0.25% par niveau de compétence
  },
  // Améliorations pour les grades
  [UPGRADES.GOLD_GRADE_BOOST]: {
    name: "Amélioration Grade Or",
    description: "Augmente la probabilité d'obtenir des blés gradés Or",
    baseCost: 1000,
    maxLevel: Infinity,
    gradeType: WHEAT_GRADES.GOLD,
    requiredGrades: [5, 25, 50, 75, 100], // Paliers de débloquage
    unlockCondition: 'grade_obtained' // Se débloque quand on obtient le premier grade
  },
  [UPGRADES.DIAMOND_GRADE_BOOST]: {
    name: "Amélioration Grade Diamant",
    description: "Augmente la probabilité d'obtenir des blés gradés Diamant",
    baseCost: 5000,
    maxLevel: Infinity,
    gradeType: WHEAT_GRADES.DIAMOND,
    requiredGrades: [5, 25, 50, 75, 100],
    unlockCondition: 'grade_obtained'
  },
  [UPGRADES.RAINBOW_GRADE_BOOST]: {
    name: "Amélioration Grade Arc-En-Ciel",
    description: "Augmente la probabilité d'obtenir des blés gradés Arc-En-Ciel",
    baseCost: 25000,
    maxLevel: Infinity,
    gradeType: WHEAT_GRADES.RAINBOW,
    requiredGrades: [5, 25, 50, 75, 100],
    unlockCondition: 'grade_obtained'
  },
  [UPGRADES.VOID_GRADE_BOOST]: {
    name: "Amélioration Grade Void",
    description: "Augmente la probabilité d'obtenir des blés gradés Void",
    baseCost: 100000,
    maxLevel: Infinity,
    gradeType: WHEAT_GRADES.VOID,
    requiredGrades: [5, 25, 50, 75, 100],
    unlockCondition: 'grade_obtained'
  }
};

export const initialGameData = {
  grid: [
    [{ id: '0-0', state: WHEAT_STATES.SEED, plantedAt: Date.now(), wheatType: WHEAT_TYPES.COMMON, grade: WHEAT_GRADES.NONE, boosted: false, boostCooldown: 0 }]
  ],
  inventory: {
    wheat: 0,
    totalHarvested: 0, // Valeur réelle avec facteurs de rareté
    totalClicks: 0, // Nombre de clics avec récolte multiple et auto
    totalAutoHarvested: 0, // Nouveau : nombre total de blés récoltés automatiquement
    harvestedByRarity: {
      [WHEAT_TYPES.COMMON]: 0,
      [WHEAT_TYPES.UNCOMMON]: 0,
      [WHEAT_TYPES.RARE]: 0,
      [WHEAT_TYPES.EPIC]: 0,
      [WHEAT_TYPES.LEGENDARY]: 0,
      [WHEAT_TYPES.MYTHIC]: 0,
      [WHEAT_TYPES.TRANSCENDENT]: 0,
      [WHEAT_TYPES.DIVINE]: 0,
      [WHEAT_TYPES.CELESTIAL]: 0,
      [WHEAT_TYPES.COSMIC]: 0,
      [WHEAT_TYPES.OMNIPOTENT]: 0
    },
    // Nouvelles statistiques pour les grades
    harvestedByGrade: {
      [WHEAT_GRADES.GOLD]: 0,
      [WHEAT_GRADES.DIAMOND]: 0,
      [WHEAT_GRADES.RAINBOW]: 0,
      [WHEAT_GRADES.VOID]: 0
    }
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
    [UPGRADES.MULTI_HARVEST]: 0,
    [UPGRADES.AUTO_HARVEST_CHANCE]: 0,
    [UPGRADES.AUTO_HARVEST_SPEED]: 0,
    [UPGRADES.CRITICAL_HARVEST]: 0,
    [UPGRADES.EXPERIENCE_BOOST]: 0,
    [UPGRADES.FULL_HARVEST_SKILL]: 0,
    // Nouvelles améliorations pour les grades
    [UPGRADES.GOLD_GRADE_BOOST]: 0,
    [UPGRADES.DIAMOND_GRADE_BOOST]: 0,
    [UPGRADES.RAINBOW_GRADE_BOOST]: 0,
    [UPGRADES.VOID_GRADE_BOOST]: 0
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

// Nouvelle fonction pour générer un blé complet avec type et grade
export const generateRandomWheat = (rareChanceLevel = 0, gradeBoostLevels = {}) => {
  const wheatType = getRandomWheatType(rareChanceLevel);
  const grade = getRandomWheatGrade(gradeBoostLevels);
  
  return {
    wheatType,
    grade
  };
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
  const info = UPGRADE_INFO[UPGRADES.MULTI_HARVEST];
  return info.baseChance + ((harvestChanceLevel - 1) * info.increment);
};

export const getAutoHarvestChance = (autoHarvestChanceLevel = 0) => {
  if (autoHarvestChanceLevel === 0) return 0;
  const info = UPGRADE_INFO[UPGRADES.AUTO_HARVEST_CHANCE];
  return info.baseChance + ((autoHarvestChanceLevel - 1) * info.increment);
};

export const getAutoHarvestSpeedLevel = (totalAutoHarvested) => {
  let level = 0;
  for (const threshold of AUTO_HARVEST_SPEED_THRESHOLDS) {
    if (totalAutoHarvested >= threshold.harvested) {
      level = threshold.level;
    } else {
      break;
    }
  }
  return level;
};

export const getAutoHarvestInterval = (speedLevel) => {
  const info = UPGRADE_INFO[UPGRADES.AUTO_HARVEST_SPEED];
  return Math.max(1000, info.baseInterval - (speedLevel * info.reduction));
};

export const getNextAutoHarvestSpeedThreshold = (totalAutoHarvested) => {
  for (const threshold of AUTO_HARVEST_SPEED_THRESHOLDS) {
    if (totalAutoHarvested < threshold.harvested) {
      return threshold;
    }
  }
  return null; // Max niveau atteint
};

// Nouvelle fonction pour calculer le multiplicateur XP selon les paliers de terrain atteints
export const getXpMultiplier = (playerLevel) => {
  let multiplier = 1;
  const gridLevels = UPGRADE_INFO[UPGRADES.GRID_SIZE].levels;
  
  // Pour chaque palier de terrain atteint, multiplier l'XP par 4
  for (let i = 1; i < gridLevels.length; i++) {
    if (playerLevel >= gridLevels[i].reqLevel) {
      multiplier *= 4;
    } else {
      break;
    }
  }
  
  return multiplier;
};

// Fonction pour calculer l'XP requise pour passer au niveau suivant
export const getXpRequired = (currentLevel) => {
  const baseXp = 100;
  
  // Système XP plus facile pour les niveaux 1-15
  if (currentLevel <= 15) {
    // Progression plus douce pour les premiers niveaux
    const easyXp = 25 + (currentLevel - 1) * 15; // 25, 40, 55, 70, 85, etc.
    return easyXp;
  }
  
  // Pour les niveaux au-dessus de 15, utiliser le système normal avec multiplicateur
  const multiplier = getXpMultiplier(currentLevel);
  return baseXp * multiplier;
};

// Fonction pour calculer le niveau à partir de l'XP total
export const calculateLevelFromXp = (totalXp) => {
  let currentLevel = 1;
  let remainingXp = totalXp;
  
  while (remainingXp > 0) {
    const xpNeeded = getXpRequired(currentLevel);
    if (remainingXp >= xpNeeded) {
      remainingXp -= xpNeeded;
      currentLevel++;
    } else {
      break;
    }
  }
  
  return {
    level: currentLevel,
    currentLevelXp: remainingXp,
    xpToNext: getXpRequired(currentLevel)
  };
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
  if (upgradeType === UPGRADES.GROWTH_SPEED || upgradeType === UPGRADES.AUTO_HARVEST_SPEED || upgradeType === UPGRADES.FULL_HARVEST_SKILL) {
    return 0; // Gratuit, auto-déblocké
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

// Fonction pour calculer la probabilité d'obtenir chaque type de blé
export const getWheatTypeProbability = (wheatType, rareChanceLevel = 0) => {
  const rareMultiplier = Math.pow(UPGRADE_INFO[UPGRADES.RARE_CHANCE].multiplier, rareChanceLevel);
  const baseRarity = WHEAT_TYPE_INFO[wheatType].rarity;
  const adjustedRarity = baseRarity * rareMultiplier;
  
  // Calculer la probabilité réelle en tenant compte des autres raretés
  return Math.min(1, adjustedRarity);
};

// Fonction pour formater la probabilité en format "1/X"
export const formatProbability = (probability) => {
  if (probability >= 1) return "1/1";
  const ratio = Math.round(1 / probability);
  return `1/${ratio}`;
};

// Fonction pour calculer le niveau de compétence de récolte complète basé sur le niveau du joueur
export const getFullHarvestSkillLevel = (playerLevel) => {
  const levelString = playerLevel.toString();
  const digitCount = levelString.length;
  
  if (digitCount === 1) return 0; // Lvl 1-9 = niveau 0
  if (digitCount === 2) return 1; // Lvl 10-99 = niveau 1
  if (digitCount === 3) return 2; // Lvl 100-999 = niveau 2
  return Math.min(3, digitCount - 1); // Maximum niveau 3
};

// Fonction pour calculer le pourcentage de chance de récolte complète
export const getFullHarvestChance = (playerLevel) => {
  const skillLevel = getFullHarvestSkillLevel(playerLevel);
  return skillLevel * 0.25; // 0.25% par niveau de compétence
};

// ===== FONCTIONS POUR LE SYSTÈME DE GRADES =====

// Fonction pour déterminer le grade d'un blé
export const getRandomWheatGrade = (gradeBoostLevels = {}) => {
  const random = Math.random();
  
  // Vérifier chaque grade du plus rare au moins rare
  const grades = [
    WHEAT_GRADES.VOID,
    WHEAT_GRADES.RAINBOW,
    WHEAT_GRADES.DIAMOND,
    WHEAT_GRADES.GOLD
  ];
  
  for (const grade of grades) {
    const boostLevel = gradeBoostLevels[getGradeBoostUpgradeType(grade)] || 0;
    const adjustedProbability = getGradeProbability(grade, boostLevel);
    
    if (random < adjustedProbability) {
      return grade;
    }
  }
  
  return WHEAT_GRADES.NONE;
};

// Fonction pour calculer la probabilité ajustée d'un grade
export const getGradeProbability = (grade, boostLevel = 0) => {
  const baseInfo = WHEAT_GRADE_INFO[grade];
  if (!baseInfo || grade === WHEAT_GRADES.NONE) return 0;
  
  let probability = baseInfo.probability;
  
  if (boostLevel > 0) {
    // Niveau 1: x1.5, Niveau 2: x2.0
    const multiplier = 1 + (boostLevel * 0.5);
    probability = probability * multiplier;
  }
  
  return probability;
};

// Fonction pour obtenir le type d'amélioration correspondant à un grade
export const getGradeBoostUpgradeType = (grade) => {
  switch (grade) {
    case WHEAT_GRADES.GOLD: return UPGRADES.GOLD_GRADE_BOOST;
    case WHEAT_GRADES.DIAMOND: return UPGRADES.DIAMOND_GRADE_BOOST;
    case WHEAT_GRADES.RAINBOW: return UPGRADES.RAINBOW_GRADE_BOOST;
    case WHEAT_GRADES.VOID: return UPGRADES.VOID_GRADE_BOOST;
    default: return null;
  }
};

// Fonction pour vérifier si une amélioration de grade peut être débloquée
export const canUnlockGradeUpgrade = (upgradeType, gradeStats) => {
  const info = UPGRADE_INFO[upgradeType];
  if (!info || !info.gradeType) return false;
  
  const gradeCount = gradeStats[info.gradeType] || 0;
  
  // Doit avoir obtenu au moins 1 blé de ce grade
  return gradeCount > 0;
};

// Fonction pour calculer le coût d'une amélioration de grade
export const getGradeUpgradeCost = (upgradeType, currentLevel) => {
  const info = UPGRADE_INFO[upgradeType];
  if (!info) return Infinity;
  
  return Math.floor(info.baseCost * Math.pow(1.5, currentLevel));
};

// Fonction pour obtenir le palier requis pour le prochain niveau d'amélioration de grade
export const getNextGradeThreshold = (upgradeType, currentLevel) => {
  const info = UPGRADE_INFO[upgradeType];
  if (!info || !info.requiredGrades) return null;
  
  if (currentLevel >= info.requiredGrades.length) {
    // Après les paliers fixes, utiliser la formule x1.15
    const baseThreshold = info.requiredGrades[info.requiredGrades.length - 1];
    const additionalLevels = currentLevel - info.requiredGrades.length + 1;
    return Math.floor(baseThreshold * Math.pow(1.15, additionalLevels));
  }
  
  return info.requiredGrades[currentLevel];
};

// Fonction pour vérifier si on peut acheter le prochain niveau d'amélioration de grade
export const canBuyGradeUpgrade = (upgradeType, currentLevel, gradeStats) => {
  const info = UPGRADE_INFO[upgradeType];
  if (!info || !info.gradeType) return false;
  
  const gradeCount = gradeStats[info.gradeType] || 0;
  const requiredCount = getNextGradeThreshold(upgradeType, currentLevel);
  
  return requiredCount !== null && gradeCount >= requiredCount;
};