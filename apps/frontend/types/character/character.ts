import { Constants } from '@/data/constants'
import type { Faction } from '@/enums'

import type { StaticDataRealm } from '@/types/data/static'
import type { Guild } from '@/types/guild'

import type { CharacterConfiguration } from './configuration'
import { CharacterCurrency, type CharacterCurrencyArray } from './currency'
import type { CharacterEquippedItem } from './equipped-item'
import type { CharacterGarrison } from './garrison'
import type { CharacterLockout } from './lockout'
import {
    CharacterMythicPlusAddonRun,
    type CharacterMythicPlus,
    type CharacterMythicPlusAddon,
    type CharacterMythicPlusAddonMap,
    type CharacterMythicPlusAddonRunArray
} from './mythic-plus'
import type { CharacterProfession } from './profession'
import type { CharacterRaiderIoSeason } from './raider-io-season'
import type { CharacterReputation, CharacterReputationParagon } from './reputation'
import type { CharacterShadowlands } from './shadowlands'
import type { CharacterSpecializationRaw } from './specialization'
import type { CharacterWeekly } from './weekly'


export class Character {
    // Calculated
    public className: string
    public raceName: string
    public specializationName: string

    public calculatedItemLevel: string
    public calculatedItemLevelQuality: number
    public guild: Guild
    public mythicPlusSeasonScores: Record<number, number>
    public realm: StaticDataRealm
    public reputationData: Record<string, CharacterReputation>

    public currencies: Record<number, CharacterCurrency> = {}
    public mythicPlusWeeks: Record<number, CharacterMythicPlusAddonRun[]> = {}
    public specializations: Record<number, Record<number, number>> = {}

    constructor(
        public id: number,
        public name: string,
        public isResting: number,
        public isWarMode: number,
        public accountId: number,
        public activeSpecId: number,
        public addonLevel: number,
        public addonLevelXp: number,
        public chromieTime: number,
        public classId: number,
        public equippedItemLevel: number,
        public faction: Faction,
        public gender: number,
        public guildId: number,
        public level: number,
        public playedTotal: number,
        public raceId: number,
        public realmId: number,
        public restedExperience: number,
        public gold: number,
        public currentLocation: string,
        public hearthLocation: string,
        public lastSeenAddon: number,

        public configuration: CharacterConfiguration,

        public auras: Record<number, number>,
        public bags: Record<number, number>,
        public currencyItems: Record<number, number>,
        public equippedItems: Record<number, CharacterEquippedItem>,
        public garrisons: Record<number, CharacterGarrison>,
        public garrisonTrees: Record<number, Record<number, number[]>>,
        public lockouts: Record<string, CharacterLockout>,
        public mythicPlus: CharacterMythicPlus,
        public mythicPlusAddon: Record<number, CharacterMythicPlusAddon>,
        public mythicPlusSeasons: Record<number, Record<number, CharacterMythicPlusAddonMap>>,
        public paragons: Record<number, CharacterReputationParagon>,
        public professions: Record<number, Record<number, CharacterProfession>>,
        public professionTraits: Record<number, Record<number, number>>,
        public progressItems: number[],
        public raiderIo: Record<number, CharacterRaiderIoSeason>,
        public reputations: Record<number, number>,
        public shadowlands: CharacterShadowlands,
        public weekly: CharacterWeekly,

        rawCurrencies: CharacterCurrencyArray[],
        rawMythicPlusWeeks: Record<number, CharacterMythicPlusAddonRunArray[]>,
        rawSpecializations: Record<number, CharacterSpecializationRaw>,
        rawStatistics: []
    )
    {
        for (const rawCurrency of (rawCurrencies || [])) {
            const obj = new CharacterCurrency(...rawCurrency)
            this.currencies[obj.id] = obj
        }

        for (const [week, runsArray] of Object.entries(rawMythicPlusWeeks || {})) {
            this.mythicPlusWeeks[parseInt(week)] = runsArray
                .map((runArray) => new CharacterMythicPlusAddonRun(...runArray))
        }

        for (const specializationId in rawSpecializations) {
            const specData: Record<number, number> = {}
            for (const [tierId, , spellId] of rawSpecializations[specializationId].talents) {
                specData[tierId] = spellId
            }
            this.specializations[specializationId] = specData
        }
    }

    get isMaxLevel(): boolean {
        return this.level === Constants.characterMaxLevel
    }

}
export type CharacterArray = ConstructorParameters<typeof Character>