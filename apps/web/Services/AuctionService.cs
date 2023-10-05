﻿using Microsoft.Extensions.Caching.Memory;
using StackExchange.Redis;
using Wowthing.Lib.Contexts;
using Wowthing.Lib.Enums;
using Wowthing.Lib.Models;
using Wowthing.Lib.Models.Player;
using Wowthing.Lib.Models.Query;
using Wowthing.Lib.Models.Wow;
using Wowthing.Lib.Services;
using Wowthing.Lib.Utilities;
using Wowthing.Web.Models;

namespace Wowthing.Web.Services;

public class AuctionService
{
    private readonly CacheService _cacheService;
    private readonly IConnectionMultiplexer _redis;
    private readonly MemoryCacheService _memoryCacheService;
    private readonly WowDbContext _context;

    public AuctionService(
        CacheService cacheService,
        IConnectionMultiplexer redis,
        MemoryCacheService memoryCacheService,
        WowDbContext context
    )
    {
        _cacheService = cacheService;
        _context = context;
        _memoryCacheService = memoryCacheService;
        _redis = redis;
    }

    public async Task<List<AuctionBrowseQuery>> Browse(WowRegion region, int inventoryType, int itemClass, int itemSubclass)
    {
        var connectedRealmIds = await _context.WowRealm
            .Where(realm => realm.Region == region)
            .Select(realm => realm.ConnectedRealmId)
            .Distinct()
            .ToListAsync();

        // Commodities
        connectedRealmIds.Add(100000 + (int)region);

        short classId = (short)(itemClass & 0x7FFF);
        short subClassId = (short)(itemSubclass & 0x7FFF);

        var (itemClassMap, itemSubclassMap) = await _memoryCacheService.GetItemClasses();

        var itemQuery = _context.WowItem.AsQueryable();
        if (inventoryType > 0)
        {
            itemQuery = itemQuery.Where(item => item.InventoryType == (WowInventoryType)inventoryType);
        }
        if (itemClass > 0)
        {
            itemQuery = itemQuery.Where(item => item.ClassId == itemClassMap[classId].ClassId);
        }
        if (itemSubclass > 0)
        {
            itemQuery = itemQuery.Where(item => item.SubclassId == itemSubclassMap[subClassId].SubclassId);
        }

        int[] itemIds = await itemQuery
            .Select(item => item.Id)
            .Distinct()
            .ToArrayAsync();

        var auctions = await _context.AuctionBrowseQuery
            .FromSqlRaw(AuctionBrowseQuery.Sql, connectedRealmIds, itemIds)
            .ToListAsync();

        return auctions;
    }

    public async Task<WowAuction[]> Specific(WowRegion region, string appearanceSource, int itemId, int petSpeciesId)
    {
        var connectedRealmIds = await _context.WowRealm
            .Where(realm => realm.Region == region)
            .Select(realm => realm.ConnectedRealmId)
            .Distinct()
            .ToListAsync();

        // Commodities
        connectedRealmIds.Add(100000 + (int)region);

        var auctionQuery = _context.WowAuction
            .Where(auction => connectedRealmIds.Contains(auction.ConnectedRealmId));

        if (!string.IsNullOrEmpty(appearanceSource))
        {
            auctionQuery = auctionQuery.Where(auction => auction.AppearanceSource == appearanceSource);
        }
        else if (itemId > 0)
        {
            auctionQuery = auctionQuery.Where(auction => auction.ItemId == itemId);
        }
        else if (petSpeciesId > 0)
        {
            auctionQuery = auctionQuery.Where(auction => auction.PetSpeciesId == petSpeciesId);
        }

        var auctions = await auctionQuery
            .OrderBy(auction => auction.BuyoutPrice)
            .ToArrayAsync();

        return auctions;
    }

