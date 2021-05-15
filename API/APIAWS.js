// API/TMDBApi.js
import axios from 'axios';
import { getContentTypeFromExtension } from '../Utils/index';

export const URL_AWS = "http://99.80.211.255:8080"
//var fs = require('fs');


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
    },
    timeout : 2000
  };
 console.log(userIdentity);
  return new Promise(
    (resolve, reject) => {
      axios.post(URL_AWS + '/user', userIdentity, axiosConfig)
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
                    let email = user.user['email'];
                    let id = user.user['id'];
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
                          user.user['email'] = email;
                          user.user['id'] = id;
                          resolve(response)
                          //res.render('pages/register',{email: email, isConnected: isConnected});
                        })
                        .catch(function (error) {
                          user.user['email'] = email;
                          user.user['id'] = id;
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
//    get all ticket closed
///////////////////////////
export function getAllTicket (firebase, filter='') {
//getUserAllTicketFollowed
  var pathToCall = 'getUserAllTicket';
  switch (filter) {
    case 'CLOSEDTICKETS' :
      pathToCall = 'getUserAllTicketClosed';
      break;
    case 'FOLLOWEDTICKETS' :
      pathToCall = 'getUserAllTicketFollowed';
      break;
    default : break;
  }
  return new Promise(
    (resolve, reject) => {

      firebase.doGetIdToken()
      .then(token => {

          var axiosConfig = {
            headers :{
              //'Content-Type' : `multipart/form-data; boundary=${form._boundary}`,
              'bearer'      : token,
            },
            timeout : 10000,
          };
          
          axios.get(URL_AWS + '/' + pathToCall, axiosConfig)
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
export function createTicket (firebase, product, files=[]) {

  var FormData = require('form-data');
  var form = new FormData();

  Object.keys(product).forEach(key => {
    //console.log(key + "   -   " + product[key] + "   :  " + typeof product[key]);
    form.append(key, typeof product[key] != 'boolean' ? product[key] : product[key].toString());

  });

  
  if (files.length > 0 ) {
    for (var i = 0; i < files.length; i++) {
        //formData.append('fileinput', fs.createReadStream(files[i].path),files[i].originalname);
        //type: 'image/jpeg',  // <-  Did you miss that one?
        var fileExtension = files[i].name.split('.').pop();
        form.append('fileinput', {uri: files[i].uri, name: files[i].name, type: getContentTypeFromExtension(fileExtension)});
      }
  }


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

///////////////////////////
//    UNDERLYING
//    retourne les underlying oen fonction du critere type
///////////////////////////

export async function getUnderlyings(firebase, type='ALL') {
  console.log("getUnderlyings : " + type);
  try {
      var token = await firebase.doGetIdToken();

      var axiosConfig = {
        headers :{
          'bearer'      : token,
          'pass' : 'CALLIBRI'
        }
      };
      if (type === 'INTERPOLATED_PS') {
        var response = await axios.get(URL_AWS + '/optionchainfresh', axiosConfig);
      } else {
        var response = await axios.get(URL_AWS + '/underlyings', axiosConfig);
      }
      
      if (response.data === "Error") {
        return Promise.reject("Error");
      }
      
      return Promise.resolve(response.data);
  } catch(error) {
    return Promise.reject(error);
  }
}

///////////////////////////
//    FAVORITES
//    retourne tous les favoris du user
///////////////////////////

export async function getUserFavorites (firebase, type) {

  try {
      var token = await firebase.doGetIdToken();

      var axiosConfig = {
        headers :{
          'bearer'      : token
        }
      };

      var response = await axios.get(URL_AWS + '/getFavorites/' + type, axiosConfig);
      if (response.data === "Error") {
        return Promise.reject("Error");
      }
      
      return Promise.resolve(response.data);
  } catch(error) {
    return Promise.reject(error);
  }
}

///////////////////////////
//    FAVORITES
//    met ou supprime un produit des favoris
///////////////////////////
export async function setFavorite (firebase, productJSON) {

  //return new Promise((resolve, reject) => {
  try {
      var token = await firebase.doGetIdToken();

      var axiosConfig = {
        headers :{
          'bearer'      : token
        }
      };

      var response = await axios.post(URL_AWS + '/switchfavorite', productJSON, axiosConfig)
      if (response.data === "Error") {
        return Promise.reject("Error");
      }
      
      return Promise.resolve(response.data);
  } catch(error) {
    return Promise.reject(error);
  }

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
            if (response.data === 'Error') {
              reject("Probleme");
            } else {
              console.log("Nbre de produits recus : " + response.data.length);

              resolve(response.data)
              //res.render('pages/register',{email: email, isConnected: isConnected});
            }
          })
          .catch(function (error) {
            console.log("Erreur requete prix aws : " + error);
            reject(error)
          });
      })
      .catch((error) => reject(error));
    });
  }

/**************************************
   PRODUIT STRUCTURE REPRICE
*/
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
      if (response.data === "Error") {
        return await Promise.reject("Error");
      }
      return await Promise.resolve(response.data);
    }
    catch(err) {
      // catches errors both in fetch and response.json
      return await Promise.reject(err);
    }
    
  }

