// API/TMDBApi.js
import axios from 'axios';


const API_TOKEN_FAKEJSON = "9kWuAz8WSP2ClCzzmsFJjg";
const URL_FAKE_JSON ="";
export const URL_AWS = "http://99.80.211.255:8080"

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

///////////////////////////
//    USER
//    creation
///////////////////////////
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

///////////////////////////
//    USER
//    update
///////////////////////////
  export function updateUser (firebase, user) {
    
          return new Promise((resolve, reject) => {

            if (user.hasOwnProperty('user')) {
                    //console.log(user.user);

                    delete user.user['email'];
                    delete user.user['id'];
                    //console.log(user.user);


                    firebase.doGetIdToken()
                    .then(token => {

                        var axiosConfig = {
                          headers :{
                            //'Content-Type': 'application/x-www-form-urlencoded',
                            'Content-Type': 'application/json; charset=utf-8',
                            'Accept': 'application/json',
                            'bearer' : token
                          }
                        };

                        axios.put(URL_AWS + '/user', user.user, axiosConfig)
                        .then((response) => {
                          console.log("Succes update user : ");
                          console.log(response.data);
                          resolve(response)
                          //res.render('pages/register',{email: email, isConnected: isConnected});
                        })
                        .catch(function (error) {
                          console.log("Erreur update user : " + error);
                          reject(error)
                        });
                    })
                    .catch((error) => reject(error));
       
            }
            else {
              reject("User mal défini");
            }
        });
  }



///////////////////////////
//    USER
//    change l'avatar
///////////////////////////
  // Object {
  //   "cancelled": false,
  //   "height": 550,
  //   "type": "image",
  //   "uri": "file:///Users/Vincent%20Sudre/Library/Developer/CoreSimulator/Devices/1AF6FEFB-984B-4308-82D8-993209A53C50/data/Containers/Data/Application/627CB734-6003-4D66-A86A-B77B5960EFED/Library/Caches/ExponentExperienceData/%2540geodulaur%252FFinLiveApp/ImagePicker/14340E63-EE92-452A-A977-4A37CBF38989.jpg",
  //   "width": 826,
  // }
  export function changeAvatar (firebase, file, idFreshdesk) {
    
    return new Promise((resolve, reject) => {



              firebase.doGetIdToken()
              .then(token => {

                  const FormData = require('form-data');
                  var form_data = new FormData();

                  let filename = file.uri.split('\\').pop().split('/').pop();
                  let extension = filename.split('.').pop();

                  form_data.append('fileinput', {name : filename , uri : file.uri, type : 'image/'+extension});
     



                  const axiosConfig = {
                    headers: {
                      'bearer' : token,
                      //'Content-Type': `multipart/form-data`
                      'content-type': `multipart/form-data; boundary=${form_data._boundary}`,
                      //...form_data.getHeaders()
                    }
                  };
     
                  
                  axios.put(URL_AWS + '/avatar/' + idFreshdesk,form_data, axiosConfig)
                  .then((response) => {
                    console.log("Succes update user : ");
                    resolve(response)
                    //res.render('pages/register',{email: email, isConnected: isConnected});
                  })
                  .catch(function (error) {
                    console.log("Erreur update user : " + error);
                    reject(error)
                  });
              })
              .catch((error) => reject(error));

  });
}

///////////////////////////
//    USERS
//    retourne tous les users
///////////////////////////
export function getAllUsers (firebase) {
  console.log("==================================" + (firebase == null));
  return new Promise(
    (resolve, reject) => {

      firebase.doGetIdToken()
      .then(token => {
          console.log("token recupere");
          var axiosConfig = {
            headers :{
              //'Content-Type' : `multipart/form-data; boundary=${form._boundary}`,
              'bearer'      : token,
            }
          };

          axios.get(URL_AWS + '/users',  axiosConfig)
          .then((response) => {
            //console.log(response.data);
            resolve(response.data)
          })
          .catch(function (error) {
            console.log("Erreur requete aws (getAllUsers): " + error);
            reject(error)
          });
      })
      .catch((error) => {
        console.log("getAllUser APIAWS " +error);
        reject(error);
      });

    });
}

