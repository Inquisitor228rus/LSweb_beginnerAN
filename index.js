const menu = document.querySelector(".menu-fullscreen");
const menuList = document.querySelector(".menu-fullscreen__list");
const hamburger = document.querySelector(".hamburger");

function myFunction(x) {
  const menuOpen = x.classList.toggle("change");
  if (menuOpen) {
    // menu.style.display = 'flex'
    menu.style.left = 0;
  } else {
    menu.style.left = '100vw';
    // menu.style.display = 'none';
  }
}

menu.addEventListener("click", e => {
  e.preventDefault();
  if (e.target === menu || menuList) {
    myFunction(hamburger);
  }
})
