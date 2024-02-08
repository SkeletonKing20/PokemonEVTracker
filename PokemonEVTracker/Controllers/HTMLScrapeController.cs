using System.Globalization;
using System.Text;
using HtmlAgilityPack;
using PokemonEVTracker.Models;

namespace PokemonEVTracker.Controllers;

public class HTMLScrapeController
{
    private static readonly string uri = "https://pokemondb.net/pokedex/all";
    private static readonly string uriEV = "https://pokemondb.net/ev/all";
    public List<PokemonModel> ScrapePokemon()
    {
        var web = new HtmlWeb();
        var doc = web.Load(uri);

        List<PokemonModel> pokemon = new List<PokemonModel>();
        var nodes =
            doc.DocumentNode.SelectNodes("//tbody/tr").ToList();

        var evNodes = ScrapeEffortValues();
        var count = 0;
        foreach (var currentNode in nodes)
        {
            count = GetNextPokemon(currentNode, count, ref pokemon, evNodes);
        }
        
        return pokemon;
    }

    public void JSONExport(List<PokemonModel> pokemon)
    {
        var jsonContent = new StringBuilder();
            jsonContent.Append("{\"pokemon\":[");
            for (var index = 0; index < pokemon.Count; index++)
            {
                var p = pokemon[index];
                jsonContent.Append("{\"PokedexNumber\":\"");
                jsonContent.Append(p.DexNumber);
                jsonContent.Append("\",\"Name\":\"");
                jsonContent.Append(p.Name);
                jsonContent.Append("\",\"BaseHP\":");
                jsonContent.Append(p.BaseStats.HP);
                jsonContent.Append(",\"BaseATK\":");
                jsonContent.Append(p.BaseStats.ATK);
                jsonContent.Append(",\"BaseDEF\":");
                jsonContent.Append(p.BaseStats.DEF);
                jsonContent.Append(",\"BaseSP_ATK\":");
                jsonContent.Append(p.BaseStats.SP_ATK);
                jsonContent.Append(",\"BaseSP_DEF\":");
                jsonContent.Append(p.BaseStats.SP_DEF);
                jsonContent.Append(",\"BaseSPEED\":");
                jsonContent.Append(p.BaseStats.SPEED);
                jsonContent.Append(",\"EVsGained\":{\"HP\":");
                jsonContent.Append(p.EVsGained.HP);
                jsonContent.Append(",\"ATK\":");
                jsonContent.Append(p.EVsGained.ATK);
                jsonContent.Append(",\"DEF\":");
                jsonContent.Append(p.EVsGained.DEF);
                jsonContent.Append(",\"SP_ATK\":");
                jsonContent.Append(p.EVsGained.SP_ATK);
                jsonContent.Append(",\"SP_DEF\":");
                jsonContent.Append(p.EVsGained.SP_DEF);
                jsonContent.Append(",\"SPEED\":");
                jsonContent.Append(p.EVsGained.SPEED);
                jsonContent.Append("}}");
                if (index != pokemon.Count - 1)
                {
                    jsonContent.Append(',');
                }
            }

            jsonContent.Append("]}");
            string jsonString = jsonContent.ToString().ReplaceLineEndings("").Replace("\t", "");
            File.WriteAllText(@"E:\Desktop\PokemonEVTracker\PokemonEVTracker\pokedex.json",jsonString);
    }
    
    
    private int GetNextPokemon(HtmlNode currentPokInd, int currentEVInd, ref List<PokemonModel> pokemon, List<string> stringNodes)
    {
        var nodes = currentPokInd.SelectNodes("td").ToList();
        var p = new PokemonModel
        {
            DexNumber = nodes[0].SelectSingleNode("./*[@class='infocard-cell-data']").InnerText,
            Name = (nodes[1].SelectSingleNode("./*[@class='ent-name']").InnerText) + (nodes[1].SelectSingleNode("small[@class='text-muted']") == null ? "" : $"({nodes[1].SelectSingleNode("small[@class='text-muted']").InnerText})"),
        };
        p.Url = $"https://pokemondb.net/pokedex/{nodes[1].SelectSingleNode("./*[@class='ent-name']").InnerText}";

        var types = nodes[2].SelectNodes("./a").ToList();
        
        for (int i = 0; i < types.Count; i++)
        {
            Enum.TryParse(types[i].InnerText.ToUpper(), out p.Typing[i]);
        }
        
        int.TryParse(nodes[4].InnerText, out var hp);
        p.BaseStats.HP = hp;
        
        int.TryParse(nodes[5].InnerText, out var atk);
        p.BaseStats.ATK = atk;
        
        int.TryParse(nodes[6].InnerText, out var def);
        p.BaseStats.DEF = def;
        
        int.TryParse(nodes[7].InnerText, out var spAtk);
        p.BaseStats.SP_ATK = spAtk;
        
        int.TryParse(nodes[8].InnerText, out var spDef);
        p.BaseStats.SP_DEF = spDef;
        
        int.TryParse(nodes[9].InnerText, out var speed);
        p.BaseStats.SPEED = speed;

        p.Icon = nodes[0].SelectSingleNode("./picture/img").GetAttributeValue("src", "");
        Console.WriteLine(p.Icon);
        
        int.TryParse(stringNodes[currentEVInd], out hp);
        p.EVsGained.HP = hp;
        
        int.TryParse(stringNodes[currentEVInd + 1], out atk);
        p.EVsGained.ATK = atk;
        
        int.TryParse(stringNodes[currentEVInd + 2], out def);
        p.EVsGained.DEF = def;
        
        int.TryParse(stringNodes[currentEVInd + 3], out spAtk);
        p.EVsGained.SP_ATK = spAtk;
        
        int.TryParse(stringNodes[currentEVInd + 4], out spDef);
        p.EVsGained.SP_DEF = spDef;
        
        int.TryParse(stringNodes[currentEVInd + 5], out speed);
        p.EVsGained.SPEED = speed;
        
        pokemon.Add(p);
        
        return currentEVInd + 6;
    }

    private List<string> ScrapeEffortValues()
    {
        var web = new HtmlWeb();
        var doc = web.Load(uriEV);

        var htmlNodes = doc.DocumentNode.SelectNodes("//tbody/tr/td").Where(n => n.HasClass("text-center")).ToList();

        var stringNodes = new List<string>();


        foreach (var node in htmlNodes)
        {
            stringNodes.Add(string.IsNullOrEmpty(node.InnerText) ? "0" : node.InnerText);
        }
        return stringNodes;
    }
}