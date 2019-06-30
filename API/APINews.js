//import NewsAPI from 'newsapi'
import axios from 'axios'


const API_NEWS ="94e5cbc4590c47f485de387180dee952"

// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them

export function getNews (page = 1, searchText = '') {
    
    const urlTopHeadlines = 'https://newsapi.org/v2/top-headlines'
    const urlEveryThing = 'https://newsapi.org/v2/everything'
    const MAX_PAGES = 50;
    
    let paramTopHeadlines = {
      country: 'fr',
      //language: 'fr',
      category: 'business',
      page: page,
      //sources: 'les-echos',
      apiKey: API_NEWS
    };

    let paramEverything = {
      //country: 'fr',
      language: 'fr',
      page: page,
      q: searchText,
      sortBy: 'publishedAt',
      apiKey: API_NEWS
    };


    return axios.get(searchText.length === 0 ? urlTopHeadlines : urlEveryThing, {
        params: searchText.length === 0 ? paramTopHeadlines : paramEverything,
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

