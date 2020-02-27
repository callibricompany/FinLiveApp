
import axios from 'axios'


const API_IP = 'https://api.ipify.org?format=json'


// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them

export function getAPIIP () {
    
    return new Promise(
        (resolve, reject) => {
            axios.get(API_IP, { timeout: 10000})
            .then(response => {
              console.log(response.data.ip);
              resolve(response.data.ip);
            })
            .catch(error => {
              alert('Vérifiez votre connexion internet')
              console.log(error);
              reject(error);
            });
        });
    
}