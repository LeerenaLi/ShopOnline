const menuBtn = document.querySelector('.header__btn');
const menu = document.querySelector('.navigation');
const navigationList = document.querySelector('.navigation__list_catalog');
const footerNavList = document.querySelector('.footer__list_catalog');

const getCategories = async () => {
    const url = new URL('https://jumpy-global-capricorn.glitch.me/api/category');

    const response = await fetch(url);
    const data = await response.json();

    return data;
};

const createNavItem = (category) => {
    const li = document.createElement('li');
    li.classList.add('navigation__item');
    const link = document.createElement('a');
    link.classList.add('navigation__link');
    link.href = `categories.html?category=${category}`;
    link.textContent = `${category}`;

    li.append(link);

    return li;
};

const createFooterNavItem = (category) => {
    const li = document.createElement('li');
    li.classList.add('footer__item');
    const link = document.createElement('a');
    link.classList.add('footer__link');
    link.href = `categories.html?category=${category}`;
    link.textContent = `${category}`;

    li.append(link);

    return li;
};

export const menuControl = async () => {
    menuBtn.addEventListener('click', ({target}) => {
        menuBtn.classList.toggle('header__btn_active');
        menu.classList.toggle('navigation_active');
    });

    const dataCategory = await getCategories();

    navigationList.textContent = '';
    footerNavList.textContent = '';

    dataCategory.map(item => {
        const navItem = createNavItem(item);
        navigationList.append(navItem);
        const footerNavItem = createFooterNavItem(item);
        footerNavList.append(footerNavItem);
    });
};

