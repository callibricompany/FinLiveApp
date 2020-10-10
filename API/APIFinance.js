//import NewsAPI from 'newsapi'
import axios from 'axios'


const API_QUANDL ="Ud9gKDbyb1F4PrWDGSd2"
const API_UNIBIT ="z_DAiCPk3Z33HAhKWSP7dKwi6wWNaRUA";
//world trading data
const API_WTD = "ZEq1EhCADmbB87NB3YnHTUQmhPYdAetJ2zOWkMvKchINeiNRnyQYuExgSFKn";
const API_ALPHAVANTAGE = "WZVI9B5ZBQZTQN4J";
//https://eodhistoricaldata.com/cp/settings
const API_EOD = "5cbccfc79c7102.17889450";
const API_IEX = "pk_3eac56d3358944e1961ee7aec905961f"; //N° account : 309c4f9f29bc261e080836e68229d439 

// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them

export function getNews (page = 1) {
    
    const url = 'https://newsapi.org/v2/top-headlines'
    const MAX_PAGES = 50;
    console.log(url);
    return axios.get(url, {
        params: {
            country: 'fr',
            category: 'business',
            page: page,
            //q: 'macron',
            //sources: 'les-echos',
            apiKey: API_NEWS
        },
        timeout: 10000
      })
      .then(response => {
        //console.log(response.data);
        return response.data.articles;
      })
      .catch(error => {
        alert('Vérifiez votre connexion internet')
        console.log(error);
        //return [];
      });
    
}

