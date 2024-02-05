using HtmlAgilityPack;

namespace PokemonEVTracker.Models;

public record PokemonModel
{
    public string Name { get; set; }
    public string DexNumber { get; set; }
    public StatModel BaseStats = new StatModel();
    public StatModel EVsGained = new StatModel();
    public StatModel CurrentEVs = new StatModel();
    public StatModel FinalStats = new StatModel();
    public PokemonType[] Typing = new PokemonType[2];
    public string Url { get; set; }
    public string Icon { get; set; }
}