const menuBtn = document.querySelector('.header__btn');
const menu = document.querySelector('.navigation');

menuBtn.addEventListener('click', ({target}) => {
    menuBtn.classList.toggle('header__btn_active');
    menu.classList.toggle('navigation_active');
});


