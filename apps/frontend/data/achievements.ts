export const addonAchievements: Record<number, boolean> = Object.fromEntries(
    [
        14765, // Ramparts Racer
        14766, // Parasoling
    ].map((id) => [id, true])
)

export const forceAddonCriteria: Record<number, number> = {
    9450: 9452, // The Trap Game -> Trap Superstar
    9565: 9452, // Master Trapper -> Trap Superstar
    9451: 9452, // Trapper's Delight -> Trap Superstar
    9452: 9452, // Trap Superstar -> Trap Superstar
}

export const forceSupersededBy: Record<number, number> = {
    5324: 5325, // In Service of the Horde -> Veteran of the Horde
    5327: 5328, // In Service of the Alliance -> Veteran of the Alliance
    13701: 13702, // Battlefield Brawler -> Battlefield Tactician
    13702: 13703, // Battlefield Tactician -> Battlefield Master
}

export const forceSupersedes: Record<number, number> = Object.fromEntries(
    Object.entries(forceSupersededBy)
        .map(([dest, src]) => [src, parseInt(dest)])
)

export const extraCategories: [string, [string, number, string?, string?][]][] = [
    ['classic', [
        ['exploration/eastern-kingdoms', 3, 'exploration-eastern-kingdoms', 'Exploration > Eastern Kingdoms'],
        ['exploration/kalimdor', 3, 'exploration-kalimdor', 'Exploration > Kalimdor'],
        ['quests/eastern-kingdoms', 3, 'quests-eastern-kingdoms', 'Quests > Eastern Kingdoms'],
        ['quests/kalimdor', 3, 'quests-kalimdor', 'Quests > Kalimdor'],
        ['reputation/classic', 1],
        null,
        ['dungeons-raids/classic', 3, 'dungeons-raids', 'Dungeons & Raids'],
    ]],
    ['the-burning-crusade', [
        ['exploration/outland', 1],
        ['quests/outland', 1],
        ['reputation/the-burning-crusade', 1],
        null,
        ['dungeons-raids/the-burning-crusade', 3, 'dungeons-raids', 'Dungeons & Raids'],
    ]],
    ['wrath-of-the-lich-king', [
        ['exploration/northrend', 1],
        ['quests/northrend', 1],
        ['reputation/wrath-of-the-lich-king', 1],
        null,
        ['dungeons-raids/lich-king-dungeon', 3, 'dungeons', 'Dungeons'],
        ['dungeons-raids/lich-king-raid', 3, 'raids', 'Raids'],
        null,
        ['expansion-features/argent-tournament', 2],
    ]],
    ['cataclysm', [
        ['exploration/cataclysm', 1],
        ['quests/cataclysm', 1],
        ['reputation/cataclysm', 1],
        null,
        ['dungeons-raids/cataclysm-dungeon', 3, 'dungeons', 'Dungeons'],
        ['dungeons-raids/cataclysm-raid', 3, 'raids', 'Raids'],
        null,
        ['expansion-features/tol-barad', 2],
    ]],
    ['pandaria', [
        ['exploration/pandaria', 1],
        ['quests/pandaria', 1],
        ['reputation/pandaria', 1],
        null,
        ['dungeons-raids/pandaria-dungeon', 3, 'dungeons', 'Dungeons'],
        ['dungeons-raids/pandaria-raid', 3, 'raids', 'Raids'],
        null,
        ['expansion-features/proving-grounds', 2],
        ['expansion-features/pandaria-scenarios', 3, 'scenarios', 'Scenarios'],
    ]],
    ['draenor', [
        ['exploration/draenor', 1],
        ['quests/draenor', 1],
        ['reputation/draenor', 1],
        null,
        ['dungeons-raids/draenor-dungeon', 3, 'dungeons', 'Dungeons'],
        ['dungeons-raids/draenor-raid', 3, 'raids', 'Raids'],
        null,
        ['expansion-features/draenor-garrison', 3, 'garrison', 'Garrison'],
    ]],
    ['legion', [
        ['exploration/legion', 1],
        ['quests/legion', 1],
        ['reputation/legion', 1],
        null,
        ['dungeons-raids/legion-dungeon', 3, 'dungeons', 'Dungeons'],
        ['dungeons-raids/legion-raid', 3, 'raids', 'Raids'],
        null,
        ['expansion-features/legion-class-hall', 3, 'class-hall', 'Class Hall'],
    ]],
    ['battle-for-azeroth', [
        ['exploration/battle-for-azeroth', 1],
        ['quests/battle-for-azeroth', 1],
        ['reputation/battle-for-azeroth', 1],
        null,
        ['dungeons-raids/battle-dungeon', 3, 'dungeons', 'Dungeons'],
        ['dungeons-raids/battle-raid', 3, 'raids', 'Raids'],
        null,
        ['expansion-features/heart-of-azeroth', 2],
        ['expansion-features/island-expeditions', 2],
        ['expansion-features/visions-of-nzoth', 2],
        ['expansion-features/war-effort', 2],
    ]],
    ['shadowlands', [
        ['exploration/shadowlands', 1],
        ['quests/shadowlands', 1],
        ['reputation/shadowlands', 1],
        null,
        ['dungeons-raids/shadowlands-dungeon', 3, 'dungeons', 'Dungeons'],
        ['dungeons-raids/shadowlands-raid', 3, 'raids', 'Raids'],
        null,
        ['expansion-features/covenant-sanctums', 2],
        ['expansion-features/torghast', 2],
    ]],
]
