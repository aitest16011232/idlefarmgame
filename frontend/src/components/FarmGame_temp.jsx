// Je vais créer un nouveau TabsContent pour les améliorations organisées
              <TabsContent value="upgrades" className="space-y-4">
                {Object.entries(upgradeCategories).map(([categoryKey, category]) => (
                  <div key={categoryKey} className="mb-6">
                    <h3 className="text-lg font-bold mb-3 text-discord-text flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </h3>
                    <div className="space-y-3">
                      {category.upgrades.map(upgradeType => {
                        const info = UPGRADE_INFO[upgradeType];
                        if (!info) return null;
                        
                        const currentLevel = gameData.upgrades[upgradeType];
                        
                        // Gestion spéciale pour les améliorations de grades
                        let cost, canAfford, canUnlock, unlockMessage = '';
                        
                        if (categoryKey === 'grades') {
                          cost = getGradeUpgradeCost(upgradeType, currentLevel);
                          canAfford = gameData.inventory.wheat >= cost;
                          canUnlock = canUnlockGradeUpgrade(upgradeType, gameData.inventory.harvestedByGrade);
                          if (!canUnlock) {
                            unlockMessage = `Obtenez au moins 1 blé ${WHEAT_GRADE_INFO[info.gradeType].name}`;
                          } else if (currentLevel > 0) {
                            const nextThreshold = getNextGradeThreshold(upgradeType, currentLevel);
                            const currentGradeCount = gameData.inventory.harvestedByGrade[info.gradeType] || 0;
                            if (nextThreshold && currentGradeCount < nextThreshold) {
                              canAfford = false;
                              unlockMessage = `${currentGradeCount}/${nextThreshold} blés ${WHEAT_GRADE_INFO[info.gradeType].name}`;
                            }
                          }
                        } else {
                          cost = getUpgradeCost(upgradeType, currentLevel);
                          canAfford = gameData.inventory.wheat >= cost;
                          canUnlock = canUnlockUpgrade(upgradeType, gameData.player.level);
                          
                          if (upgradeType === UPGRADES.GRID_SIZE) {
                            const canUnlockGrid = canUnlockGridSize(gameData.player.level, currentLevel + 1);
                            if (!canUnlockGrid) {
                              const targetLevel = UPGRADE_INFO[UPGRADES.GRID_SIZE].levels[currentLevel + 1];
                              unlockMessage = `Niveau ${targetLevel?.reqLevel || '?'} requis`;
                            }
                          } else if (!canUnlock) {
                            unlockMessage = `Niveau ${info.unlockLevel} requis`;
                          }
                        }
                        
                        const isMaxLevel = currentLevel >= info.maxLevel;
                        const isAutoUnlock = info.isAutoUnlock;
                        
                        const shouldShow = canUnlock || currentLevel > 0 || upgradeType === UPGRADES.GRID_SIZE || isAutoUnlock || categoryKey === 'grades';
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
                                  ) : categoryKey === 'grades' ? (
                                    <span style={{ color: WHEAT_GRADE_INFO[info.gradeType].starColor }}>⭐</span>
                                  ) : (
                                    <TrendingUp className="w-4 h-4 text-discord-blurple" />
                                  )}
                                  <span className="font-semibold text-discord-text">{info.name}</span>
                                  <Badge variant="secondary" className="bg-discord-accent text-discord-text">
                                    Niv. {currentLevel}
                                  </Badge>
                                  {(upgradeType === UPGRADES.MULTI_HARVEST || upgradeType === UPGRADES.AUTO_HARVEST_CHANCE || upgradeType === UPGRADES.CRITICAL_HARVEST || upgradeType === UPGRADES.EXPERIENCE_BOOST || upgradeType === UPGRADES.FULL_HARVEST_SKILL) && (
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
                                
                                {/* Informations spécifiques par amélioration */}
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
                                {upgradeType === UPGRADES.AUTO_HARVEST_CHANCE && currentLevel > 0 && (
                                  <p className="text-xs text-discord-green">
                                    Chance: {Math.round(getAutoHarvestChance(currentLevel) * 100)}% | 
                                    Intervalle: {Math.round(getAutoHarvestInterval(getAutoHarvestSpeedLevel(gameData.inventory.totalAutoHarvested)) / 1000)}s
                                  </p>
                                )}
                                {upgradeType === UPGRADES.AUTO_HARVEST_SPEED && (
                                  <p className="text-xs text-discord-green">
                                    Palier: {getAutoHarvestSpeedLevel(gameData.inventory.totalAutoHarvested)}/11 ({gameData.inventory.totalAutoHarvested} récoltés) | 
                                    {(() => {
                                      const nextThreshold = getNextAutoHarvestSpeedThreshold(gameData.inventory.totalAutoHarvested);
                                      return nextThreshold ? `Prochain: ${nextThreshold.harvested}` : 'MAX atteint';
                                    })()}
                                  </p>
                                )}
                                {upgradeType === UPGRADES.FULL_HARVEST_SKILL && (
                                  <p className="text-xs text-discord-green">
                                    Niveau compétence: {getFullHarvestSkillLevel(levelInfo.level)} | 
                                    Chance actuelle: {getFullHarvestChance(levelInfo.level).toFixed(2)}%
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
                                {upgradeType === UPGRADES.MULTI_HARVEST && (
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
                                
                                {/* Informations spécifiques aux améliorations de grades */}
                                {categoryKey === 'grades' && (
                                  <div className="text-xs text-discord-green space-y-1">
                                    <p>Grade: {WHEAT_GRADE_INFO[info.gradeType].name} (x{WHEAT_GRADE_INFO[info.gradeType].multiplier})</p>
                                    <p>Probabilité base: {formatProbability(WHEAT_GRADE_INFO[info.gradeType].probability)}</p>
                                    <p>Probabilité actuelle: {formatProbability(getGradeProbability(info.gradeType, currentLevel))}</p>
                                    {currentLevel > 0 && (
                                      <p>Blés obtenus: {gameData.inventory.harvestedByGrade[info.gradeType] || 0}</p>
                                    )}
                                  </div>
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
                    </div>
                  </div>
                ))}
              </TabsContent>