///////////////////////////
//    TICKET
//    get broadcast amount
///////////////////////////
export function getBroadcastAmount (firebase, idBroadcast) {

  return new Promise(
    (resolve, reject) => {

      firebase.doGetIdToken()
      .then(token => {

          var axiosConfig = {
            headers :{
              //'Content-Type' : `multipart/form-data; boundary=${form._boundary}`,
              'bearer'      : token,
            }
          };
          
          axios.get(URL_AWS + '/subscription/' + idBroadcast, axiosConfig)
          .then((response) => {
            
            resolve(response.data)
            //res.render('pages/register',{email: email, isConnected: isConnected});
          })
          .catch(function (error) {
            console.log("Erreur requete aws (subscription): " + error);
            reject(error)
          });
      })
      .catch((error) => reject(error));

    });
}

///////////////////////////
//    TICKET
//    get broadcast amount
///////////////////////////
export function getAllTicketClosed (firebase) {

  return new Promise(
    (resolve, reject) => {

      firebase.doGetIdToken()
      .then(token => {

          var axiosConfig = {
            headers :{
              //'Content-Type' : `multipart/form-data; boundary=${form._boundary}`,
              'bearer'      : token,
            }
          };
          
          axios.get(URL_AWS + '/getUserAllTicketClosed', axiosConfig)
          .then((response) => {
            
            resolve(response.data)
            //res.render('pages/register',{email: email, isConnected: isConnected});
          })
          .catch(function (error) {
            console.log("Erreur requete aws (getUserAllTicketClosed): " + error);
            reject(error)
          });
      })
      .catch((error) => reject(error));

    });
}

///////////////////////////
//    TICKET SOUSCRIPTION
//    update
///////////////////////////
export function updateSouscriptionTicket (firebase, idSouscriptionTicket, idBroadcastTicket, idProductTicket, ticket) {
  
  return new Promise((resolve, reject) => {
    firebase.doGetIdToken()
    .then(token => {
        var axiosConfig = {
          headers :{
            'Content-Type': 'application/json; charset=utf-8',
            'Accept'      : 'application/json',
            'bearer'        : token,
          }
        };  
        axios.post(URL_AWS + '/updatesubscription/'+idSouscriptionTicket+'/'+idBroadcastTicket+'/'+idProductTicket, ticket, axiosConfig)
        .then((response) => {
          resolve(response.data)
        })
        .catch(function (error) {
          console.log("Erreur requete aws : " + error);
          reject(error)
        });
    })
    .catch((error) => reject(error));
  });
}

///////////////////////////
//    TICKET
//    broadcast PP
///////////////////////////
export function broadcastPP (firebase, product) {

  return new Promise((resolve, reject) => {
    firebase.doGetIdToken()
    .then(token => {
        var axiosConfig = {
          headers :{
            //'Content-Type'  : `multipart/form-data; boundary=${form._boundary}`,
            'Content-Type': 'application/json; charset=utf-8',
            //'Content-Type' : `multipart/form-data; boundary=${form._boundary}`,
            'Accept'      : 'application/json',
            'bearer'        : token,
          }
        };  
        axios.post(URL_AWS + '/broadcastPP', product, axiosConfig)
        .then((response) => {
          console.log("LE SERVEUR A BIEN REPONDU UN TRUC");
          //console.log(Object(response).keys())
          resolve(response.data)
        })
        .catch(function (error) {
          console.log("Erreur requete aws : " + error);
          reject(error)
        });
    })
    .catch((error) => reject(error));
  });
}

///////////////////////////
//    TICKET
//    creation de ticket
///////////////////////////
export function ssCreateStructuredProduct (firebase, product) {

  var FormData = require('form-data');
  var form = new FormData();

  Object.keys(product).forEach(key => {
    //console.log(key + "   -   " + product[key] + "   :  " + typeof product[key]);
    form.append(key, typeof product[key] != 'boolean' ? product[key] : product[key].toString());
  });

  //console.log("BOUNDARY : "+form._boundary);
  //var filesuploaded = req.files;
  /*console.log(req.files);

  if ( filesuploaded.length > 0 ) {
      for (var i = 0; i < filesuploaded.length; i++) {
          formData.append('fileinput', fs.createReadStream(filesuploaded[i].path),filesuploaded[i].originalname);
          // formData.append('fileinput', filesuploaded[i].buffer, { filename : filesuploaded[i].originalname });
        }
  }*/
  
  return new Promise((resolve, reject) => {
    firebase.doGetIdToken()
    .then(token => {
        var axiosConfig = {
          headers :{
            //'Content-Type': 'application/x-www-form-urlencoded',
            //'Content-Type': 'application/json; charset=utf-8',
            'Content-Type'  : `multipart/form-data; boundary=${form._boundary}`,
            
            //'Accept'      : 'application/json',
            'bearer'        : token,
            //'type'        : 'Produit structuré'
          }
        };  
        axios.post(URL_AWS + '/createTicket', form, axiosConfig)
        .then((response) => {
          //console.log(response);
          if (response.data === 'Error') {
            reject('Error');
          } else {
            resolve(response.data);
          }
          //res.render('pages/register',{email: email, isConnected: isConnected});
        })
        .catch(function (error) {
          console.log("Erreur requete aws : " + error);
          reject(error)
        });
    })
    .catch((error) => reject(error));
  });
}

