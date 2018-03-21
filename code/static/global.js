window.addEventListener('load', e => {
  let dropdowns = document.querySelectorAll('#navbar .dropdown');
  for(let dropdown of dropdowns) {
    dropdown.querySelector('.dropdown-toggle').addEventListener('click', e2 => {
      dropdown.classList.toggle('open');
      setTimeout(() => {
        window.addEventListener('click', e3 => {
          if(!dropdown.contains(e3.target)) dropdown.classList.remove('open');
        }, {once: true});
      }, 0)
    });
  }
});