/**************************************
   PRODUIT STRUCTURE SAUVE LE PRODUIT 
*/
export async function saveProduct (firebase, product) {

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

    var response = await axios.post(URL_AWS + '/saveProduct', product, axiosConfig);
    console.log("SAVE PRODUCT OK ");
    //console.log(response.data);
    return await Promise.resolve(response.data);
  }
  catch(err) {
    // catches errors both in fetch and response.json
    console.log("ERREUR SAVEPRODUCT : " + err);
    return await Promise.reject(err);
  }
  
}

/**************************************
   PRODUIT STRUCTURE : RECUPERE LES PLUS DEMANDES
*/
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
console.log("NBRE DE GESTMOSTPRICED : " + response.data.length);
      return await Promise.resolve(response.data);
    }
    catch(err) {
      // catches errors both in fetch and response.json
      return await Promise.reject(err);
    }
    
  }

/**************************************
   PRODUIT : lecture
*/
export async function getProduct (firebase, idProduct) {

  try {
    var token = await firebase.doGetIdToken();

    var axiosConfig = {
      headers :{
        'bearer'      : token,
      }
    };

    var response = await axios.get(URL_AWS + '/ProductDescription/' + idProduct, axiosConfig)

    return await Promise.resolve(response.data);
  }
  catch(err) {
    // catches errors both in fetch and response.json
    return await Promise.reject(err);
  }
  
}


/**************************************
   PRODUIT : lecture
*/
export async function getAllCharities (firebase) {

	try {
		var token = await firebase.doGetIdToken();

		var axiosConfig = {
		headers :{
			'bearer'      : token,
		}
		};

		var response = await axios.get(URL_AWS + '/usercharity', axiosConfig)

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


  //////////////////////////////
  //
  //   CLIENTS
  //
  //////////////////////////////
  export async function fetchDataClient(firebase) {

    try {
      var token = await firebase.doGetIdToken();
  
      var axiosConfig = {
        headers :{
          'bearer'      : token,
        }
      };

      var response = await axios.get(URL_AWS + '/client' , axiosConfig)
  
      return await Promise.resolve(response.data);
    }
    catch(err) {
      // catches errors both in fetch and response.json
      return await Promise.reject(err);
    }

}

export async function getClientCount(firebase) {

  try {
    var token = await firebase.doGetIdToken();

    var axiosConfig = {
      headers :{
        'bearer'      : token,
      }
    };

    var response = await axios.get(URL_AWS + '/countclient' , axiosConfig)

    return await Promise.resolve(response.data);
  }
  catch(err) {
    // catches errors both in fetch and response.json
    return await Promise.reject(err);
  }

}

export async function manageClientData(firebase, data, action) {

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
      if (action === 'create') {
        var response = await axios.post(URL_AWS + '/client', data, axiosConfig);
      } else if  (action === 'delete') {
        var response = await axios.delete(URL_AWS + '/client/' + data.key, axiosConfig);
      } else {//update client
        var response  = await axios.put(URL_AWS + '/client/' + data.key,  data, axiosConfig);
      }

      

      return await Promise.resolve(response.data);
    }
    catch(err) {
      // catches errors both in fetch and response.json
      return await Promise.reject(err);
    }
    
  }