///////////////////////////
//    TICKET
//    modification
///////////////////////////
export function ssModifyTicket (firebase, product) {

  var FormData = require('form-data');
  var form = new FormData();

  Object.keys(product).forEach(key => {
    console.log(key + "   -   " + product[key]);
    form.append(key, typeof product[key] != 'boolean' ? product[key] : product[key].toString());
  });

  return new Promise((resolve, reject) => {
    firebase.doGetIdToken()
    .then(token => {
        var axiosConfig = {
          headers :{
            //'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/json; charset=utf-8',
            //'Content-Type' : `multipart/form-data; boundary=${form._boundary}`,
            'Accept'      : 'application/json',
            'bearer'      : token,
            //'type'        : 'Produit structuré'
          }
        };
        /*var axiosConfig = {
          headers :{
            'Content-Type'  : `multipart/form-data; boundary=${form._boundary}`,
            'bearer'        : token,
          }
        };  */
        axios.post(URL_AWS + '/modifyTicket', product, axiosConfig)
        .then((response) => {
          //console.log(response);
          resolve(response)
          //res.render('pages/register',{email: email, isConnected: isConnected});
        })
        .catch(function (error) {
          console.log("Erreur requete aws : " + error);
          reject(error)
        });
    })
    .catch((error) => reject(error));
    
  });
}

  
///////////////////////////
//    TICKET
//    getConversation
///////////////////////////
export function getConversation (firebase, idTicket) {

    return new Promise(
      (resolve, reject) => {

        firebase.doGetIdToken()
        .then(token => {

            var axiosConfig = {
              headers :{
                //'Content-Type' : `multipart/form-data; boundary=${form._boundary}`,
                'bearer'      : token,
              }
            };
            
            axios.get(URL_AWS + '/getConversation/' + idTicket, axiosConfig)
            .then((response) => {
              //console.log(response);
              resolve(response.data)
              //res.render('pages/register',{email: email, isConnected: isConnected});
            })
            .catch(function (error) {
              console.log("Erreur requete aws (getConversation): " + error);
              reject(error)
            });
        })
        .catch((error) => reject(error));

      });
}

///////////////////////////
//    TICKET
//    get multiples Conversation
///////////////////////////
export function getConversations (firebase, idTickets) {

  return new Promise((resolve, reject) => {
    firebase.doGetIdToken()
    .then(token => {
        var axiosConfig = {
          headers :{
            'Content-Type': 'application/json; charset=utf-8',
            'Accept'      : 'application/json',
            'bearer'      : token,
          }
        };

        axios.post(URL_AWS + '/getconversations', idTickets, axiosConfig)
        .then((response) => {
          //console.log(response.data[0]);
          resolve(response.data)
          //res.render('pages/register',{email: email, isConnected: isConnected});
        })
        .catch(function (error) {
          console.log("Erreur requete aws : " + error);
          reject(error)
        });
    })
    .catch((error) => reject(error));
    
  });
}

export function createreply (firebase, message) {

  var FormData = require('form-data');
  var form = new FormData();

  Object.keys(message).forEach(key => {
    //console.log(key + "   -   " + product[key]);
    form.append(key, typeof message[key] != 'boolean' ? message[key] : message[key].toString());
  });

  return new Promise((resolve, reject) => {
    firebase.doGetIdToken()
    .then(token => {
        var axiosConfig = {
          headers :{
            //'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/json; charset=utf-8',
            //'Content-Type' : `multipart/form-data; boundary=${form._boundary}`,
            'Accept'      : 'application/json',
            'bearer'      : token,
          }
        };

        axios.post(URL_AWS + '/createreply', form, axiosConfig)
        .then((response) => {
          //console.log(response);
          resolve(response)
          //res.render('pages/register',{email: email, isConnected: isConnected});
        })
        .catch(function (error) {
          console.log("Erreur requete aws : " + error);
          reject(error)
        });
    })
    .catch((error) => reject(error));
    
  });
}

