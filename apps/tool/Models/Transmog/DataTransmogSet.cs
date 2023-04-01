﻿namespace Wowthing.Tool.Models.Transmog;

public class DataTransmogSet
{
    public int? AchievementId { get; set; }
    public int? WowheadSetId { get; set; }
    public string Name { get; set; } = string.Empty;
    public Dictionary<string, string>? Items { get; set; }
}
