'use strict'
const config = require('./config/config').reddit
const { username, password, app_id, api_secret, user_agent, filter_data } = config

const RedditAPI = require('reddit-wrapper-v2');
const {apiEndpointGetSubredddit} = config 
let lastPost = new Date(93456789 * 1000);

const _reddit = () => {
  return new Promise((resolve, reject) => {
    const redditConn = new RedditAPI({
      // Options for Reddit Wrapper
      username,
      password,
      app_id,
      api_secret,
      user_agent,
      retry_on_wait: true,
      retry_on_server_error: 5,
      retry_delay: 1,
      logs: true
    })
    
    redditConn.api.get(`${apiEndpointGetSubredddit}`, {
        limit: 20,
      })
      .then(function (response) {
        let responseCode = response[0];
        let responseData = response[1];
        const res = responseData.data.children.map(r => {
          if (new Date(r.data.created * 1000) > lastPost)
          return {
            plataform: 'reddit',
            author:r.data.name,
            createdAt: new Date(r.data.created * 1000) || new Date(r.data.created_utc * 1000),
            msj: r.data.title
          }
        })
        .filter( f => f)
        const sortedPost = sortPost(res)
        if(filter_data){
          lastPost = sortedPost[0] ? new Date(sortedPost[0].createdAt * 1000): 0
        }
        // console.log(lastPost)
        resolve(sortedPost)
      })
      .catch(function (err) {
        throw(err)
      });
  })
} 

const sortPost = (postArr) => {
  return postArr.sort((a, b) => b.createdAt - a.createdAt)
}

module.exports = _reddit