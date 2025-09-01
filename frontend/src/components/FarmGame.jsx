import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Sprout, Package, Star, RotateCcw } from 'lucide-react';
import { 
  initialFarmData, 
  WHEAT_STATES, 
  WHEAT_STATE_INFO, 
  HARVEST_REWARDS 
} from '../data/mock';
import './FarmGame.css';

const FarmGame = () => {
  const [farmData, setFarmData] = useState(initialFarmData);
  const [harvestAnimations, setHarvestAnimations] = useState({});
  const [soundEffect, setSoundEffect] = useState('');

  // Système de croissance automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setFarmData(prev => ({
        ...prev,
        grid: prev.grid.map(row =>
          row.map(cell => {
            if (cell.state === WHEAT_STATES.MATURE) return cell;
            
            const timeSincePlanted = Date.now() - cell.plantedAt;
            const currentStateInfo = WHEAT_STATE_INFO[cell.state];
            
            if (timeSincePlanted >= currentStateInfo.growthTime) {
              const states = Object.values(WHEAT_STATES);
              const currentIndex = states.indexOf(cell.state);
              const nextState = states[currentIndex + 1] || cell.state;
              
              return {
                ...cell,
                state: nextState,
                plantedAt: cell.state === nextState ? cell.plantedAt : Date.now()
              };
            }
            
            return cell;
          })
        )
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const harvestCell = (rowIndex, colIndex) => {
    const cell = farmData.grid[rowIndex][colIndex];
    
    if (cell.state !== WHEAT_STATES.MATURE) return;

    // Animation de récolte
    const animationId = `${rowIndex}-${colIndex}`;
    setHarvestAnimations(prev => ({ ...prev, [animationId]: true }));
    setSoundEffect('harvest');

    // Mise à jour des données
    setFarmData(prev => ({
      ...prev,
      grid: prev.grid.map((row, rIdx) =>
        row.map((c, cIdx) => {
          if (rIdx === rowIndex && cIdx === colIndex) {
            return {
              ...c,
              state: WHEAT_STATES.SEED,
              plantedAt: Date.now()
            };
          }
          return c;
        })
      ),
      inventory: {
        ...prev.inventory,
        seeds: prev.inventory.seeds + HARVEST_REWARDS.seeds,
        wheat: prev.inventory.wheat + HARVEST_REWARDS.wheat
      },
      player: {
        ...prev.player,
        xp: prev.player.xp + HARVEST_REWARDS.xp
      }
    }));

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

  const resetFarm = () => {
    setFarmData(initialFarmData);
    setHarvestAnimations({});
    setSoundEffect('');
  };

  const xpProgress = (farmData.player.xp % farmData.player.xpToNext) / farmData.player.xpToNext * 100;

  return (
    <div className="farm-game">
      <div className="game-header">
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">
                  Graines: {farmData.inventory.seeds}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-amber-800">
                  Blé: {farmData.inventory.wheat}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">
                  Niveau {farmData.player.level} (XP: {farmData.player.xp})
                </span>
              </div>
            </div>
            <Button onClick={resetFarm} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          <div className="mt-3">
            <Progress value={xpProgress} className="h-2" />
            <p className="text-xs text-gray-600 mt-1">
              Progrès vers niveau {farmData.player.level + 1}
            </p>
          </div>
        </Card>
      </div>

      <div className="farm-container">
        <div className="farm-grid">
          {farmData.grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const stateInfo = WHEAT_STATE_INFO[cell.state];
              const animationId = `${rowIndex}-${colIndex}`;
              const isAnimating = harvestAnimations[animationId];
              
              return (
                <div
                  key={cell.id}
                  className={`farm-cell ${cell.state} ${isAnimating ? 'harvesting' : ''} ${
                    stateInfo.canHarvest ? 'harvestable' : ''
                  }`}
                  onClick={() => harvestCell(rowIndex, colIndex)}
                  title={`${stateInfo.name} ${stateInfo.canHarvest ? '(Cliquez pour récolter)' : ''}`}
                >
                  <div className="cell-content">
                    <span className="wheat-sprite">{stateInfo.emoji}</span>
                    {isAnimating && (
                      <div className="harvest-effect">
                        <span className="floating-reward">+{HARVEST_REWARDS.xp} XP</span>
                        <span className="floating-reward seeds">+{HARVEST_REWARDS.seeds} 🌱</span>
                        <div className="harvest-particles">
                          <div className="particle"></div>
                          <div className="particle"></div>
                          <div className="particle"></div>
                          <div className="particle"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Effet sonore simulé */}
      {soundEffect && (
        <div className="sound-effect">
          <div className="sound-indicator">
            🔊 {soundEffect === 'harvest' ? 'Récolte!' : soundEffect}
          </div>
        </div>
      )}

      <div className="game-instructions">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2">Instructions</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>🌱 Les graines poussent automatiquement avec le temps</li>
            <li>🌾 Cliquez sur le blé mature (doré) pour le récolter</li>
            <li>📦 La récolte vous donne des graines et de l'XP</li>
            <li>⭐ Gagnez de l'XP pour progresser en niveau</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default FarmGame;