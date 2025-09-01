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
  AUTO_HARVEST_SPEED_THRESHOLDS,
  getRandomWheatType,
  getGrowthTime,
  getGrowthSpeedLevel,
  getHarvestAmount,
  getHarvestChance,
  getAutoHarvestChance,
  getAutoHarvestSpeedLevel,
  getAutoHarvestInterval,
  getNextAutoHarvestSpeedThreshold,
  getCriticalHarvestChance,
  getExperienceMultiplier,
  getUpgradeCost,
  getGridSize,
  canUnlockGridSize,
  canUnlockUpgrade,
  getNextGrowthSpeedThreshold,
  getXpMultiplier,
  getXpRequired,
  calculateLevelFromXp,
  getWheatTypeProbability,
  formatProbability,
  getFullHarvestSkillLevel,
  getFullHarvestChance
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
      // Ajouter les statistiques par rareté si elles n'existent pas
      if (!parsedData.inventory.harvestedByRarity) {
        parsedData.inventory.harvestedByRarity = {};
        Object.values(WHEAT_TYPES).forEach(type => {
          parsedData.inventory.harvestedByRarity[type] = 0;
        });
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
  const [harvestHistory, setHarvestHistory] = useState([]);

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

        // Récolter le nombre de blés selon le niveau (sélection aléatoire)
        const cellsToHarvest = [];
        const shuffledCells = [...matureCells].sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(harvestAmount, shuffledCells.length); i++) {
          cellsToHarvest.push(shuffledCells[i]);
        }
        
        let totalAutoWheat = 0;
        let totalAutoXp = 0;

        const newGrid = prev.grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const shouldHarvest = cellsToHarvest.some(c => c.rowIndex === rowIndex && c.colIndex === colIndex);
            
            if (shouldHarvest) {
              // Auto-récolte avec les mêmes calculs que la récolte manuelle
              const cellWheatType = cell.wheatType;
              const wheatValue = WHEAT_TYPE_INFO[cellWheatType].value;
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
                wheatType: getRandomWheatType(prev.upgrades[UPGRADES.RARE_CHANCE]),
                boosted: false,
                boostCooldown: 0
              };
            }
            return cell;
          })
        );

        if (totalAutoWheat > 0) {
          const newTotalXp = prev.player.xp + totalAutoXp;
          const newLevelInfo = calculateLevelFromXp(newTotalXp);

          // Mise à jour des statistiques par rareté
          const newHarvestedByRarity = { ...prev.inventory.harvestedByRarity };
          cellsToHarvest.forEach(({ cell }) => {
            newHarvestedByRarity[cell.wheatType] = (newHarvestedByRarity[cell.wheatType] || 0) + 1;
          });

          return {
            ...prev,
            grid: newGrid,
            inventory: {
              ...prev.inventory,
              wheat: prev.inventory.wheat + totalAutoWheat,
              totalHarvested: prev.inventory.totalHarvested + totalAutoWheat,
              totalClicks: prev.inventory.totalClicks + cellsToHarvest.length,
              harvestedByRarity: newHarvestedByRarity
            },
            player: {
              ...prev.player,
              level: newLevelInfo.level,
              xp: newTotalXp,
              xpToNext: newLevelInfo.xpToNext
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

  // Fonction pour ajouter à l'historique des récoltes
  const addToHarvestHistory = (wheatType, totalWheat, xpGained, isCritical, isBonus = false) => {
    const harvestEntry = {
      id: Date.now() + Math.random(),
      wheatType,
      totalWheat,
      xpGained,
      isCritical,
      isBonus,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setHarvestHistory(prev => [harvestEntry, ...prev.slice(0, 9)]); // Garder seulement les 10 derniers
  };

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

    // Déterminer le type de blé récolté (utiliser le type stocké dans la cellule)
    const wheatType = cell.wheatType;
    const wheatValue = WHEAT_TYPE_INFO[wheatType].value;
    const harvestAmount = getHarvestAmount(gameData.upgrades[UPGRADES.HARVEST_AMOUNT]);
    const isCritical = Math.random() < getCriticalHarvestChance(gameData.upgrades[UPGRADES.CRITICAL_HARVEST]);
    const criticalMultiplier = isCritical ? UPGRADE_INFO[UPGRADES.CRITICAL_HARVEST].multiplier : 1;
    const totalWheat = wheatValue * harvestAmount * criticalMultiplier;
    const xpMultiplier = getExperienceMultiplier(gameData.upgrades[UPGRADES.EXPERIENCE_BOOST]);
    const xpGained = Math.floor(wheatValue * 5 * xpMultiplier);

    // Ajouter à l'historique
    addToHarvestHistory(wheatType, totalWheat, xpGained, isCritical, false);

    // Vérifier la chance de récolte complète
    const fullHarvestChance = getFullHarvestChance(levelInfo.level);
    const isFullHarvest = Math.random() < (fullHarvestChance / 100); // Convertir le pourcentage
    
    // Nouveau système de chance de récolte
    let bonusHarvest = 0;
    let bonusWheatCount = 0;
    let harvestedCells = [];
    
    if (isFullHarvest) {
      // Récolter toutes les cellules matures du terrain
      for (let r = 0; r < gameData.grid.length; r++) {
        for (let c = 0; c < gameData.grid[r].length; c++) {
          if ((r !== rowIndex || c !== colIndex) && gameData.grid[r][c].state === WHEAT_STATES.MATURE) {
            harvestedCells.push({ row: r, col: c });
          }
        }
      }
    } else {
      // Système normal de récolte multiple
      const harvestChance = getHarvestChance(gameData.upgrades[UPGRADES.HARVEST_CHANCE]);
      
      if (harvestChance >= 1.0) {
        // À 100%+, on calcule le nombre de blés de base garanti + chance pour les suivants
        const baseHarvests = Math.floor(harvestChance); // Nombre de blés garantis (1 à 100%, 2 à 200%, etc.)
        const extraChance = harvestChance - Math.floor(harvestChance); // Chance pour le suivant
        
        // Collecter tous les autres blés matures
        const otherMatureCells = [];
        for (let r = 0; r < gameData.grid.length; r++) {
          for (let c = 0; c < gameData.grid[r].length; c++) {
            if ((r !== rowIndex || c !== colIndex) && gameData.grid[r][c].state === WHEAT_STATES.MATURE) {
              otherMatureCells.push({ row: r, col: c });
            }
          }
        }
        
        if (otherMatureCells.length > 0) {
          // Mélanger les cellules
          const shuffledCells = [...otherMatureCells].sort(() => Math.random() - 0.5);
          
          // Récolter le nombre de base garanti
          for (let i = 0; i < Math.min(shuffledCells.length, baseHarvests); i++) {
            harvestedCells.push(shuffledCells[i]);
          }
          
          // Pour le suivant, utiliser la chance restante
          if (baseHarvests < shuffledCells.length && extraChance > 0 && Math.random() < extraChance) {
            harvestedCells.push(shuffledCells[baseHarvests]);
          }
        }
      } else if (harvestChance > 0) {
        // Système normal < 100%
        const otherMatureCells = [];
        for (let r = 0; r < gameData.grid.length; r++) {
          for (let c = 0; c < gameData.grid[r].length; c++) {
            if ((r !== rowIndex || c !== colIndex) && gameData.grid[r][c].state === WHEAT_STATES.MATURE) {
              otherMatureCells.push({ row: r, col: c });
            }
          }
        }
        
        if (otherMatureCells.length > 0 && Math.random() < harvestChance) {
          const randomIndex = Math.floor(Math.random() * otherMatureCells.length);
          harvestedCells.push(otherMatureCells[randomIndex]);
        }
      }
    }

    // Traiter toutes les cellules récoltées en bonus
    harvestedCells.forEach(selectedCell => {
      const r = selectedCell.row;
      const c = selectedCell.col;
      
      const bonusWheatType = gameData.grid[r][c].wheatType;
      const bonusWheatValue = WHEAT_TYPE_INFO[bonusWheatType].value;
      const bonusIsCritical = Math.random() < getCriticalHarvestChance(gameData.upgrades[UPGRADES.CRITICAL_HARVEST]);
      const bonusCriticalMultiplier = bonusIsCritical ? UPGRADE_INFO[UPGRADES.CRITICAL_HARVEST].multiplier : 1;
      const cellBonusHarvest = bonusWheatValue * harvestAmount * bonusCriticalMultiplier;
      
      bonusHarvest += cellBonusHarvest;
      bonusWheatCount++;
      
      // Ajouter la récolte bonus à l'historique
      const bonusXpGained = Math.floor(bonusWheatValue * 5 * xpMultiplier);
      addToHarvestHistory(bonusWheatType, cellBonusHarvest, bonusXpGained, bonusIsCritical, true);
    });

    // Mise à jour des données
    setGameData(prev => {
      const newTotalXp = prev.player.xp + xpGained;
      const newLevelInfo = calculateLevelFromXp(newTotalXp);
      
      // Mise à jour des statistiques par rareté
      const newHarvestedByRarity = { ...prev.inventory.harvestedByRarity };
      newHarvestedByRarity[wheatType] = (newHarvestedByRarity[wheatType] || 0) + 1;
      
      // Compter les blés bonus aussi
      harvestedCells.forEach(selectedCell => {
        const r = selectedCell.row;
        const c = selectedCell.col;
        const bonusWheatType = prev.grid[r][c].wheatType;
        newHarvestedByRarity[bonusWheatType] = (newHarvestedByRarity[bonusWheatType] || 0) + 1;
      });
      
      return {
        ...prev,
        grid: prev.grid.map((row, rIdx) =>
          row.map((c, cIdx) => {
            // Réinitialiser la cellule principale
            if (rIdx === rowIndex && cIdx === colIndex) {
              return {
                ...c,
                state: WHEAT_STATES.SEED,
                plantedAt: Date.now(),
                wheatType: getRandomWheatType(prev.upgrades[UPGRADES.RARE_CHANCE]),
                boosted: false,
                boostCooldown: 0
              };
            }
            // Réinitialiser les cellules bonus
            const shouldResetBonus = harvestedCells.some(cell => cell.row === rIdx && cell.col === cIdx);
            if (shouldResetBonus) {
              return {
                ...c,
                state: WHEAT_STATES.SEED,
                plantedAt: Date.now(),
                wheatType: getRandomWheatType(prev.upgrades[UPGRADES.RARE_CHANCE]),
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
          totalClicks: prev.inventory.totalClicks + 1 + bonusWheatCount,
          harvestedByRarity: newHarvestedByRarity
        },
        player: {
          ...prev.player,
          level: newLevelInfo.level,
          xp: newTotalXp,
          xpToNext: newLevelInfo.xpToNext
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
      const newTotalXp = prev.player.xp + 1000;
      const newLevelInfo = calculateLevelFromXp(newTotalXp);
      
      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          wheat: prev.inventory.wheat + 100
        },
        player: {
          ...prev.player,
          level: newLevelInfo.level,
          xp: newTotalXp,
          xpToNext: newLevelInfo.xpToNext
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

  const levelInfo = calculateLevelFromXp(gameData.player.xp);
  const xpProgress = (levelInfo.currentLevelXp / levelInfo.xpToNext) * 100;
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
                  Niveau {levelInfo.level}
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
              XP: {levelInfo.currentLevelXp} / {levelInfo.xpToNext} (Multiplicateur: x{getXpMultiplier(levelInfo.level)})
            </p>
          </div>
        </Card>
      </div>

      <div className="game-content">
        {/* Historique des récoltes */}
        <div className="harvest-history-section">
          <Card className="p-4 bg-discord-secondary border-discord-accent">
            <h3 className="text-lg font-bold mb-3 text-center text-discord-text">
              <span className="mr-2">📊</span>
              Historique des Récoltes
            </h3>
            <div className="harvest-history-list">
              {harvestHistory.length === 0 ? (
                <p className="text-discord-muted text-sm text-center">Aucune récolte encore</p>
              ) : (
                harvestHistory.map((entry) => {
                  const wheatInfo = WHEAT_TYPE_INFO[entry.wheatType];
                  return (
                    <div 
                      key={entry.id} 
                      className={`harvest-entry p-2 mb-2 rounded border ${
                        entry.isBonus ? 'border-discord-green bg-discord-green/10' : 'border-discord-accent bg-discord-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🌾</span>
                          <div>
                            <div className={`font-semibold ${
                              entry.wheatType === WHEAT_TYPES.COMMON ? 'text-discord-text' :
                              entry.wheatType === WHEAT_TYPES.UNCOMMON ? 'text-green-400' :
                              entry.wheatType === WHEAT_TYPES.RARE ? 'text-blue-400' :
                              entry.wheatType === WHEAT_TYPES.EPIC ? 'text-purple-400' :
                              entry.wheatType === WHEAT_TYPES.LEGENDARY ? 'text-yellow-400' :
                              entry.wheatType === WHEAT_TYPES.MYTHIC ? 'text-pink-400' :
                              entry.wheatType === WHEAT_TYPES.TRANSCENDENT ? 'text-cyan-400' :
                              entry.wheatType === WHEAT_TYPES.DIVINE ? 'text-indigo-400' :
                              entry.wheatType === WHEAT_TYPES.CELESTIAL ? 'text-red-400' :
                              entry.wheatType === WHEAT_TYPES.COSMIC ? 'text-violet-400' :
                              entry.wheatType === WHEAT_TYPES.OMNIPOTENT ? 'text-amber-400' :
                              'text-gray-400'
                            }`}>
                              {wheatInfo.name}
                              {entry.isBonus && <span className="text-discord-green ml-1">(Bonus)</span>}
                              {entry.isCritical && <span className="text-discord-red ml-1">⚡</span>}
                            </div>
                            <div className="text-discord-muted text-xs">{entry.timestamp}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-discord-text font-semibold">+{entry.totalWheat}🌾</div>
                          <div className="text-discord-blurple text-xs">+{entry.xpGained}XP</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

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
              <TabsList className="grid w-full grid-cols-3 bg-discord-primary">
                <TabsTrigger value="upgrades" className="data-[state=active]:bg-discord-green data-[state=active]:text-white">Améliorations</TabsTrigger>
                <TabsTrigger value="stats" className="data-[state=active]:bg-discord-blurple data-[state=active]:text-white">Statistiques</TabsTrigger>
                <TabsTrigger value="rarity" className="data-[state=active]:bg-discord-yellow data-[state=active]:text-white">Raretés</TabsTrigger>
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
                            ) : upgradeType === UPGRADES.AUTO_HARVEST_CHANCE ? (
                              <Clock className="w-4 h-4 text-discord-blurple" />
                            ) : upgradeType === UPGRADES.CRITICAL_HARVEST ? (
                              <Flame className="w-4 h-4 text-discord-red" />
                            ) : upgradeType === UPGRADES.EXPERIENCE_BOOST ? (
                              <BookOpen className="w-4 h-4 text-discord-yellow" />
                            ) : upgradeType === UPGRADES.FULL_HARVEST_SKILL ? (
                              <Target className="w-4 h-4 text-discord-green" />
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
                          {upgradeType === UPGRADES.GROWTH_SPEED && (
                            <p className="text-xs text-discord-green">
                              Temps de repousse: {Math.round(getGrowthTime(currentLevel) / 1000)}s
                              {nextGrowthThreshold && ` | Prochain niveau: ${Math.round(getGrowthTime(nextGrowthThreshold.level) / 1000)}s`}
                            </p>
                          )}
                          {upgradeType === UPGRADES.HARVEST_AMOUNT && (
                            <p className="text-xs text-discord-green">
                              Blé par récolte: {getHarvestAmount(currentLevel)} | 
                              Prochain niveau: {getHarvestAmount(currentLevel + 1)}
                            </p>
                          )}
                          {upgradeType === UPGRADES.RARE_CHANCE && (
                            <p className="text-xs text-discord-green">
                              Multiplicateur actuel: x{Math.pow(UPGRADE_INFO[UPGRADES.RARE_CHANCE].multiplier, currentLevel).toFixed(2)} | 
                              Prochain niveau: x{Math.pow(UPGRADE_INFO[UPGRADES.RARE_CHANCE].multiplier, currentLevel + 1).toFixed(2)}
                            </p>
                          )}
                          {upgradeType === UPGRADES.CRITICAL_HARVEST && (
                            <p className="text-xs text-discord-green">
                              Critique actuel: {Math.round(getCriticalHarvestChance(currentLevel) * 100)}% | 
                              Prochain niveau: {Math.round(getCriticalHarvestChance(currentLevel + 1) * 100)}%
                            </p>
                          )}
                          {upgradeType === UPGRADES.EXPERIENCE_BOOST && (
                            <p className="text-xs text-discord-green">
                              Multiplicateur actuel: x{getExperienceMultiplier(currentLevel).toFixed(2)} | 
                              Prochain niveau: x{getExperienceMultiplier(currentLevel + 1).toFixed(2)}
                            </p>
                          )}
                          {upgradeType === UPGRADES.HARVEST_CHANCE && (
                            <p className="text-xs text-discord-green">
                              Probabilité actuelle: {getHarvestChance(currentLevel) >= 1.0 
                                ? `${Math.floor(getHarvestChance(currentLevel))} base + ${Math.round((getHarvestChance(currentLevel) - Math.floor(getHarvestChance(currentLevel))) * 100)}%`
                                : `${Math.round(getHarvestChance(currentLevel) * 100)}%`
                              } | Prochain niveau: {getHarvestChance(currentLevel + 1) >= 1.0 
                                ? `${Math.floor(getHarvestChance(currentLevel + 1))} base + ${Math.round((getHarvestChance(currentLevel + 1) - Math.floor(getHarvestChance(currentLevel + 1))) * 100)}%`
                                : `${Math.round(getHarvestChance(currentLevel + 1) * 100)}%`
                              }
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
                    <div className="text-sm text-discord-muted">Blé par Récolte (Niv. {gameData.upgrades[UPGRADES.HARVEST_AMOUNT]})</div>
                  </div>
                  <div className="stat-card bg-discord-primary border-discord-accent">
                    <Sparkles className="w-6 h-6 text-discord-green mb-2" />
                    <div className="text-2xl font-bold text-discord-text">x{rareMultiplier.toFixed(1)}</div>
                    <div className="text-sm text-discord-muted">Multiplicateur de Rareté</div>
                  </div>
                  <div className="stat-card bg-discord-primary border-discord-accent">
                    <Sparkles className="w-6 h-6 text-discord-green mb-2" />
                    <div className="text-2xl font-bold text-discord-text">
                      {getHarvestChance(gameData.upgrades[UPGRADES.HARVEST_CHANCE]) >= 1.0 
                        ? `${Math.floor(getHarvestChance(gameData.upgrades[UPGRADES.HARVEST_CHANCE]))} + ${Math.round((getHarvestChance(gameData.upgrades[UPGRADES.HARVEST_CHANCE]) - Math.floor(getHarvestChance(gameData.upgrades[UPGRADES.HARVEST_CHANCE]))) * 100)}%`
                        : `${Math.round(getHarvestChance(gameData.upgrades[UPGRADES.HARVEST_CHANCE]) * 100)}%`
                      }
                    </div>
                    <div className="text-sm text-discord-muted">Chance de Récolte Multiple</div>
                  </div>
                  <div className="stat-card bg-discord-primary border-discord-accent">
                    <Trophy className="w-6 h-6 text-discord-yellow mb-2" />
                    <div className="text-2xl font-bold text-discord-text">{Math.round(getCriticalHarvestChance(gameData.upgrades[UPGRADES.CRITICAL_HARVEST]) * 100)}%</div>
                    <div className="text-sm text-discord-muted">Chance de Récolte Critique</div>
                  </div>
                  <div className="stat-card bg-discord-primary border-discord-accent">
                    <BookOpen className="w-6 h-6 text-discord-blurple mb-2" />
                    <div className="text-2xl font-bold text-discord-text">x{getExperienceMultiplier(gameData.upgrades[UPGRADES.EXPERIENCE_BOOST]).toFixed(2)}</div>
                    <div className="text-sm text-discord-muted">Boost d'XP Récolte</div>
                  </div>
                  <div className="stat-card bg-discord-primary border-discord-accent">
                    <Target className="w-6 h-6 text-discord-green mb-2" />
                    <div className="text-2xl font-bold text-discord-text">{getFullHarvestChance(levelInfo.level).toFixed(2)}%</div>
                    <div className="text-sm text-discord-muted">Chance Récolte Complète (Niv. {getFullHarvestSkillLevel(levelInfo.level)})</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rarity" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-center text-discord-text">
                    <span className="mr-2">🏆</span>
                    Total des Blés Récoltés par Rareté
                  </h3>
                  <div className="space-y-2">
                    {Object.values(WHEAT_TYPES)
                      .reverse() // Afficher du plus rare au moins rare
                      .filter(wheatType => (gameData.inventory.harvestedByRarity?.[wheatType] || 0) > 0)
                      .map(wheatType => {
                        const wheatInfo = WHEAT_TYPE_INFO[wheatType];
                        const count = gameData.inventory.harvestedByRarity?.[wheatType] || 0;
                        const probability = formatProbability(wheatInfo.rarity);
                        
                        return (
                          <div key={wheatType} className="flex items-center justify-between p-3 border border-discord-accent rounded-lg bg-discord-primary">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">🌾</span>
                              <div>
                                <div className={`font-semibold ${
                                  wheatType === WHEAT_TYPES.COMMON ? 'text-discord-text' :
                                  wheatType === WHEAT_TYPES.UNCOMMON ? 'text-green-400' :
                                  wheatType === WHEAT_TYPES.RARE ? 'text-blue-400' :
                                  wheatType === WHEAT_TYPES.EPIC ? 'text-purple-400' :
                                  wheatType === WHEAT_TYPES.LEGENDARY ? 'text-yellow-400' :
                                  wheatType === WHEAT_TYPES.MYTHIC ? 'text-pink-400' :
                                  wheatType === WHEAT_TYPES.TRANSCENDENT ? 'text-cyan-400' :
                                  wheatType === WHEAT_TYPES.DIVINE ? 'text-indigo-400' :
                                  wheatType === WHEAT_TYPES.CELESTIAL ? 'text-red-400' :
                                  wheatType === WHEAT_TYPES.COSMIC ? 'text-violet-400' :
                                  wheatType === WHEAT_TYPES.OMNIPOTENT ? 'text-amber-400' :
                                  'text-gray-400'
                                }`}>
                                  {wheatInfo.name}
                                </div>
                                <div className="text-xs text-discord-muted">
                                  Probabilité: {probability} | Valeur: {wheatInfo.value}🌾
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-discord-text">{count.toLocaleString()}</div>
                              <div className="text-sm text-discord-muted">récoltés</div>
                            </div>
                          </div>
                        );
                      })}
                    {Object.values(WHEAT_TYPES).every(wheatType => (gameData.inventory.harvestedByRarity?.[wheatType] || 0) === 0) && (
                      <div className="text-center text-discord-muted py-8">
                        <p>Aucun blé récolté encore.</p>
                        <p className="text-sm mt-2">Commencez à récolter pour voir vos statistiques !</p>
                      </div>
                    )}
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