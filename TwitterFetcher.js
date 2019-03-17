'use strict'
const config = require('./config/config').twitter
const { consumer_key, consumer_secret, access_token_key, access_token_secret, filter_data } = config
const { urlGetLastTweets } = config
const Twitter = require('twitter');
let lastPost = new Date("1950-10-04T15:28:51.000Z")

const _twitter = function () {
  return new Promise((resolve, resject) => {
    const client = new Twitter({
      consumer_key,
      consumer_secret,
      access_token_key,
      access_token_secret,
    });
    
    client.get(`${urlGetLastTweets}`, function (error, tweets, response) {
      if (!error) {
        const res = tweets.map(t => {
          // console.log(new Date(t.created_at))
          if (new Date(t.created_at) > lastPost)
          // console.log(t.created_at > lastPost)
          return {
            plataform:'twitter',
            author: t.user.screen_name,
            createdAt: new Date(t.created_at),
            msj: t.text
          }
        })
        .filter(f => f)
        const sortedPost = sortPost(res)
        if (filter_data) {
          lastPost = sortedPost[0] ? new Date(sortedPost[0].createdAt) : 0
        }
        console.log(lastPost)
        // guardar el ultimo twit , para comprarar si hay nuevos 
        resolve(res)
      }
      else (reject(error))
    });
  })
}

const sortPost = (postArr) => {
  return postArr.sort((a, b) => b.createdAt - a.createdAt)
}

module.exports = _twitter