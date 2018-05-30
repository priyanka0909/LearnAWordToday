using LanguageLearner.Interfaces;
using LanguageLearner.Models;
using LanguageLearner.Services;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using LanguageLearner.Utilities;
using System.IO;
using System.Threading;
using System.Media;

namespace LanguageLearner.Controllers
{
    [RoutePrefix("api/Search")]
    public class SearchController : ApiController
    {
        ISearchService searchService;
        ITokenService tokenService;

        [HttpGet]
        [Route("DefinitionSearch/{SearchWord}")]
        public HttpResponseMessage DefinitionSearch(string SearchWord)
        {
            searchService = new SearchService();
            var result = searchService.GetMeanings(SearchWord);
            if (result != null)
            {
                var response = Request.CreateResponse(HttpStatusCode.OK, result);
                return response;
            }
            else
            {
                var response = Request.CreateResponse(HttpStatusCode.BadRequest);
                return response;
            }
        }

        [HttpGet]
        [Route("BingCustomSearch/{SearchWord}")]
        public HttpResponseMessage BingCustomSearch(string SearchWord)
        {
            searchService = new SearchService();
            var result = searchService.GetSentences(SearchWord);
            if (result != null)
            {
                var response = Request.CreateResponse(HttpStatusCode.OK, result);
                return response;
            }
            else
            {
                var response = Request.CreateResponse(HttpStatusCode.BadRequest);
                return response;
            }    
        }

        [HttpPost]
        [Route("TextToSpeech")]
        public HttpResponseMessage TextToSpeech(TTSpeech obj)
        {
            tokenService = new TokenService();

            try
            {
                string requestUri = "https://speech.platform.bing.com/synthesize";
                string accessToken = tokenService.GetToken();

                var cortana = new Synthesize();
                string name = cortana.VoiceServiceName(obj.Locale);
                cortana.OnAudioAvailable += PlayAudio;

                cortana.Speak(CancellationToken.None, new Synthesize.InputOptions()
                {
                    RequestUri = new Uri(requestUri),
                    Text = obj.OutputText,
                    Locale = obj.Locale,
                    //VoiceName =cortana.VoiceServiceName(speechObj.Locale),
                    VoiceName = name,
                    OutputFormat = AudioOutputFormat.Riff24Khz16BitMonoPcm,
                    AuthorizationToken = "Bearer " + accessToken,
                }).Wait();

                var response = Request.CreateResponse(HttpStatusCode.OK);
                return response;

            }
            catch(Exception ex)
            {
                var response = Request.CreateResponse(HttpStatusCode.BadRequest);
                return response;
            }

            
        }

        private void PlayAudio(object sender, GenericEventArgs<Stream> args)
        {
            // For SoundPlayer to be able to play the wav file, it has to be encoded in PCM.
            // Use output audio format AudioOutputFormat.Riff16Khz16BitMonoPcm to do that.
            SoundPlayer player = new SoundPlayer(args.EventData);
            player.PlaySync();
        }

    }


}
