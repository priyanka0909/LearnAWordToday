using System;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Newtonsoft.Json;
using System.Net.Http;
using System.Web.Http;
using LanguageLearner.Interfaces;
using LanguageLearner.Services;

namespace LanguageLearner
{

    [RoutePrefix("api/DocumentDB")]
    public class DocumentDBController : ApiController
    {
        IDocumentService documentService;

        [HttpGet]
        [Route("GetDocDBData/{key}")]
        public HttpResponseMessage GetDocDBData(string key)
        {
            documentService = new DocumentDBService();
            var result = documentService.GetDataFromDocDB(key);
            if (string.IsNullOrEmpty(result))
            {
                var response = Request.CreateResponse(HttpStatusCode.BadRequest);
                return response;
            }
            else
            {
                var response = Request.CreateResponse(HttpStatusCode.OK, result);
                return response;
            }
        }

    }
}