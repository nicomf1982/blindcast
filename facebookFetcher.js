const config = require('./config/config').facebook
const caralibro = require('./facebook')

// const { client_id, client_secret,  } = config
// const { FB, FacebookApiException, grant_type } = require('fb');
// let access_token
// FB.options({
//   redirect_uri: 'https://f3e1efee.ngrok.io/cbFaceebook'
// })
// FB.getLoginUrl({
//    client_id,
//    client_secret,
//    grant_type,
//   scope: 'email,user_likes',
//   redirect_uri: 'https://f3e1efee.ngrok.io/cbFaceebook'
// });
const _facebook = function () {
  return new Promise((resolve, reject) => {
    const cl = caralibro.data.map(f => {
      console.log(f)
      return {
        plataform: 'facebook',
        msj: f.message,
        crateAt: new Date(f.created_time),
        author: f.from.name
      }
    })
    resolve(cl)
  })
}

module.exports = _facebook

// function fbAccessToken(cb) {
//   FB.api('oauth/access_token', {
//     client_id,
//     client_secret,
//     grant_type,
//     redirectUri: 'https://f3e1efee.ngrok.io/cbFaceebook'
//   }, function (res) {
//     if (!res || res.error) {
//       console.log(!res ? 'error occurred' : res.error);
//       cb(res.error, null)
//     }
//     cb(null, res.access_token)
//   });
// }