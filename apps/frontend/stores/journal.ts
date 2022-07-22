import { UserCount, WritableFancyStore } from '@/types'
import { JournalDataEncounter } from '@/types/data'
import getTransmogClassMask from '@/utils/get-transmog-class-mask'
import getFilteredItems from '@/utils/journal/get-filtered-items'
import type { JournalState } from '@/stores/local-storage'
import type { Settings } from '@/types'
import type { JournalData, UserTransmogData } from '@/types/data'
import type { StaticData } from '@/types/data/static'


export class JournalDataStore extends WritableFancyStore<JournalData> {
    get dataUrl(): string {
        return document
            .getElementById('app')
            ?.getAttribute('data-journal')
    }

    initialize(data: JournalData): void {
        // console.time('JournalDataStore.initialize')

        for (const tier of data.tiers.filter((tier) => tier !== null)) {
            for (const instance of tier.instances) {
                if (instance.encountersRaw !== null) {
                    instance.encounters = instance.encountersRaw
                        .map((encounterArray) => new JournalDataEncounter(...encounterArray))
                    instance.encountersRaw = null
                }
            }
        }

        // console.timeEnd('JournalDataStore.initialize')
    }

    setup(
        settingsData: Settings,
        journalData: JournalData,
        journalState: JournalState,
        staticData: StaticData,
        userTransmogData: UserTransmogData
    ): void {
        // console.time('JournalDataStore.setup')

        const classMask = getTransmogClassMask(settingsData)
        const masochist = settingsData.transmog.completionistMode
        const stats: Record<string, UserCount> = {}

        const overallStats = stats['OVERALL'] = new UserCount()
        const overallSeen: Record<string, boolean> = {}

        for (const tier of journalData.tiers.filter((tier) => tier !== null)) {
            const tierStats = stats[tier.slug] = new UserCount()
            const tierSeen: Record<string, boolean> = {}

            for (const instance of tier.instances) {
                const instanceKey = `${tier.slug}--${instance.slug}`
                const instanceStats = stats[instanceKey] = new UserCount()
                const instanceSeen: Record<string, boolean> = {}

                const instanceExpansion = staticData.instances[instance.id]?.expansion ?? 0

                for (const encounter of instance.encounters) {
                    const encounterKey = `${instanceKey}--${encounter.name}`
                    const encounterStats = stats[encounterKey] = new UserCount()
                    const encounterSeen: Record<string, boolean> = {}

                    if (!journalState.showTrash && encounter.name === 'Trash Drops') {
                        continue
                    }

                    for (const group of encounter.groups) {
                        const groupKey = `${encounterKey}--${group.name}`
                        const groupStats = stats[groupKey] = new UserCount()
                        const groupSeen: Record<string, boolean> = {}

                        group.filteredItems = getFilteredItems(
                            journalState,
                            userTransmogData,
                            group,
                            classMask,
                            instanceExpansion,
                            masochist
                        )
                        for (const item of group.filteredItems) {
                            for (const appearance of item.appearances) {
                                const appearanceKey = masochist ?
                                    `${item.id}_${appearance.modifierId}` :
                                    appearance.appearanceId.toString()

                                if (!overallSeen[appearanceKey]) {
                                    overallStats.total++
                                }
                                if (!tierSeen[appearanceKey]) {
                                    tierStats.total++
                                }
                                if (!instanceSeen[appearanceKey]) {
                                    instanceStats.total++
                                }
                                if (!encounterSeen[appearanceKey]) {
                                    encounterStats.total++
                                }
                                if (!groupSeen[appearanceKey]) {
                                    groupStats.total++
                                }

                                const userHas = masochist ?
                                    userTransmogData.sourceHas[appearanceKey] :
                                    userTransmogData.userHas[appearance.appearanceId]
                                if (userHas) {
                                    if (!overallSeen[appearanceKey]) {
                                        overallStats.have++
                                    }
                                    if (!tierSeen[appearanceKey]) {
                                        tierStats.have++
                                    }
                                    if (!instanceSeen[appearanceKey]) {
                                        instanceStats.have++
                                    }
                                    if (!encounterSeen[appearanceKey]) {
                                        encounterStats.have++
                                    }
                                    if (!groupSeen[appearanceKey]) {
                                        groupStats.have++
                                    }
                                }

                                overallSeen[appearanceKey] = true
                                tierSeen[appearanceKey] = true
                                instanceSeen[appearanceKey] = true
                                encounterSeen[appearanceKey] = true
                                groupSeen[appearanceKey] = true

                                for (const difficulty of appearance.difficulties) {
                                    const instanceDifficultyKey = `${instanceKey}--${difficulty}`
                                    const instanceDifficultyStats = stats[instanceDifficultyKey] ||= new UserCount()

                                    const encounterDifficultyKey = `${encounterKey}--${difficulty}`
                                    const encounterDifficultyStats = stats[encounterDifficultyKey] ||= new UserCount()

                                    const itemKey = `${appearanceKey}--${difficulty}`

                                    if (!instanceSeen[itemKey]) {
                                        instanceDifficultyStats.total++
                                        if (userHas) {
                                            instanceDifficultyStats.have++
                                        }
                                    }

                                    if (!encounterSeen[itemKey]) {
                                        encounterDifficultyStats.total++
                                        if (userHas) {
                                            encounterDifficultyStats.have++
                                        }
                                    }

                                    instanceSeen[itemKey] = true
                                    encounterSeen[itemKey] = true
                                }
                            }
                        }
                    }
                }
            }
        }

        // console.log(masochist, stats)

        this.update((state) => {
            state.data.stats = stats
            return state
        })

        // console.timeEnd('JournalDataStore.setup')
    }
}

export const journalStore = new JournalDataStore()
