using System;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;
using System.Configuration;
using LanguageLearner.Models;
using System.Collections.Generic;
using LanguageLearner.Interfaces;

namespace LanguageLearner.Services
{
    public class DocumentDBService: IDocumentService
    {
        public DocumentClient client;
        private string databaseId;
        private Uri databaseUri;
        private string databaseKey;
        private string collectionId;
        private Uri collectionUri;
        public DocumentDBService()
        {
            
            string endpointUrl = "https://azurecosmosdbhackathon.documents.azure.com:443/";
            databaseId = "LanguageLearner";
            collectionId = "LanguageCollection";
            databaseUri = UriFactory.CreateDatabaseUri(databaseId);
            collectionUri = UriFactory.CreateDocumentCollectionUri(databaseId, collectionId);
            databaseKey = "BYcHqqHe0KDCUqjrYQs8vwvwYWDGw9LN8NZT3AoLwG74d1praHD1kVMmwMs5QX4jFlcml14CNvSVMnrzz0plZQ ==";
            client = new DocumentClient(new Uri(endpointUrl), databaseKey);
        }

        public string GetDataFromDocDB(string key)
        {
            var feedOptions = new FeedOptions();
            string record = string.Empty;
            try { 
                    feedOptions.EnableCrossPartitionQuery = true;
                    var documentdata =client.CreateDocumentQuery<RecordEntity>(collectionUri, "SELECT * FROM c",feedOptions).AsEnumerable().ToList();
                    var recorddata=documentdata.Where(e => e.id == key).ToList();
                    if(recorddata.Count>0)
                    {
                        record = recorddata.FirstOrDefault().DocumentData;
                    }
                    return record;
            }

            catch(Exception ex)
            {
                return record;
            }

        }

    }
}