///////////////////////////
//    TICKET
//    retourne un ticket unique
///////////////////////////
export function getTicket (firebase, idTicket) {
  return new Promise(
    (resolve, reject) => {

      firebase.doGetIdToken()
      .then(token => {

          var axiosConfig = {
            headers :{
              //'Content-Type' : `multipart/form-data; boundary=${form._boundary}`,
              'bearer'      : token,
            }
          };

          axios.get(URL_AWS + '/getTicket/'+ idTicket,  axiosConfig)
          .then((response) => {
            //console.log(response.data);
            resolve(response.data)
          })
          .catch(function (error) {
            console.log("Erreur requete aws (getTicket): " + error);
            reject(error)
          });
      })
      .catch((error) => reject(error));

    });
}

///////////////////////////
//    TICKET
//    retourne un ticket unique
///////////////////////////
export function getRepricing (firebase, idTicket, issuer) {
  return new Promise(
    (resolve, reject) => {
      console.log(issuer);
      firebase.doGetIdToken()
      .then(token => {

          var axiosConfig = {
            headers :{
              //'Content-Type' : `multipart/form-data; boundary=${form._boundary}`,
              'bearer'      : token,
            },

          };

          let path = '/repricing/'+ idTicket +'/' +issuer;
          if (issuer === 'ALL') {
            path = '/repricingall/' + idTicket;
          }

          axios.get(URL_AWS + path,  axiosConfig)
          .then((response) => {
            //console.log(response);
            resolve(response.data)
          })
          .catch(function (error) {
            console.log("Erreur requete aws (getTicket): " + error);
            reject(error)
          });
      })
      .catch((error) => reject(error));

    });
}

///////////////////////////
//    INFOS DE DEPART
//    retiourne toutes les infos
///////////////////////////
export function getUserAllInfoAPI (idToken, device) {
  var axiosConfig = {
    headers :{
      'Content-Type': 'application/json; charset=utf-8',
      'Accept'      : 'application/json',
      //'Content-Type': 'application/x-www-form-urlencoded',
      //'Content-Type': 'application/json; charset=utf-8',
      //'Accept'      : 'application/json',
      'bearer'      : idToken
    }
  };
  

  //console.log(device);

  return new Promise(
    (resolve, reject) => {
      //axios.get(URL_AWS + '/getUserAllInfo', axiosConfig)
      axios.post(URL_AWS + '/getUserAllInfo', device, axiosConfig)
      .then((response) => {
        //console.log("Succes : " + JSON.stringify(response["data"]));
        console.log("Succes requete getUserAllIndo");
        //console.log(Object.keys(response.data));
        resolve(response.data);
        //res.render('pages/register',{email: email, isConnected: isConnected});
      })
      .catch(function (error) {
        console.log("Erreur requete aws : " + error);
        reject(error)
      });
    });
}




export function getUserFavorites (idToken) {
  var axiosConfig = {
    headers :{
      //'Content-Type': 'application/x-www-form-urlencoded',
      //'Content-Type': 'application/json; charset=utf-8',
      //'Accept'      : 'application/json',
      'bearer'      : idToken
    }
  };
  
  return new Promise(
    (resolve, reject) => {
      axios.get(URL_AWS + '/getUserFavorites', axiosConfig)
      .then((response) => {
        //console.log("Succes : " + JSON.stringify(response["data"]));
        resolve(response.data);
        //res.render('pages/register',{email: email, isConnected: isConnected});
      })
      .catch(function (error) {
        console.log("Erreur requete aws : " + error);
        reject(error)
      });
    });
}

export function setFavoriteAPI (idToken, obj) {


  var axiosConfig = {
    headers :{
      //'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/json; charset=utf-8',
      //'Accept'      : 'application/json',
      'bearer'      : idToken
    }
  };
  
  return new Promise(
    (resolve, reject) => {
      axios.post(URL_AWS + '/switchfavorite', obj, axiosConfig)
      .then((response) => {
        console.log("Succes : " + JSON.stringify(response["data"]));
        resolve(response.data);
        //res.render('pages/register',{email: email, isConnected: isConnected});
      })
      .catch(function (error) {
        console.log("Erreur requete prix : " + error);
        reject(error)
      });
    });
}

