//import NewsAPI from 'newsapi'
import axios from 'axios'


const API_NEWS ="94e5cbc4590c47f485de387180dee952"

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

