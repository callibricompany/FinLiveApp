// API/TMDBApi.js
import axios from 'axios'
const API_TOKEN_FAKEJSON = "9kWuAz8WSP2ClCzzmsFJjg";
const URL_FAKE_JSON ="";
const URL_AWS = "http://99.80.186.219:8080/"

export function getFilmsFromApiWithSearchedText (text) {
  const url = 'http://34.245.143.173:8080'
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))
}

export function getOpenTickets () {
    let payload = {
    token: API_TOKEN_FAKEJSON,
    data: {
      name: "nameFirst",
      email: "internetEmail",
      phone: "phoneHome",
      avatar: "personAvatar",
      resume: "stringShort",
      header: "numberInt|0,1",
      date: "date",
      _repeat: 2
    }
  };


  return axios({
  method: "post",
  url: "https://app.fakejson.com/q",
  data: payload
  }).then(resp => {
  // Do something with fake data
    return resp.data;
  })
  .catch((error) => console.error(error))
  

  /*const url = 'https://app.fakejson.com/q'
  var details = {
    token: "9kWuAz8WSP2ClCzzmsFJjg",
    data: {
      name: "nameFirst",
      email: "internetEmail",
      phone: "phoneHome",
      _repeat: 3
    }
  };
  
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  //console.log(formBody)
  fetch(url, {
    method: 'POST',
    headers: {
      //'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      'Content-Type': 'application/json'
    },
    body: formBody
  })
  .then((response) => {
    console.log('Reponse POST : ' + JSON.stringify(response));
      }
    )
  .catch((error) => {
      console.error('Erreur requete POST : ' + error);
    }
  );*/
}


export function ssCreateUser (uid, email, name, firstName, phone, independant, company, organization) {
  let userIdentity = {
    email: email,
    name : name, 
    firstName : firstName,
    phone : phone,
    independant : independant,
    company : company,
    organization : organization,
    supervisor: false,
    validated: false,
    idToken : uid
  };

  console.log("APPELLE AXIOS");
  return axios.post(URL_AWS + '/createuser', userIdentity)
  .then(function (response) {
    console.log(response.data);

    //res.render('pages/register',{email: email, isConnected: isConnected});
  })
  .catch(function (error) {
    console.log(error);
  });

}


