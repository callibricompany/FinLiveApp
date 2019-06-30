// API/TMDBApi.js
import axios from 'axios'
const API_TOKEN_FAKEJSON = "9kWuAz8WSP2ClCzzmsFJjg";
const URL_FAKE_JSON ="";
const URL_AWS = "http://99.80.211.255:8080"

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


export function ssCreateUser (idToken, email, name, firstName, phone, independant, company, organization) {
  let userIdentity = {
    email: email,
    name : name, 
    firstname : firstName,
    phone : phone,
    independant : independant,
    company : company,
    organization : organization,
    //idToken : uid
  };

  var axiosConfig = {
    headers :{
      //'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json',
      'bearer' : idToken
    }
  };


  console.log("APPELLE AXIOS");
  return new Promise(
    (resolve, reject) => {
      axios.post(URL_AWS + '/createUser', userIdentity, axiosConfig)
      .then((response) => {
        console.log("Succes : " + response);
        resolve(response)
        //res.render('pages/register',{email: email, isConnected: isConnected});
      })
      .catch(function (error) {
        console.log("Erreur requete aws : " + error);
        reject(error)
      });
    });
  }

export function ssCreateStructuredProduct (idToken, product) {

  var FormData = require('form-data');
  var form = new FormData();

  Object.keys(product).forEach(key => {
    //console.log(key + "   -   " + product[key]);
    form.append(key, product[key]);
  });


  //console.log(product);
  //console.log("BOUNDARY : "+form._boundary);
  //var filesuploaded = req.files;
  /*console.log(req.files);

  if ( filesuploaded.length > 0 ) {
      for (var i = 0; i < filesuploaded.length; i++) {
          formData.append('fileinput', fs.createReadStream(filesuploaded[i].path),filesuploaded[i].originalname);
          // formData.append('fileinput', filesuploaded[i].buffer, { filename : filesuploaded[i].originalname });
        }
  }*/
  

  var axiosConfig = {
    headers :{
      //'Content-Type': 'application/x-www-form-urlencoded',
      //'Content-Type': 'application/json; charset=utf-8',
      'Content-Type' : `multipart/form-data; boundary=${form._boundary}`,
      //'Accept'      : 'application/json',
      'bearer'      : idToken,
      'type'        : 'Produit structuré'
    }
  };


  return new Promise(
    (resolve, reject) => {
      axios.post(URL_AWS + '/createTicket', form, axiosConfig)
      .then((response) => {
        console.log("Succes : " + response);
        resolve(response)
        //res.render('pages/register',{email: email, isConnected: isConnected});
      })
      .catch(function (error) {
        console.log("Erreur requete aws : " + error);
        reject(error)
      });
    });
  }

export function getUserAllInfo (idToken) {
  var axiosConfig = {
    headers :{
      //'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/json; charset=utf-8',
      'Accept'      : 'application/json',
      'bearer'      : idToken
    }
  };

  return new Promise(
    (resolve, reject) => {
      axios.get(URL_AWS + '/getUserAllInfo', axiosConfig)
      .then((response) => {
        console.log("Succes : " + response);
        resolve(response)
        //res.render('pages/register',{email: email, isConnected: isConnected});
      })
      .catch(function (error) {
        console.log("Erreur requete aws : " + error);
        reject(error)
      });
    });
}
  


