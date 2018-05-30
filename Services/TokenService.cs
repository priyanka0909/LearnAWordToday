using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LanguageLearner.Interfaces;
using System.Net;
using System.IO;
using System.Text;

namespace LanguageLearner.Services
{
    public class TokenService :ITokenService
    {
        public string GetToken()
        {
            string accessUri = "https://api.cognitive.microsoft.com/sts/v1.0/issueToken";
            string apiKey = "518a3eeacd1343e3a55c8197e6af6cd7";
            WebRequest webRequest = WebRequest.Create(accessUri);
            webRequest.Method = "POST";
            webRequest.ContentLength = 0;
            webRequest.Headers["Ocp-Apim-Subscription-Key"] = apiKey;

            using (WebResponse webResponse = webRequest.GetResponse())
            {
                using (Stream stream = webResponse.GetResponseStream())
                {
                    using (MemoryStream ms = new MemoryStream())
                    {
                        byte[] waveBytes = null;
                        int count = 0;
                        do
                        {
                            byte[] buf = new byte[1024];
                            count = stream.Read(buf, 0, 1024);
                            ms.Write(buf, 0, count);
                        } while (stream.CanRead && count > 0);

                        waveBytes = ms.ToArray();

                        return Encoding.UTF8.GetString(waveBytes);
                    }
                }
            }
        }


    }
}