const socialMedias = {};

$(document).ready(function() {
  setupCatVideo();

  getPosts.custom();
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
        console.log(posts);
        $("#loading-button").css("display", "none");
        $("#play-button").show();
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
        console.log(posts);
        $("#loading-button").css("display", "none");
        $("#play-button").show();
      })
      .catch(error => {
        console.log(error);
      });
  },

  custom: () => {
    const url = `/data`;
    fetch(url, { method: "POST" })
      .then(response => {
        return response.json();
      })
      .then(response => {
        response.forEach(post => {
          posts.push(post);
        });
        posts = posts.sort((a, b) => {
          // console.log(
          //   new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          // );
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        console.log(posts);
        $("#loading-button").css("display", "none");
        $("#play-button").show();
      })
      .catch(error => {
        console.log(error);
      });
  }
};
