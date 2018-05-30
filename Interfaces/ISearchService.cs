using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LanguageLearner.Interfaces
{
    public interface ISearchService
    {
        List<string> GetMeanings(string SearchWord);
        List<string> GetSentences(string SearchWord);
    }
}
