const socialMedias = {};

$(document).ready(function() {
  setupCatVideo();
  getPosts.fromReddit();
  const foo = function() {
    const Http = new XMLHttpRequest();
    const url = "https://jsonplaceholder.typicode.com/posts";
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = e => {
      console.log(Http.responseText);
    };
  };
});

const setupCatVideo = () => {
  document.getElementById("talking-cat").playbackRate = 0.5;
};

const changeCatStatus = status => {
  if (status) {
    document.getElementById("talking-cat").play();
    document.getElementById("talking-cat").classList.add("playing");
    document.getElementById("talking-cat").classList.remove("paused");
  } else {
    document.getElementById("talking-cat").pause();
    document.getElementById("talking-cat").classList.add("paused");
    document.getElementById("talking-cat").classList.remove("playing");
  }
};

const getPosts = {
  fromReddit: () => {
    const url = `/getLastPostReddit`;
    fetch(url, { method: "POST" })
      .then(response => {
        return response.json();
      })
      .then(response => {
        response.forEach(post => {
          post.src = "reddit";
          posts.push(post);
        });
      })
      .catch(error => {
        console.log(error);
      });
  },

  fromTwitter: () => {
    const url = `/getLastPostTwitter`;
    fetch(url, { method: "POST" })
      .then(response => {
        return response.json();
      })
      .then(response => {
        response.forEach(post => {
          post.src = "twitter";
          posts.push(post);
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
};
