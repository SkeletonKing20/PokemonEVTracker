using PokemonEVTracker.Controllers;

namespace PokemonEVTracker;

public static class Program
{
    public static void Main()
    {
        HTMLScrapeController scraper = new HTMLScrapeController();
        scraper.JSONExport(scraper.ScrapePokemon());
        
        
    }
}