export function setFavorite (firebase, idProduct) {

  return new Promise((resolve, reject) => {
      firebase.doGetIdToken()
      .then(token => {
          var axiosConfig = {
            headers :{
              //'Content-Type': 'application/x-www-form-urlencoded',
              //'Content-Type': 'application/json; charset=utf-8',
              //'Accept'      : 'application/json',
              'bearer'      : token
            }
          };
          console.log(idProduct);
          axios.get(URL_AWS + '/switchfavorite2/' + idProduct,  axiosConfig)
          .then((response) => {
            //console.log("Succes : " + JSON.stringify(response["data"]));
            resolve(response.data);
            //res.render('pages/register',{email: email, isConnected: isConnected});
          })
          .catch(function (error) {
            console.log("Erreur requete prix : " + error);
            reject(error)
          });
    });
  });
}


/**************************************
          RECHERCHE DES AUTOCALLS
*/
export function searchProducts (firebase, criteria, toSave=true) {
  toSave = (typeof toSave !== 'undefined') ? toSave : true;
  var FormData = require('form-data');
  var form = new FormData();
  console.log(criteria)
  Object.keys(criteria).forEach(key => {
    //console.log(key + "   -   " + criteria[key]);
    form.append(key, criteria[key]);
  });
  
  return new Promise(
    (resolve, reject) => {

      firebase.doGetIdToken()
      .then(token => {
       
          var axiosConfig = {
            headers :{
              //'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Type': 'application/json; charset=utf-8',
              //'Content-Type' : `multipart/form-data; boundary=${form._boundary}`,
              'Accept'      : 'application/json',
              'bearer'      : token,
              'tosave'      : toSave,
              //'type'        : 'Produit structuré'
            }
          };

          //axios.post(URL_AWS + '/searchautocall', criteria, axiosConfig)
          axios.post(URL_AWS + '/price', criteria, axiosConfig)
          .then((response) => {
            //console.log("Succes demande prix : " + response.data.length);
            //console.log(response.data);
            console.log("Nbre de produits recus : " + response.data.length);

            resolve(response.data)
            //res.render('pages/register',{email: email, isConnected: isConnected});
          })
          .catch(function (error) {
            console.log("Erreur requete prix aws : " + error);
            reject(error)
          });
      })
      .catch((error) => reject(error));
    });
  }


  //reprice un autocall avec de bouveaux criteres
  export async function reprice (firebase, product, productOrigin) {

    try {
      var token = await firebase.doGetIdToken();

      var axiosConfig = {
        headers :{
          //'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/json; charset=utf-8',
          //'Content-Type' : `multipart/form-data; boundary=${form._boundary}`,
          'Accept'      : 'application/json',
          'bearer'      : token,
        }
      };
      var dataToSend = {};
      dataToSend['ORIGIN'] = productOrigin;
      dataToSend['TARGET'] = product;
      var response = await axios.post(URL_AWS + '/reprice', dataToSend, axiosConfig);

      return await Promise.resolve(response.data);
    }
    catch(err) {
      // catches errors both in fetch and response.json
      return await Promise.reject(err);
    }
    
  }

  //recupere le r-tableau des produits les plus prices
  export async function getMostPricedPS (firebase) {

    try {
      var token = await firebase.doGetIdToken();

      var axiosConfig = {
        headers :{
          //'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/json; charset=utf-8',
          //'Content-Type' : `multipart/form-data; boundary=${form._boundary}`,
          'Accept'      : 'application/json',
          'bearer'      : token,
        }
      };
      var criteria = {};
      criteria['nbOfPricings'] = 2;
      
      var response = await axios.post(URL_AWS + '/getMostPricedPS', criteria, axiosConfig);

      return await Promise.resolve(response.data);
    }
    catch(err) {
      // catches errors both in fetch and response.json
      return await Promise.reject(err);
    }
    
  }

/**************************************
         NOTIFICATIONS
*/
export function deleteNotification (firebase, type, id) {


  
  return new Promise(
    (resolve, reject) => {

      firebase.doGetIdToken()
      .then(token => {

          axios.delete(URL_AWS + "/notification", {  headers:{'Content-Type': 'application/json; charset=utf-8', 'bearer' : token ,'type' : type, 'id' : id  }})
          //axios.post(URL_AWS + '/searchautocall', criteria, axiosConfig)
          .then((response) => {
            console.log("Succes delete notification : " + response.data);
 
            resolve(response)
            //res.render('pages/register',{email: email, isConnected: isConnected});
          })
          .catch(function (error) {
            console.log("Erreur delete notification : " + error);
            reject(error)
          });
      })
      .catch((error) => reject(error));
    });
  }

  