    public async Task<UserAuctionData> ExtraPetDataForUser(ApplicationUser user, JankTimer timer = null)
    {
        var data = new UserAuctionData();
        var allPets = new Dictionary<long, PlayerAccountPetsPet>();

        var accounts = await _context.PlayerAccount
            .AsNoTracking()
            .Where(pa => pa.UserId == user.Id && pa.Enabled)
            .Include(pa => pa.Pets)
            .ToArrayAsync();

        int[] accountIds = accounts.SelectArray(account => account.Id);

        var accountPets = accounts
            .Where(pa => pa.Pets != null)
            .Select(pa => pa.Pets)
            .OrderByDescending(pap => pap.UpdatedAt)
            .ToArray();

        foreach (var pets in accountPets)
        {
            foreach (var (petId, pet) in pets.Pets)
            {
                allPets.TryAdd(petId, pet);
            }
        }

        timer?.AddPoint("Accounts");

        // Pet itemId -> id map
        var petItemIdMap = await _memoryCacheService.GetItemIdToPetId();
        int[] petItemIds = petItemIdMap.Keys.ToArray();

        // Caged pets
        var guildCages = await _context.PlayerGuildItem
            .AsNoTracking()
            .Where(pgi =>
                pgi.Guild.UserId == user.Id &&
                pgi.ItemId == 82800 && // Pet Cage
                pgi.Context > 0
            )
            .ToArrayAsync();

        var playerCages = await _context.PlayerCharacterItem
            .AsNoTracking()
            .Where(pci =>
                    pci.Character.AccountId.HasValue &&
                    accountIds.Contains(pci.Character.AccountId.Value) &&
                    pci.ItemId == 82800 // Pet Cage
            )
            .ToArrayAsync();

        // Learnable pets
        var guildLearnable = await _context.PlayerGuildItem
            .AsNoTracking()
            .Where(pgi =>
                pgi.Guild.UserId == user.Id &&
                petItemIds.Contains(pgi.ItemId)
            )
            .ToArrayAsync();

        var playerLearnable = await _context.PlayerCharacterItem
            .AsNoTracking()
            .Where(pci =>
                pci.Character.AccountId.HasValue &&
                accountIds.Contains(pci.Character.AccountId.Value) &&
                petItemIds.Contains(pci.ItemId)
            )
            .ToArrayAsync();

        int[] accountConnectedRealmIds = await GetConnectedRealmIds(user, accounts);

        timer?.AddPoint("Pets");

        var groupedPets = allPets.Values
            .GroupBy(pet => pet.SpeciesId)
            .ToDictionary(
                group => (short)group.Key,
                group => group
                    .Select(pet => new UserAuctionDataPet(pet))
                    .ToList()
            );

        foreach (var cagedPet in guildCages)
        {
            groupedPets.GetOrNew(cagedPet.Context).Add(new UserAuctionDataPet(cagedPet, true));
        }

        foreach (var cagedPet in playerCages)
        {
            groupedPets.GetOrNew(cagedPet.Context).Add(new UserAuctionDataPet(cagedPet, true));
        }

        foreach (var learnablePet in guildLearnable)
        {
            short speciesId = (short)petItemIdMap[learnablePet.ItemId];
            groupedPets.GetOrNew(speciesId).Add(new UserAuctionDataPet(learnablePet));
        }

        foreach (var learnablePet in playerLearnable)
        {
            short speciesId = (short)petItemIdMap[learnablePet.ItemId];
            groupedPets.GetOrNew(speciesId).Add(new UserAuctionDataPet(learnablePet));
        }

        data.Pets = groupedPets
            .Where(kvp => kvp.Value.Count > 1)
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value
                    .OrderBy(pet => pet.Quality)
                    .ThenBy(pet => pet.Level)
                    .ToArray()
            );

        timer?.AddPoint("Group");

        short[] extraSpeciesIds = data.Pets.Keys.ToArray();

        long minimumValue = (user.Settings.Auctions?.MinimumExtraPetsValue ?? 0) * 10000;
        var auctions = await _context.WowAuction
            .AsNoTracking()
            .Where(auction =>
                accountConnectedRealmIds.Contains(auction.ConnectedRealmId) &&
                extraSpeciesIds.Contains(auction.PetSpeciesId) &&
                auction.BuyoutPrice >= minimumValue
            )
            .ToArrayAsync();

        timer?.AddPoint("Auctions");

        data.RawAuctions = ProcessAuctions(auctions.GroupBy(auction => (int)auction.PetSpeciesId), false);

        timer?.AddPoint("Process");

        return data;
    }

    private async Task<int[]> GetConnectedRealmIds(ApplicationUser user, PlayerAccount[] accounts)
    {
        var accountIds = accounts.SelectArray(account => account.Id);
        var ignoredRealms = user.Settings.Auctions?.IgnoredRealms.EmptyIfNull();

        var accountConnectedRealmIds = await _context.WowRealm
            .AsNoTracking()
            .Where(realm =>
                _context.PlayerCharacter
                    .Where(pc => pc.AccountId != null && accountIds.Contains(pc.AccountId.Value))
                    .Select(pc => pc.RealmId)
                    .Contains(realm.Id) &&
                !ignoredRealms.Contains(realm.ConnectedRealmId)
            )
            .Select(realm => realm.ConnectedRealmId)
            .Distinct()
            .ToArrayAsync();

        return accountConnectedRealmIds;
    }

    private static Dictionary<int, List<WowAuction>> ProcessAuctions(
        IEnumerable<IGrouping<int, WowAuction>> groupedAuctions,
        bool includeLowBid = true
    )
    {
        var groupedThings = groupedAuctions
            .ToDictionary(
                group => group.Key,
                group => group
                    .ToGroupedDictionary(auction => auction.ConnectedRealmId)
            );

        var ret = new Dictionary<int, List<WowAuction>>();
        foreach (var (thingId, itemRealms) in groupedThings)
        {
            ret[thingId] = new List<WowAuction>();
            foreach (var (_, realmAuctions) in itemRealms)
            {
                var lowestBid = realmAuctions
                    .Where(auction => auction.BidPrice > 0)
                    .MinBy(auction => auction.BidPrice);
                var lowestBuyout = realmAuctions
                    .Where(auction => auction.BuyoutPrice > 0)
                    .MinBy(auction => auction.BuyoutPrice);

                if (lowestBid == null)
                {
                    ret[thingId].Add(lowestBuyout);
                }
                else if (lowestBuyout == null)
                {
                    ret[thingId].Add(lowestBid);
                }
                else if (lowestBid.AuctionId == lowestBuyout.AuctionId)
                {
                    ret[thingId].Add(lowestBid);
                }
                else
                {
                    if (includeLowBid && lowestBid.BidPrice < lowestBuyout.BuyoutPrice)
                    {
                        ret[thingId].Add(lowestBid);
                    }
                    ret[thingId].Add(lowestBuyout);
                }
            }

            if (includeLowBid)
            {
                ret[thingId].Sort((a, b) => a.UsefulPrice.CompareTo(b.UsefulPrice));
            }
            else
            {
                ret[thingId].Sort((a, b) => a.BuyoutPrice.CompareTo(b.BuyoutPrice));
            }
        }

        return ret;
    }
}