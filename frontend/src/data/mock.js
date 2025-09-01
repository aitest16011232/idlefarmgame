// Mock data pour le jeu d'agriculture

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
    growthTime: 2000, // 2 secondes pour la démo
    canHarvest: false
  },
  [WHEAT_STATES.SPROUT]: {
    emoji: '🌿',
    name: 'Pousse',
    growthTime: 3000,
    canHarvest: false
  },
  [WHEAT_STATES.GROWING]: {
    emoji: '🌾',
    name: 'En croissance',
    growthTime: 4000,
    canHarvest: false
  },
  [WHEAT_STATES.MATURE]: {
    emoji: '🌾',
    name: 'Mature',
    growthTime: 0,
    canHarvest: true
  }
};

// État initial du terrain (grille 4x4)
export const initialFarmData = {
  grid: [
    [
      { id: '0-0', state: WHEAT_STATES.SEED, plantedAt: Date.now() },
      { id: '0-1', state: WHEAT_STATES.SPROUT, plantedAt: Date.now() - 3000 },
      { id: '0-2', state: WHEAT_STATES.GROWING, plantedAt: Date.now() - 6000 },
      { id: '0-3', state: WHEAT_STATES.MATURE, plantedAt: Date.now() - 10000 }
    ],
    [
      { id: '1-0', state: WHEAT_STATES.SPROUT, plantedAt: Date.now() - 2000 },
      { id: '1-1', state: WHEAT_STATES.MATURE, plantedAt: Date.now() - 12000 },
      { id: '1-2', state: WHEAT_STATES.SEED, plantedAt: Date.now() },
      { id: '1-3', state: WHEAT_STATES.GROWING, plantedAt: Date.now() - 5000 }
    ],
    [
      { id: '2-0', state: WHEAT_STATES.GROWING, plantedAt: Date.now() - 7000 },
      { id: '2-1', state: WHEAT_STATES.SEED, plantedAt: Date.now() - 1000 },
      { id: '2-2', state: WHEAT_STATES.MATURE, plantedAt: Date.now() - 15000 },
      { id: '2-3', state: WHEAT_STATES.SPROUT, plantedAt: Date.now() - 4000 }
    ],
    [
      { id: '3-0', state: WHEAT_STATES.MATURE, plantedAt: Date.now() - 20000 },
      { id: '3-1', state: WHEAT_STATES.GROWING, plantedAt: Date.now() - 8000 },
      { id: '3-2', state: WHEAT_STATES.SPROUT, plantedAt: Date.now() - 3500 },
      { id: '3-3', state: WHEAT_STATES.SEED, plantedAt: Date.now() - 500 }
    ]
  ],
  inventory: {
    seeds: 12,
    wheat: 0
  },
  player: {
    level: 1,
    xp: 0,
    xpToNext: 100
  }
};

export const HARVEST_REWARDS = {
  wheat: 1,
  seeds: 2,
  xp: 15
};