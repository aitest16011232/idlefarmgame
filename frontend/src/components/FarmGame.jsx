import React, { useState, useEffect, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Sprout, Star, RotateCcw, TrendingUp, Clock, 
  Zap, Sparkles, ShoppingCart, Lock, Coins, Gamepad2, Target, 
  Flame, Trophy, BookOpen
} from 'lucide-react';
import { 
  initialGameData, 
  WHEAT_STATES, 
  WHEAT_STATE_INFO,
  WHEAT_TYPES,
  WHEAT_TYPE_INFO,
  UPGRADES,
  UPGRADE_INFO,
  GROWTH_SPEED_THRESHOLDS,
  getRandomWheatType,
  getGrowthTime,
  getGrowthSpeedLevel,
  getHarvestAmount,
  getHarvestChance,
  getCriticalHarvestChance,
  getExperienceMultiplier,
  getUpgradeCost,
  getGridSize,
  canUnlockGridSize,
  canUnlockUpgrade,
  getNextGrowthSpeedThreshold
} from '../data/mock';
import './FarmGame.css';

const FarmGame = () => {
  const [gameData, setGameData] = useState(() => {
    const saved = localStorage.getItem('farmGameData');
    if (saved) {
      const parsedData = JSON.parse(saved);
      // Migrer les anciennes sauvegardes
      if (!parsedData.inventory.totalClicks) {
        parsedData.inventory.totalClicks = 0;
      }
      // Ajouter les nouvelles améliorations si elles n'existent pas
      const newUpgrades = { ...parsedData.upgrades };
      Object.keys(UPGRADES).forEach(key => {
        if (newUpgrades[UPGRADES[key]] === undefined) {
          newUpgrades[UPGRADES[key]] = 0;
        }
      });
      // Migration de MULTI_HARVEST vers HARVEST_CHANCE
      if (parsedData.upgrades.multiHarvest !== undefined) {
        newUpgrades[UPGRADES.HARVEST_CHANCE] = parsedData.upgrades.multiHarvest;
        delete newUpgrades.multiHarvest;
      }
      parsedData.upgrades = newUpgrades;
      return parsedData;
    }
    return initialGameData;
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
          boosted: false,
          boostCooldown: 0
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

  // Mise à jour automatique du niveau de vitesse de croissance
  useEffect(() => {
    const newGrowthSpeedLevel = getGrowthSpeedLevel(gameData.inventory.totalClicks);
    if (newGrowthSpeedLevel !== gameData.upgrades[UPGRADES.GROWTH_SPEED]) {
      setGameData(prev => ({
        ...prev,
        upgrades: {
          ...prev.upgrades,
          [UPGRADES.GROWTH_SPEED]: newGrowthSpeedLevel
        }
      }));
    }
  }, [gameData.inventory.totalClicks, gameData.upgrades[UPGRADES.GROWTH_SPEED]]);

  // Système de récolte automatique
  useEffect(() => {
    if (gameData.upgrades[UPGRADES.AUTO_HARVEST] === 0) return;

    const harvestInterval = UPGRADE_INFO[UPGRADES.AUTO_HARVEST].getHarvestInterval(gameData.upgrades[UPGRADES.AUTO_HARVEST]);
    const harvestAmount = UPGRADE_INFO[UPGRADES.AUTO_HARVEST].getHarvestAmount(gameData.upgrades[UPGRADES.AUTO_HARVEST]);

    const interval = setInterval(() => {
      setGameData(prev => {
        // Trouver tous les blés matures
        const matureCells = [];
        prev.grid.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            if (cell.state === WHEAT_STATES.MATURE) {
              matureCells.push({ rowIndex, colIndex, cell });
            }
          });
        });

        if (matureCells.length === 0) return prev;

        // Récolter le nombre de blés selon le niveau (minimum 1, maximum le nombre disponible)
        const cellsToHarvest = matureCells.slice(0, Math.min(harvestAmount, matureCells.length));
        
        let totalAutoWheat = 0;
        let totalAutoXp = 0;

        const newGrid = prev.grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const shouldHarvest = cellsToHarvest.some(c => c.rowIndex === rowIndex && c.colIndex === colIndex);
            
            if (shouldHarvest) {
              // Auto-récolte avec les mêmes calculs que la récolte manuelle
              const wheatType = getRandomWheatType(prev.upgrades[UPGRADES.RARE_CHANCE]);
              const wheatValue = WHEAT_TYPE_INFO[wheatType].value;
              const harvestAmountValue = getHarvestAmount(prev.upgrades[UPGRADES.HARVEST_AMOUNT]);
              const isCritical = Math.random() < getCriticalHarvestChance(prev.upgrades[UPGRADES.CRITICAL_HARVEST]);
              const criticalMultiplier = isCritical ? UPGRADE_INFO[UPGRADES.CRITICAL_HARVEST].multiplier : 1;
              const wheatHarvested = wheatValue * harvestAmountValue * criticalMultiplier;
              const xpMultiplier = getExperienceMultiplier(prev.upgrades[UPGRADES.EXPERIENCE_BOOST]);
              const xpGained = Math.floor(wheatValue * 5 * xpMultiplier);

              totalAutoWheat += wheatHarvested;
              totalAutoXp += xpGained;

              return {
                ...cell,
                state: WHEAT_STATES.SEED,
                plantedAt: Date.now(),
                wheatType: wheatType,
                boosted: false,
                boostCooldown: 0
              };
            }
            return cell;
          })
        );

        if (totalAutoWheat > 0) {
          const newXp = prev.player.xp + totalAutoXp;
          const newLevel = Math.floor(newXp / 100) + 1;

          return {
            ...prev,
            grid: newGrid,
            inventory: {
              ...prev.inventory,
              wheat: prev.inventory.wheat + totalAutoWheat,
              totalHarvested: prev.inventory.totalHarvested + totalAutoWheat,
              totalClicks: prev.inventory.totalClicks + cellsToHarvest.length
            },
            player: {
              ...prev.player,
              level: newLevel,
              xp: newXp,
              xpToNext: newLevel * 100
            }
          };
        }

        return prev;
      });
    }, harvestInterval);

    return () => clearInterval(interval);
  }, [gameData.upgrades[UPGRADES.AUTO_HARVEST]]);

  // Système de croissance automatique
  useEffect(() => {
    const interval = setInterval(() => {
      const growthTime = getGrowthTime(gameData.upgrades[UPGRADES.GROWTH_SPEED]);
      const now = Date.now();
      
      setGameData(prev => ({
        ...prev,
        grid: prev.grid.map(row =>
          row.map(cell => {
            // Réduire le cooldown de boost
            const newBoostCooldown = Math.max(0, (cell.boostCooldown || 0) - 1000);
            
            if (cell.state === WHEAT_STATES.MATURE) {
              return { ...cell, boostCooldown: newBoostCooldown };
            }
            
            const timeSincePlanted = now - cell.plantedAt;
            const effectiveGrowthTime = cell.boosted ? growthTime * 0.4 : growthTime; // 60% plus rapide si boosté
            const stateGrowthTime = effectiveGrowthTime / 4; // Diviser en 4 étapes
            
            const states = Object.values(WHEAT_STATES);
            const currentIndex = states.indexOf(cell.state);
            const requiredTime = (currentIndex + 1) * stateGrowthTime;
            
            if (timeSincePlanted >= requiredTime && currentIndex < states.length - 1) {
              return {
                ...cell,
                state: states[currentIndex + 1],
                boosted: false, // Reset boost après croissance
                boostCooldown: newBoostCooldown
              };
            }
            
            return { ...cell, boostCooldown: newBoostCooldown };
          })
        )
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameData.upgrades[UPGRADES.GROWTH_SPEED]]);

  const boostGrowth = (rowIndex, colIndex) => {
    const cell = gameData.grid[rowIndex][colIndex];
    
    if (cell.state === WHEAT_STATES.MATURE || cell.boosted || (cell.boostCooldown || 0) > 0) return;

    // Animation de boost
    const animationId = `${rowIndex}-${colIndex}`;
    setBoostAnimations(prev => ({ ...prev, [animationId]: true }));
    setSoundEffect('boost');

    // Appliquer le boost avec cooldown de 2 secondes
    setGameData(prev => ({
      ...prev,
      grid: prev.grid.map((row, rIdx) =>
        row.map((c, cIdx) => {
          if (rIdx === rowIndex && cIdx === colIndex) {
            return {
              ...c,
              boosted: true,
              boostCooldown: 2000 // 2 secondes de cooldown
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
    const isCritical = Math.random() < getCriticalHarvestChance(gameData.upgrades[UPGRADES.CRITICAL_HARVEST]);
    const criticalMultiplier = isCritical ? UPGRADE_INFO[UPGRADES.CRITICAL_HARVEST].multiplier : 1;
    const totalWheat = wheatValue * harvestAmount * criticalMultiplier;
    const xpMultiplier = getExperienceMultiplier(gameData.upgrades[UPGRADES.EXPERIENCE_BOOST]);
    const xpGained = Math.floor(wheatValue * 5 * xpMultiplier);

    // Chance de récolte bonus : chercher un autre blé mature
    let bonusHarvest = 0;
    const harvestChance = getHarvestChance(gameData.upgrades[UPGRADES.HARVEST_CHANCE]);
    if (harvestChance > 0 && Math.random() < harvestChance) {
      // Chercher un autre blé mature
      for (let r = 0; r < gameData.grid.length; r++) {
        for (let c = 0; c < gameData.grid[r].length; c++) {
          if ((r !== rowIndex || c !== colIndex) && gameData.grid[r][c].state === WHEAT_STATES.MATURE) {
            // Récolter ce blé supplémentaire
            const bonusWheatType = getRandomWheatType(gameData.upgrades[UPGRADES.RARE_CHANCE]);
            const bonusWheatValue = WHEAT_TYPE_INFO[bonusWheatType].value;
            const bonusIsCritical = Math.random() < getCriticalHarvestChance(gameData.upgrades[UPGRADES.CRITICAL_HARVEST]);
            const bonusCriticalMultiplier = bonusIsCritical ? UPGRADE_INFO[UPGRADES.CRITICAL_HARVEST].multiplier : 1;
            bonusHarvest = bonusWheatValue * harvestAmount * bonusCriticalMultiplier;
            
            // Marquer cette cellule pour réinitialisation
            setGameData(prevData => ({
              ...prevData,
              grid: prevData.grid.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  if (rIdx === r && cIdx === c) {
                    return {
                      ...cell,
                      state: WHEAT_STATES.SEED,
                      plantedAt: Date.now(),
                      wheatType: bonusWheatType,
                      boosted: false,
                      boostCooldown: 0
                    };
                  }
                  return cell;
                })
              )
            }));
            break;
          }
        }
        if (bonusHarvest > 0) break;
      }
    }

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
                wheatType: wheatType, // Utiliser le type généré
                boosted: false,
                boostCooldown: 0
              };
            }
            return c;
          })
        ),
        inventory: {
          ...prev.inventory,
          wheat: prev.inventory.wheat + totalWheat + bonusHarvest,
          totalHarvested: prev.inventory.totalHarvested + totalWheat + bonusHarvest,
          totalClicks: prev.inventory.totalClicks + 1
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
    if (!canUnlockUpgrade(upgradeType, gameData.player.level)) return;

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
  const nextGrowthThreshold = getNextGrowthSpeedThreshold(gameData.inventory.totalClicks);
  const rareMultiplier = Math.pow(UPGRADE_INFO[UPGRADES.RARE_CHANCE].multiplier, gameData.upgrades[UPGRADES.RARE_CHANCE]);

  return (
    <div className="farm-game-idle discord-theme">
      {/* En-tête du jeu */}
      <div className="game-header">
        <Card className="p-4 bg-discord-secondary border-discord-accent">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-discord-green" />
                <span className="font-bold text-2xl text-discord-text">
                  {gameData.inventory.wheat.toLocaleString()} 🌾
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-discord-blurple" />
                <span className="font-semibold text-discord-text">
                  Niveau {gameData.player.level}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={cheatResources} variant="outline" size="sm" className="bg-discord-yellow border-discord-yellow hover:bg-discord-yellow/80 text-discord-primary">
                <Gamepad2 className="w-4 h-4 mr-2" />
                +100🌾 +1000XP
              </Button>
              <Button onClick={resetGame} variant="outline" size="sm" className="border-discord-red text-discord-red hover:bg-discord-red hover:text-white">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
          <div>
            <Progress value={xpProgress} className="h-3 bg-discord-primary" />
            <p className="text-xs text-discord-muted mt-1">
              XP: {gameData.player.xp} / {gameData.player.xpToNext}
            </p>
          </div>
        </Card>
      </div>

      <div className="game-content">
        {/* Terrain de jeu */}
        <div className="farm-section">
          <Card className="p-6 bg-discord-secondary border-discord-accent">
            <h2 className="text-xl font-bold mb-4 text-center text-discord-text">Mon Terrain</h2>
            <p className="text-sm text-discord-muted mb-4 text-center">
              Clic gauche: récolter | Clic droit: accélérer la pousse (2s cooldown)
            </p>
            <div 
              className={`farm-grid-idle grid-size-${gridSize}`}
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
                  const hasCooldown = (cell.boostCooldown || 0) > 0;
                  
                  // Classe CSS pour la rareté
                  const rarityClass = cell.state === WHEAT_STATES.MATURE && cell.wheatType !== WHEAT_TYPES.COMMON 
                    ? `rarity-${cell.wheatType}` 
                    : '';
                  
                  return (
                    <div
                      key={cell.id}
                      className={`farm-cell-idle ${cell.state} ${rarityClass} ${isHarvesting ? 'harvesting' : ''} ${
                        isBoosting ? 'boosting' : ''
                      } ${cell.boosted ? 'boosted' : ''} ${
                        stateInfo.canHarvest ? 'harvestable' : ''
                      } ${hasCooldown ? 'cooldown' : ''}`}
                      onClick={() => harvestCell(rowIndex, colIndex)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        boostGrowth(rowIndex, colIndex);
                      }}
                      title={`${stateInfo.name} ${
                        cell.state === WHEAT_STATES.MATURE ? `(${wheatInfo.name})` : ''
                      } ${stateInfo.canHarvest ? '(Clic gauche: récolter)' : '(Clic droit: accélérer)'} ${
                        cell.boosted ? '⚡ Boosté!' : ''
                      } ${hasCooldown ? `⏱️ Cooldown: ${Math.ceil((cell.boostCooldown || 0) / 1000)}s` : ''}`}
                    >
                      <div className="cell-content-idle">
                        <span className={`wheat-sprite-idle grid-${gridSize}`}>
                          {cell.state === WHEAT_STATES.MATURE ? '🌾' : stateInfo.emoji}
                        </span>
                        {isHarvesting && (
                          <div className="harvest-effect-idle">
                            <span className="floating-reward-idle">
                              +{Math.floor(WHEAT_TYPE_INFO[getRandomWheatType()].value * getHarvestAmount(gameData.upgrades[UPGRADES.HARVEST_AMOUNT]))}🌾
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
                        {hasCooldown && (
                          <div className="cooldown-indicator">
                            <span className="cooldown-timer">⏱️</span>
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
          <Card className="p-6 bg-discord-secondary border-discord-accent">
            <Tabs defaultValue="upgrades" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-discord-primary">
                <TabsTrigger value="upgrades" className="data-[state=active]:bg-discord-green data-[state=active]:text-white">Améliorations</TabsTrigger>
                <TabsTrigger value="stats" className="data-[state=active]:bg-discord-blurple data-[state=active]:text-white">Statistiques</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upgrades" className="space-y-4">
                {Object.entries(UPGRADE_INFO).map(([upgradeType, info]) => {
                  const currentLevel = gameData.upgrades[upgradeType];
                  const cost = getUpgradeCost(upgradeType, currentLevel);
                  const canAfford = gameData.inventory.wheat >= cost;
                  const isMaxLevel = currentLevel >= info.maxLevel;
                  const isAutoUnlock = info.isAutoUnlock;
                  const canUnlock = canUnlockUpgrade(upgradeType, gameData.player.level);
                  
                  let unlockMessage = '';
                  
                  if (upgradeType === UPGRADES.GRID_SIZE) {
                    const canUnlockGrid = canUnlockGridSize(gameData.player.level, currentLevel + 1);
                    if (!canUnlockGrid) {
                      const targetLevel = UPGRADE_INFO[UPGRADES.GRID_SIZE].levels[currentLevel + 1];
                      unlockMessage = `Niveau ${targetLevel?.reqLevel || '?'} requis`;
                    }
                  } else if (!canUnlock) {
                    unlockMessage = `Niveau ${info.unlockLevel} requis`;
                  }

                  const shouldShow = canUnlock || currentLevel > 0 || upgradeType === UPGRADES.GRID_SIZE || isAutoUnlock;
                  if (!shouldShow) return null;

                  return (
                    <div key={upgradeType} className="upgrade-card">
                      <div className="flex items-center justify-between p-3 border border-discord-accent rounded-lg bg-discord-primary">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {upgradeType === UPGRADES.GROWTH_SPEED ? (
                              <Target className="w-4 h-4 text-discord-green" />
                            ) : upgradeType === UPGRADES.AUTO_HARVEST ? (
                              <Clock className="w-4 h-4 text-discord-blurple" />
                            ) : upgradeType === UPGRADES.CRITICAL_HARVEST ? (
                              <Flame className="w-4 h-4 text-discord-red" />
                            ) : upgradeType === UPGRADES.EXPERIENCE_BOOST ? (
                              <BookOpen className="w-4 h-4 text-discord-yellow" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-discord-blurple" />
                            )}
                            <span className="font-semibold text-discord-text">{info.name}</span>
                            <Badge variant="secondary" className="bg-discord-accent text-discord-text">
                              Niv. {currentLevel}
                            </Badge>
                            {(upgradeType === UPGRADES.HARVEST_CHANCE || upgradeType === UPGRADES.AUTO_HARVEST || upgradeType === UPGRADES.CRITICAL_HARVEST || upgradeType === UPGRADES.EXPERIENCE_BOOST) && (
                              <Badge variant="outline" className="text-discord-green border-discord-green">
                                Nouveau!
                              </Badge>
                            )}
                            {isAutoUnlock && (
                              <Badge variant="outline" className="text-discord-yellow border-discord-yellow">
                                Auto
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-discord-muted mb-2">{info.description}</p>
                          {upgradeType === UPGRADES.GRID_SIZE && info.levels[currentLevel + 1] && (
                            <p className="text-xs text-discord-blurple">
                              Prochain: {info.levels[currentLevel + 1].description} (Niv. {info.levels[currentLevel + 1].reqLevel})
                            </p>
                          )}
                          {upgradeType === UPGRADES.GROWTH_SPEED && nextGrowthThreshold && (
                            <p className="text-xs text-discord-green">
                              Prochain: {nextGrowthThreshold.name} ({gameData.inventory.totalClicks}/{nextGrowthThreshold.clicks} clics)
                            </p>
                          )}
                          {upgradeType === UPGRADES.AUTO_HARVEST && currentLevel > 0 && (
                            <p className="text-xs text-discord-green">
                              Intervalle: {Math.round(UPGRADE_INFO[UPGRADES.AUTO_HARVEST].getHarvestInterval(currentLevel) / 1000)}s | 
                              Récolte: {UPGRADE_INFO[UPGRADES.AUTO_HARVEST].getHarvestAmount(currentLevel)} blé(s)
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {isAutoUnlock ? (
                            <Badge variant="default" className="bg-discord-green text-white">
                              {nextGrowthThreshold ? 'EN COURS' : 'MAX'}
                            </Badge>
                          ) : isMaxLevel ? (
                            <Badge variant="default" className="bg-discord-blurple text-white">MAX</Badge>
                          ) : unlockMessage ? (
                            <div className="flex items-center gap-1 text-discord-red">
                              <Lock className="w-4 h-4" />
                              <span className="text-sm">{unlockMessage}</span>
                            </div>
                          ) : (
                            <Button
                              onClick={() => buyUpgrade(upgradeType)}
                              disabled={!canAfford}
                              size="sm"
                              variant={canAfford ? "default" : "outline"}
                              className={canAfford ? "bg-discord-green hover:bg-discord-green/80" : "border-discord-accent text-discord-muted"}
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
                  <div className="stat-card bg-discord-primary border-discord-accent">
                    <Sprout className="w-6 h-6 text-discord-green mb-2" />
                    <div className="text-2xl font-bold text-discord-text">{gameData.inventory.totalHarvested.toLocaleString()}</div>
                    <div className="text-sm text-discord-muted">Blé Obtenu</div>
                  </div>
                  <div className="stat-card bg-discord-primary border-discord-accent">
                    <Target className="w-6 h-6 text-discord-blurple mb-2" />
                    <div className="text-2xl font-bold text-discord-text">{gameData.inventory.totalClicks.toLocaleString()}</div>
                    <div className="text-sm text-discord-muted">Blé Cliqué</div>
                  </div>
                  <div className="stat-card bg-discord-primary border-discord-accent">
                    <Clock className="w-6 h-6 text-discord-yellow mb-2" />
                    <div className="text-2xl font-bold text-discord-text">{Math.round(getGrowthTime(gameData.upgrades[UPGRADES.GROWTH_SPEED]) / 1000)}s</div>
                    <div className="text-sm text-discord-muted">Temps de Croissance</div>
                  </div>
                  <div className="stat-card bg-discord-primary border-discord-accent">
                    <Zap className="w-6 h-6 text-discord-red mb-2" />
                    <div className="text-2xl font-bold text-discord-text">{getHarvestAmount(gameData.upgrades[UPGRADES.HARVEST_AMOUNT])}</div>
                    <div className="text-sm text-discord-muted">Blé par Récolte</div>
                  </div>
                  <div className="stat-card bg-discord-primary border-discord-accent">
                    <Sparkles className="w-6 h-6 text-discord-green mb-2" />
                    <div className="text-2xl font-bold text-discord-text">x{rareMultiplier.toFixed(1)}</div>
                    <div className="text-sm text-discord-muted">Multiplicateur de Rareté</div>
                  </div>
                  <div className="stat-card bg-discord-primary border-discord-accent">
                    <Trophy className="w-6 h-6 text-discord-yellow mb-2" />
                    <div className="text-2xl font-bold text-discord-text">{Math.round(getCriticalHarvestChance(gameData.upgrades[UPGRADES.CRITICAL_HARVEST]) * 100)}%</div>
                    <div className="text-sm text-discord-muted">Chance Critique</div>
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
          <div className="sound-indicator-idle bg-discord-primary border-discord-accent text-discord-text">
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