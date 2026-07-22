// English — source of truth. All other language files mirror these keys.
// Convention:
//   menu.*       — main intro menu
//   pause.*      — pause overlay
//   settings.*   — settings modal
//   tree.*       — skill tree screen
//   run.*        — in-run HUD / banners
//   summary.*    — end-of-run summary
//   ending.*     — final ending screen
//   saveSlots.*  — save slot picker
//   admin.*      — admin/debug panel (kept in English in-game is fine, but localized for completeness)
//   upg.<id>.name / upg.<id>.desc — upgrade names and descriptions

YYH_I18N.addStrings('en', {
  // Intro / main menu
  'menu.play': 'Play',
  'menu.saveSlots': 'Save Slots',
  'menu.settings': 'Settings',
  'menu.quit': 'Quit',
  'menu.credit': 'by gamingisdeadstudio',
  'menu.wishlistOnSteam': 'Wishlist on Steam',
  'menu.review': 'Review',
  'menu.pressKit': 'Press Kit',
  'menu.discord': 'Discord',
  'menu.joinDiscord': 'Join the Discord',
  'menu.leaveReview': 'Leave a review',

  // Save slots
  'saveSlots.title': 'Choose a Save Slot',
  'saveSlots.back': 'Back',

  // Skill tree
  'tree.startRun': 'Start Run',
  'tree.hoverHint': 'Hover an upgrade to see details.',
  'tree.availableHoney': 'Available honey',
  'tree.squeezeMe': 'SQUEEZE<br>ME',
  'tree.squeezeHint': 'Extra Honey',
  'tree.squeezeTitle': 'Grab and shake — honey might squeeze out',

  // HUD
  'hud.timeRemaining': 'Run time remaining',

  // Pause
  'pause.title': 'Paused',
  'pause.resume': 'Resume',
  'pause.settings': 'Settings',
  'pause.mainMenu': 'Exit to main menu',
  'pause.admin': 'Admin',

  // Settings
  'settings.title': 'Settings',
  'settings.ambience': 'Ambience',
  'settings.effects': 'Effects',
  'settings.music': 'Music',
  'settings.resolution': 'Resolution',
  'settings.refreshRate': 'Refresh Rate',
  'settings.refreshDisplay': 'Display refresh rate',
  'settings.fullscreen': 'Fullscreen',
  'settings.language': 'Language',
  'settings.close': 'Close',
  'settings.ambienceTitle': 'Bird ambience volume',
  'settings.effectsTitle': 'Pop, bee, wind, jar, and menu sound volume',
  'settings.musicTitle': 'Theme and background music volume',
  'settings.resolutionTitle': 'Higher resolution looks sharper but costs more performance',
  'settings.refreshTitle': 'Limit rendered frames to save power or reduce GPU load',
  'settings.fullscreenTitle': 'Toggle fullscreen for the whole game',

  // Admin / debug
  'admin.resetProgress': 'Reset progress',
  'admin.resetProgressTitle': 'Erase all progress',
  'admin.treeEditor': 'Tree editor',
  'admin.treeEditorTitle': 'Drag upgrades to reposition, click cost to edit',
  'admin.statsUI': 'Stats UI',
  'admin.statsUITitle': 'Show run performance stats and write the latest run log',
  'admin.addHoney': '+100k 🍯',
  'admin.addHoneyTitle': 'Add 100k honey for testing',
  'admin.zeroHoney': 'Reset 🍯 to 0',
  'admin.zeroHoneyTitle': 'Set honey to 0',
  'admin.applyLayout': '💾 Apply layout',
  'admin.applyLayoutTitle': 'Save tree layout changes permanently',
  'admin.exportCode': '📋 Export code',
  'admin.exportCodeTitle': 'Copy positions to clipboard for pasting into code',
  'admin.resetTreeLayout': 'Reset tree layout',
  'admin.resetTreeLayoutTitle': 'Wipe locally edited tree positions and reload',
  'admin.honeyPerRun': 'Honey per run',
  'admin.damagePerRun': 'Damage per run',
  'admin.clear': 'Clear',
  'admin.clearRunHistory': 'Clear run history',
  'admin.cursor': 'Cursor',
  'admin.workerBees': 'Worker bees',
  'admin.savedTestStates': 'Saved test states',
  'admin.newSlot': 'Create new save slot from current state',
  'admin.saveSlot': 'Overwrite selected slot with current state',
  'admin.loadSlot': 'Load selected slot',
  'admin.delSlot': 'Delete selected slot',

  // Run summary
  'summary.runComplete': 'Run complete!',
  'summary.honeyCollected': 'honey collected',
  'summary.continue': 'Continue',

  // Run summary
  'summary.bonus': 'Bonus',
  'summary.colType': 'Type',
  'summary.colPollinated': 'Pollinated',
  'summary.colNectar': 'Nectar',
  'summary.colSource': 'Source',
  'summary.colDamage': 'Damage',
  'summary.combBonus': 'Comb bonus',
  'summary.ringBonus': 'Ring bonus',
  'summary.combo': 'Combo',
  'summary.ringTimeBonus': 'Ring time bonus',
  'summary.ringTimeBonusTitle': 'Extra run time from the Ring Time upgrade',
  'summary.newHighScore': 'New high score!',
  'summary.newHighScoreTitle': 'New high score!',

  // Flower types (run summary)
  'flower.small': 'Pink Clover',
  'flower.big': 'Black-Eyed Susan',
  'flower.sunflower': 'Giant Flowers',
  'flower.golden': 'Golden',
  'flower.flying': 'Drifters',
  'flower.daisy': 'Oxeye Daisy',

  // Jar tiers
  'jar.sample': 'Sample Jar',
  'jar.small': 'Small Jar',
  'jar.honey': 'Honey Jar',
  'jar.big': 'Big Pot',
  'jar.royal': 'Royal Jar',
  'jar.golden': 'Golden Chalice',
  'jar.titan': 'Titan Vault',

  // Damage sources
  'dmg.normal': 'Normal hits',
  'dmg.crit': 'Crits',
  'dmg.workerBee': 'Worker bees',
  'dmg.aftershock': 'Aftershocks',
  'dmg.dashBee': 'Stingers',
  'dmg.combAbsorb': 'Comb absorb',

  // Save slots screen / picker
  'saveSlots.empty': 'Empty',
  'saveSlots.newGame': 'New Game',
  'saveSlots.load': 'Load',
  'saveSlots.delete': 'Delete',
  'saveSlots.confirmDelete': 'Click again to confirm',
  'saveSlots.lastPlayed': 'Last played: {when}',
  'saveSlots.activeMarker': ' • active',
  'saveSlots.activeParen': ' (active)',
  'saveSlots.noSaves': '(no saves)',
  'saveSlots.justNow': 'Just now',
  'saveSlots.minutesAgo': '{n}m ago',
  'saveSlots.hoursAgo': '{n}h ago',
  'saveSlots.daysAgo': '{n}d ago',

  // Intro play button
  'menu.continue': 'Continue',
  'menu.chooseSave': 'Choose Save',

  // Skill tree tooltip
  'tooltip.comingSoon': 'Coming soon…',
  'tooltip.purchased': '✓ Purchased',
  'tooltip.lockedNeighbor': '🔒 Buy a connected upgrade first',
  'tooltip.descUnknown': '???',
  'tooltip.cost': '🍯 {cost}',

  // Run / HUD overlays
  'run.tornadoTimer': 'Tornado in {seconds}s',
  'run.tornadoActive': 'Tornado!',
  'run.combo': 'Combo x{n}',

  // Ending
  'ending.brandTag': 'a game by',
  'ending.brandName': 'GAMING IS DEAD',
  'ending.thanksTitle': 'Thank you for playing!',
  'ending.thanksBody': "You've reached the end of this prototype. Yummy Yummy Honey is part of a bigger thing in the works — wishlisting on Steam is the single biggest way you can help it happen.",
  'ending.keepPlaying': 'Keep playing',
});
