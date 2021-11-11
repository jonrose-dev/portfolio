const readyFunc = _ => {
  fetch('https://arcane-bastion-52844.herokuapp.com/notify')
    .then(res => console.log(res))
    .catch(e => console.error(e));
  Array.from(document.getElementsByClassName('scroll')).forEach(elem => {
    elem.addEventListener('click', event => {
      event.preventDefault();
      const id = elem.getAttribute('href').split('#')[1];
      document.getElementById(id).scrollIntoView({ behavior: 'smooth' })

    });
  })
};

document.addEventListener('DOMContentLoaded', readyFunc, false);
