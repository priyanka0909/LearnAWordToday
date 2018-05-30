
using LanguageLearner.Interfaces;
using LanguageLearner.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace LanguageLearner.Services
{
    public class SearchService : ISearchService
    {
        string subscriptionKey;
        string customConfigId;
        List<string> unwantedSentences = new List<string>();   //{ "[", "]", "$", "<", ">", "..." }
        public SearchService()
        {
            subscriptionKey = "ae0fee8ee7e84a6aa7dd19bbdfbd40ab";
            customConfigId = "93210474";
            DocumentDBService db = new DocumentDBService();
            unwantedSentences = db.GetDataFromDocDB("RestrictedWords")?.Split(',').ToList();
        }

        public List<string> GetMeanings(string SearchWord)
        {
            List<string> Defs = new List<string>();
            var client = new HttpClient();
            try
            {
                var urlDef = "http://api.wordnik.com/v4/word.json/" + SearchWord + "/definitions?api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
                //Definitions
                var httpResponseMessageDef = client.GetAsync(urlDef).Result;
                var responseContentDef = httpResponseMessageDef.Content.ReadAsStringAsync().Result;
                dynamic respDef = JsonConvert.DeserializeObject(responseContentDef);
                if (((JContainer)respDef).HasValues && ((Newtonsoft.Json.Linq.JContainer)respDef).HasValues)
                {
                    var respdefcount = 0;
                    respdefcount = ((Newtonsoft.Json.Linq.JContainer)respDef).Count;
                    for (int i = 0; i < respdefcount; i++)
                    {
                        if (!hasUnwantedWords(((JValue)(respDef[i].text)).Value.ToString()))
                            Defs.Add(((respDef[i].text).ToString()).Replace("_", ""));
                    }

                }
                return Defs;
            }
            catch (Exception ex)
            {
                return Defs;
            }
        }

        public List<string> GetSentences(string SearchWord)
        {
            List<string> Uses = new List<string>();
            List<string> AllUses = new List<string>();

            //Wordnik
            var client = new HttpClient();
            var limit = 50;
            var urlW = "http://api.wordnik.com/v4/word.json/" + SearchWord + "/examples?includeDuplicates=false&useCanonical=false&skip=0&limit=" + limit + "&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
            try
            {
                var httpResponseMessageW = client.GetAsync(urlW).Result;
                var responseContentW = httpResponseMessageW.Content.ReadAsStringAsync().Result;
                dynamic resp = JsonConvert.DeserializeObject(responseContentW);
                if (((JContainer)resp).HasValues && ((Newtonsoft.Json.Linq.JContainer)resp.examples).HasValues)
                {
                    var respcount = 0;
                    respcount = ((Newtonsoft.Json.Linq.JContainer)resp.examples).Count;
                    for (int i = 0; i < respcount; i++)
                    {
                        if (!hasUnwantedWords(((JValue)(resp.examples[i].text)).Value.ToString()))
                            Uses.Add(((resp.examples[i].text).ToString()).Replace("_", ""));
                    }

                    AllUses.AddRange(Uses.Distinct().ToList());

                    //Bing API Call
                    client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
                    var url = "https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?" +
                "q=" + SearchWord + "&count=50&offset=0&" + "&customconfig=" + customConfigId;

                    var httpResponseMessage = client.GetAsync(url).Result;
                    var responseContent = httpResponseMessage.Content.ReadAsStringAsync().Result;
                    BingCustomSearchResponse response = JsonConvert.DeserializeObject<BingCustomSearchResponse>(responseContent);
                    List<string> names = new List<string>();
                    List<string> snippets = new List<string>();
                    for (int i = 0; i < response?.webPages?.value?.Count(); i++)
                    {
                        var webPage = response.webPages.value[i];
                        if (!hasUnwantedWords(webPage.snippet) && hasExpectedWord(webPage.snippet, SearchWord))
                        {
                            names.Add(webPage.name);
                            snippets.Add(webPage.snippet);
                        }
                    }

                    AllUses.AddRange(snippets.Distinct().ToList());

                    return AllUses;
                }
                else
                {
                    AllUses = GetBingSearchSentences(SearchWord);
                    return AllUses;
                }
            }
            catch (Exception ex)
            {
                AllUses = GetBingSearchSentences(SearchWord);
                return AllUses;
            }
        }

        public List<string> GetBingSearchSentences(string SearchWord)
        {
            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", subscriptionKey);
            var url = "https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?" +
                "q=" + SearchWord + "&count=50&offset=0&" + "&customconfig=" + customConfigId;

            var httpResponseMessage = client.GetAsync(url).Result;
            var responseContent = httpResponseMessage.Content.ReadAsStringAsync().Result;
            BingCustomSearchResponse response = JsonConvert.DeserializeObject<BingCustomSearchResponse>(responseContent);
            List<string> names = new List<string>();
            List<string> snippets = new List<string>();
            for (int i = 0; i < response?.webPages?.value?.Count(); i++)
            {
                var webPage = response.webPages.value[i];
                if (!hasUnwantedWords(webPage.snippet) && hasExpectedWord(webPage.snippet, SearchWord))
                {
                    names.Add(webPage.name);
                    snippets.Add(webPage.snippet);
                }
            }
            return snippets.Distinct().ToList();
        }

        public bool hasUnwantedWords(string sentence)
        {
            List<string> abc = unwantedSentences.Where(str => sentence.ToLower().Contains(str.ToLower())).ToList();
            return abc.Count > 0 ? true : false;
        }

        public bool hasExpectedWord(string sentence, string word)
        {
            return sentence.ToLower().Contains(word.ToLower());
        }
    }
}
