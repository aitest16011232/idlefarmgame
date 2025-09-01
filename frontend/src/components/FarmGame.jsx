import React, { useState, useEffect, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Sprout, Star, RotateCcw, TrendingUp, Clock, 
  Zap, Sparkles, ShoppingCart, Lock, Coins, Gamepad2 
} from 'lucide-react';
import { 
  initialGameData, 
  WHEAT_STATES, 
  WHEAT_STATE_INFO,
  WHEAT_TYPES,
  WHEAT_TYPE_INFO,
  UPGRADES,
  UPGRADE_INFO,
  getRandomWheatType,
  getGrowthTime,
  getHarvestAmount,
  getMultiHarvestAmount,
  getUpgradeCost,
  getGridSize,
  canUnlockGridSize,
  canUnlockMultiHarvest
} from '../data/mock';
import './FarmGame.css';

const FarmGame = () => {
  const [gameData, setGameData] = useState(() => {
    const saved = localStorage.getItem('farmGameData');
    return saved ? JSON.parse(saved) : initialGameData;
  });
  const [harvestAnimations, setHarvestAnimations] = useState({});
  const [soundEffect, setSoundEffect] = useState('');
  const [boostAnimations, setBoostAnimations] = useState({});

  // Sauvegarder automatiquement
  useEffect(() => {
    localStorage.setItem('farmGameData', JSON.stringify(gameData));
  }, [gameData]);

  // Créer la grille selon le niveau d'amélioration
  const createGrid = useCallback((size) => {
    const gridSize = Math.sqrt(size);
    const grid = [];
    for (let i = 0; i < gridSize; i++) {
      const row = [];
      for (let j = 0; j < gridSize; j++) {
        row.push({
          id: `${i}-${j}`,
          state: WHEAT_STATES.SEED,
          plantedAt: Date.now(),
          wheatType: WHEAT_TYPES.COMMON,
          boosted: false
        });
      }
      grid.push(row);
    }
    return grid;
  }, []);

  // Ajuster la grille si nécessaire
  useEffect(() => {
    const currentSize = getGridSize(gameData.upgrades[UPGRADES.GRID_SIZE]);
    const currentGridSize = gameData.grid.length * gameData.grid[0].length;
    
    if (currentGridSize !== currentSize) {
      setGameData(prev => ({
        ...prev,
        grid: createGrid(currentSize)
      }));
    }
  }, [gameData.upgrades[UPGRADES.GRID_SIZE], createGrid]);

  // Système de croissance automatique
  useEffect(() => {
    const interval = setInterval(() => {
      const growthTime = getGrowthTime(gameData.upgrades[UPGRADES.GROWTH_SPEED]);
      
      setGameData(prev => ({
        ...prev,
        grid: prev.grid.map(row =>
          row.map(cell => {
            if (cell.state === WHEAT_STATES.MATURE) return cell;
            
            const timeSincePlanted = Date.now() - cell.plantedAt;
            const effectiveGrowthTime = cell.boosted ? growthTime * 0.5 : growthTime; // 50% plus rapide si boosté
            const stateGrowthTime = effectiveGrowthTime / 4; // Diviser en 4 étapes
            
            const states = Object.values(WHEAT_STATES);
            const currentIndex = states.indexOf(cell.state);
            const requiredTime = (currentIndex + 1) * stateGrowthTime;
            
            if (timeSincePlanted >= requiredTime && currentIndex < states.length - 1) {
              return {
                ...cell,
                state: states[currentIndex + 1],
                boosted: false // Reset boost après croissance
              };
            }
            
            return cell;
          })
        )
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameData.upgrades[UPGRADES.GROWTH_SPEED]]);

  const boostGrowth = (rowIndex, colIndex) => {
    const cell = gameData.grid[rowIndex][colIndex];
    
    if (cell.state === WHEAT_STATES.MATURE || cell.boosted) return;

    // Animation de boost
    const animationId = `${rowIndex}-${colIndex}`;
    setBoostAnimations(prev => ({ ...prev, [animationId]: true }));
    setSoundEffect('boost');

    // Appliquer le boost
    setGameData(prev => ({
      ...prev,
      grid: prev.grid.map((row, rIdx) =>
        row.map((c, cIdx) => {
          if (rIdx === rowIndex && cIdx === colIndex) {
            return {
              ...c,
              boosted: true
            };
          }
          return c;
        })
      )
    }));

    // Nettoyer les animations
    setTimeout(() => {
      setBoostAnimations(prev => {
        const newAnims = { ...prev };
        delete newAnims[animationId];
        return newAnims;
      });
      setSoundEffect('');
    }, 600);
  };

  const harvestCell = (rowIndex, colIndex) => {
    const cell = gameData.grid[rowIndex][colIndex];
    
    if (cell.state !== WHEAT_STATES.MATURE) return;

    // Animation de récolte
    const animationId = `${rowIndex}-${colIndex}`;
    setHarvestAnimations(prev => ({ ...prev, [animationId]: true }));
    setSoundEffect('harvest');

    // Déterminer le type de blé récolté
    const wheatType = getRandomWheatType(gameData.upgrades[UPGRADES.RARE_CHANCE]);
    const wheatValue = WHEAT_TYPE_INFO[wheatType].value;
    const harvestAmount = getHarvestAmount(gameData.upgrades[UPGRADES.HARVEST_AMOUNT]);
    const multiHarvestAmount = getMultiHarvestAmount(gameData.upgrades[UPGRADES.MULTI_HARVEST]);
    const totalWheat = wheatValue * harvestAmount * multiHarvestAmount;
    const xpGained = wheatValue * 5 * multiHarvestAmount; // XP basée sur la rareté et quantité

    // Mise à jour des données
    setGameData(prev => {
      const newXp = prev.player.xp + xpGained;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      return {
        ...prev,
        grid: prev.grid.map((row, rIdx) =>
          row.map((c, cIdx) => {
            if (rIdx === rowIndex && cIdx === colIndex) {
              return {
                ...c,
                state: WHEAT_STATES.SEED,
                plantedAt: Date.now(),
                wheatType: WHEAT_TYPES.COMMON,
                boosted: false
              };
            }
            return c;
          })
        ),
        inventory: {
          ...prev.inventory,
          wheat: prev.inventory.wheat + totalWheat,
          totalHarvested: prev.inventory.totalHarvested + (harvestAmount * multiHarvestAmount)
        },
        player: {
          ...prev.player,
          level: newLevel,
          xp: newXp,
          xpToNext: newLevel * 100
        }
      };
    });

    // Nettoyer les animations
    setTimeout(() => {
      setHarvestAnimations(prev => {
        const newAnims = { ...prev };
        delete newAnims[animationId];
        return newAnims;
      });
      setSoundEffect('');
    }, 600);
  };

  const buyUpgrade = (upgradeType) => {
    const currentLevel = gameData.upgrades[upgradeType];
    const cost = getUpgradeCost(upgradeType, currentLevel);
    const maxLevel = UPGRADE_INFO[upgradeType].maxLevel;
    
    if (gameData.inventory.wheat < cost || currentLevel >= maxLevel) return;

    // Vérifier les prérequis
    if (upgradeType === UPGRADES.GRID_SIZE) {
      if (!canUnlockGridSize(gameData.player.level, currentLevel + 1)) return;
    }
    if (upgradeType === UPGRADES.MULTI_HARVEST) {
      if (!canUnlockMultiHarvest(gameData.player.level)) return;
    }

    setGameData(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        wheat: prev.inventory.wheat - cost
      },
      upgrades: {
        ...prev.upgrades,
        [upgradeType]: currentLevel + 1
      }
    }));

    setSoundEffect('upgrade');
    setTimeout(() => setSoundEffect(''), 300);
  };

  const cheatResources = () => {
    setGameData(prev => {
      const newXp = prev.player.xp + 1000;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          wheat: prev.inventory.wheat + 100
        },
        player: {
          ...prev.player,
          level: newLevel,
          xp: newXp,
          xpToNext: newLevel * 100
        }
      };
    });

    setSoundEffect('cheat');
    setTimeout(() => setSoundEffect(''), 300);
  };

  const resetGame = () => {
    setGameData(initialGameData);
    setHarvestAnimations({});
    setBoostAnimations({});
    setSoundEffect('');
    localStorage.removeItem('farmGameData');
  };

  const xpProgress = (gameData.player.xp % 100);
  const gridSize = Math.sqrt(getGridSize(gameData.upgrades[UPGRADES.GRID_SIZE]));

  return (
    <div className="farm-game-idle">
      {/* En-tête du jeu */}
      <div className="game-header">
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-2xl text-amber-800">
                  {gameData.inventory.wheat.toLocaleString()} 🌾
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">
                  Niveau {gameData.player.level}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={cheatResources} variant="outline" size="sm" className="bg-yellow-50 border-yellow-300 hover:bg-yellow-100">
                <Gamepad2 className="w-4 h-4 mr-2" />
                +100🌾 +1000XP
              </Button>
              <Button onClick={resetGame} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
          <div>
            <Progress value={xpProgress} className="h-3" />
            <p className="text-xs text-gray-600 mt-1">
              XP: {gameData.player.xp} / {gameData.player.xpToNext}
            </p>
          </div>
        </Card>
      </div>

      <div className="game-content">
        {/* Terrain de jeu */}
        <div className="farm-section">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 text-center">Mon Terrain</h2>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Clic gauche: récolter | Clic droit: accélérer la pousse
            </p>
            <div 
              className="farm-grid-idle"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gridTemplateRows: `repeat(${gridSize}, 1fr)`
              }}
            >
              {gameData.grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const stateInfo = WHEAT_STATE_INFO[cell.state];
                  const wheatInfo = WHEAT_TYPE_INFO[cell.wheatType];
                  const animationId = `${rowIndex}-${colIndex}`;
                  const isHarvesting = harvestAnimations[animationId];
                  const isBoosting = boostAnimations[animationId];
                  
                  return (
                    <div
                      key={cell.id}
                      className={`farm-cell-idle ${cell.state} ${isHarvesting ? 'harvesting' : ''} ${
                        isBoosting ? 'boosting' : ''
                      } ${cell.boosted ? 'boosted' : ''} ${
                        stateInfo.canHarvest ? 'harvestable' : ''
                      }`}
                      onClick={() => harvestCell(rowIndex, colIndex)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        boostGrowth(rowIndex, colIndex);
                      }}
                      title={`${stateInfo.name} ${stateInfo.canHarvest ? '(Clic gauche: récolter)' : '(Clic droit: accélérer)'} ${cell.boosted ? '⚡ Boosté!' : ''}`}
                    >
                      <div className="cell-content-idle">
                        <span className={`wheat-sprite-idle grid-${gridSize}`}>
                          {cell.state === WHEAT_STATES.MATURE ? wheatInfo.emoji : stateInfo.emoji}
                        </span>
                        {isHarvesting && (
                          <div className="harvest-effect-idle">
                            <span className="floating-reward-idle">
                              +{WHEAT_TYPE_INFO[getRandomWheatType()].value * getHarvestAmount(gameData.upgrades[UPGRADES.HARVEST_AMOUNT]) * getMultiHarvestAmount(gameData.upgrades[UPGRADES.MULTI_HARVEST])}🌾
                            </span>
                          </div>
                        )}
                        {isBoosting && (
                          <div className="boost-effect-idle">
                            <span className="floating-boost-idle">⚡ Accéléré!</span>
                          </div>
                        )}
                        {cell.boosted && (
                          <div className="boost-indicator">
                            <span className="boost-glow">⚡</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Améliorations */}
        <div className="upgrades-section">
          <Card className="p-6">
            <Tabs defaultValue="upgrades" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upgrades" className="data-[state=active]:bg-green-100">Améliorations</TabsTrigger>
                <TabsTrigger value="stats" className="data-[state=active]:bg-blue-100">Statistiques</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upgrades" className="space-y-4">
                {Object.entries(UPGRADE_INFO).map(([upgradeType, info]) => {
                  const currentLevel = gameData.upgrades[upgradeType];
                  const cost = getUpgradeCost(upgradeType, currentLevel);
                  const canAfford = gameData.inventory.wheat >= cost;
                  const isMaxLevel = currentLevel >= info.maxLevel;
                  
                  let canUnlock = true;
                  let unlockMessage = '';
                  
                  if (upgradeType === UPGRADES.GRID_SIZE) {
                    canUnlock = canUnlockGridSize(gameData.player.level, currentLevel + 1);
                    if (!canUnlock) {
                      const targetLevel = Object.values(UPGRADE_INFO[UPGRADES.GRID_SIZE].levels)[currentLevel + 1];
                      unlockMessage = `Niveau ${targetLevel?.level || '?'} requis`;
                    }
                  } else if (upgradeType === UPGRADES.MULTI_HARVEST) {
                    canUnlock = canUnlockMultiHarvest(gameData.player.level);
                    if (!canUnlock) {
                      unlockMessage = `Niveau ${UPGRADE_INFO[UPGRADES.MULTI_HARVEST].unlockLevel} requis`;
                    }
                  }

                  return (
                    <div key={upgradeType} className="upgrade-card">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-semibold">{info.name}</span>
                            <Badge variant="secondary">Niv. {currentLevel}</Badge>
                            {upgradeType === UPGRADES.MULTI_HARVEST && (
                              <Badge variant="outline" className="text-purple-600 border-purple-300">
                                Nouveau!
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{info.description}</p>
                          {upgradeType === UPGRADES.GRID_SIZE && info.levels[currentLevel + 1] && (
                            <p className="text-xs text-blue-600">
                              Prochain: {info.levels[currentLevel + 1].description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {isMaxLevel ? (
                            <Badge variant="default">MAX</Badge>
                          ) : !canUnlock ? (
                            <div className="flex items-center gap-1 text-red-500">
                              <Lock className="w-4 h-4" />
                              <span className="text-sm">{unlockMessage}</span>
                            </div>
                          ) : (
                            <Button
                              onClick={() => buyUpgrade(upgradeType)}
                              disabled={!canAfford}
                              size="sm"
                              variant={canAfford ? "default" : "outline"}
                            >
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              {cost.toLocaleString()}🌾
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="stats" className="space-y-4">
                <div className="stats-grid">
                  <div className="stat-card">
                    <Sprout className="w-6 h-6 text-green-600 mb-2" />
                    <div className="text-2xl font-bold">{gameData.inventory.totalHarvested.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Blé Total Récolté</div>
                  </div>
                  <div className="stat-card">
                    <Clock className="w-6 h-6 text-blue-600 mb-2" />
                    <div className="text-2xl font-bold">{Math.round(getGrowthTime(gameData.upgrades[UPGRADES.GROWTH_SPEED]) / 1000)}s</div>
                    <div className="text-sm text-gray-600">Temps de Croissance</div>
                  </div>
                  <div className="stat-card">
                    <Zap className="w-6 h-6 text-yellow-600 mb-2" />
                    <div className="text-2xl font-bold">{getHarvestAmount(gameData.upgrades[UPGRADES.HARVEST_AMOUNT])}</div>
                    <div className="text-sm text-gray-600">Blé par Récolte</div>
                  </div>
                  <div className="stat-card">
                    <Sparkles className="w-6 h-6 text-purple-600 mb-2" />
                    <div className="text-2xl font-bold">×{(Math.pow(1.2, gameData.upgrades[UPGRADES.RARE_CHANCE])).toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Chance de Rareté</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Effet sonore simulé */}
      {soundEffect && (
        <div className="sound-effect-idle">
          <div className="sound-indicator-idle">
            🔊 {soundEffect === 'harvest' ? 'Récolte!' : 
                soundEffect === 'boost' ? 'Accéléré!' :
                soundEffect === 'cheat' ? 'Triche activée!' : 'Amélioration!'}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmGame;