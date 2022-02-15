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


const fidnBlockByAlies = alias => {
  return $(".reviews__item").filter((ndx, item) => {
    return $(item).attr("data-linked-with") === alias;
  })
}

$(".interactive-avatar__link").click(e => {
  e.preventDefault();

  const $this = $(e.currentTarget);
  const target = $this.attr("data-open");
  const itemToSHow = fidnBlockByAlies(target);
  const curItem = $this.closest(".reviews__switcher-item");

  
  itemToSHow.addClass("reviews__item--active").siblings().removeClass("reviews__item--active");
  curItem.addClass("interactive-avatar--active").siblings().removeClass("interactive-avatar--active");
})