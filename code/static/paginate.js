(function() {
  window.addEventListener('load', () => {
    var currentPage = 0;
    var done = false;
    var matches = location.pathname.match(/user\/(\w+)/);
    var username = null;
    if(matches) {
      username = matches[1];
    }
    // adapted from https://gist.github.com/nathansmith/8939548
    var postsContainer = document.querySelector('#posts-container');
    window.addEventListener('scroll', () => {
      var pageHeight = document.documentElement.offsetHeight;
      var windowHeight = window.innerHeight;
      var scrollPosition= window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);
      if (!done && pageHeight <= windowHeight + scrollPosition) {
        let url = `/paginate?page=${++currentPage}`;
        if(username !== null) url += `&user=${username}`;
        fetch(url)
          .catch(() => done = true) // if it breaks give up
          .then(response => response ? response.text() : '')
          .then(text => {
            if(text.length) {
              postsContainer.innerHTML += text;
            } else {
              done = true;
            }
          });
      }
    });
  });
})();
