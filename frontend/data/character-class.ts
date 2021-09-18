import type {Dictionary} from '@/types'
import {CharacterClass} from '@/types'
import {ArmorType, WeaponType} from '@/types/enums'


export const classMap: Dictionary<CharacterClass> = {
    1: new CharacterClass(
        1,
        'Warrior',
        'class_warrior',
        [71, 72, 73],
        ArmorType.Plate,
        [
            WeaponType.OneHandedAxe,
            WeaponType.TwoHandedAxe,
            WeaponType.OneHandedMace,
            WeaponType.TwoHandedMace,
            WeaponType.OneHandedSword,
            WeaponType.TwoHandedSword,
            WeaponType.Dagger,
            WeaponType.Fist,
            WeaponType.Polearm,
            WeaponType.Stave,
            WeaponType.Bow,
            WeaponType.Crossbow,
            WeaponType.Gun,
            WeaponType.Thrown,
            WeaponType.Shield,
        ],
    ),
    2: new CharacterClass(
        2,
        'Paladin',
        'class_paladin',
        [65, 66, 70],
        ArmorType.Plate,
        [
            WeaponType.OneHandedAxe,
            WeaponType.TwoHandedAxe,
            WeaponType.OneHandedMace,
            WeaponType.TwoHandedMace,
            WeaponType.OneHandedSword,
            WeaponType.TwoHandedSword,
            WeaponType.Polearm,
            WeaponType.Shield,
        ],
    ),
    3: new CharacterClass(
        3,
        'Hunter',
        'class_hunter',
        [253, 254, 255],
        ArmorType.Mail,
        [
            WeaponType.OneHandedAxe,
            WeaponType.TwoHandedAxe,
            WeaponType.OneHandedSword,
            WeaponType.TwoHandedSword,
            WeaponType.Dagger,
            WeaponType.Fist,
            WeaponType.Bow,
            WeaponType.Crossbow,
            WeaponType.Gun,
        ],
    ),
    4: new CharacterClass(
        4,
        'Rogue',
        'class_rogue',
        [259, 260, 261],
        ArmorType.Leather,
        [
            WeaponType.OneHandedAxe,
            WeaponType.OneHandedMace,
            WeaponType.OneHandedSword,
            WeaponType.Dagger,
            WeaponType.DaggerAgility,
            WeaponType.Fist,
            WeaponType.Bow,
            WeaponType.Crossbow,
            WeaponType.Gun,
            WeaponType.Thrown,
        ],
    ),
    5: new CharacterClass(
        5,
        'Priest',
        'class_priest',
        [256, 257, 258],
        ArmorType.Cloth,
        [
            WeaponType.OneHandedMace,
            WeaponType.Dagger,
            WeaponType.Stave,
            WeaponType.Wand,
        ],
    ),
    6: new CharacterClass(
        6,
        'Death Knight',
        'class_death_knight',
        [250, 251, 252],
        ArmorType.Plate,
        [
            WeaponType.OneHandedAxe,
            WeaponType.TwoHandedAxe,
            WeaponType.OneHandedMace,
            WeaponType.TwoHandedMace,
            WeaponType.OneHandedSword,
            WeaponType.TwoHandedSword,
            WeaponType.Polearm,
        ],
    ),
    7: new CharacterClass(
        7,
        'Shaman',
        'class_shaman',
        [262, 263, 264],
        ArmorType.Mail,
        [
            WeaponType.OneHandedAxe,
            WeaponType.TwoHandedAxe,
            WeaponType.OneHandedMace,
            WeaponType.TwoHandedMace,
            WeaponType.Dagger,
            WeaponType.Fist,
            WeaponType.Stave,
            WeaponType.Shield,
        ],
    ),
    8: new CharacterClass(
        8,
        'Mage',
        'class_mage',
        [62, 63, 64],
        ArmorType.Cloth,
        [
            WeaponType.OneHandedSword,
            WeaponType.Dagger,
            WeaponType.Stave,
            WeaponType.Wand,
        ],
    ),
    9: new CharacterClass(
        9,
        'Warlock',
        'class_warlock',
        [265, 266, 267],
        ArmorType.Cloth,
        [
            WeaponType.OneHandedSword,
            WeaponType.Dagger,
            WeaponType.Stave,
            WeaponType.Wand,
        ],
    ),
    10: new CharacterClass(
        10,
        'Monk',
        'class_monk',
        [268, 269, 270],
        ArmorType.Leather,
        [
            WeaponType.OneHandedAxe,
            WeaponType.OneHandedMace,
            WeaponType.OneHandedSword,
            WeaponType.Fist,
            WeaponType.Polearm,
            WeaponType.Stave,
        ],
    ),
    11: new CharacterClass(
        11,
        'Druid',
        'class_druid',
        [102, 103, 104, 105],
        ArmorType.Leather,
        [
            WeaponType.OneHandedMace,
            WeaponType.Dagger,
            WeaponType.Fist,
            WeaponType.Polearm,
            WeaponType.Stave,
        ],
    ),
    12: new CharacterClass(
        12,
        'Demon Hunter',
        'class_demon_hunter',
        [577, 581],
        ArmorType.Leather,
        [
            WeaponType.Fist,
            WeaponType.OneHandedAxe,
            WeaponType.OneHandedSword,
            WeaponType.Warglaive,
        ],
    ),
}
