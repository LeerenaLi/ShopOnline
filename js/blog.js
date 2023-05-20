'use strict';

const createElement = (tag, attr, {append, appends, parent, cb} = {}) => {
    const element = document.createElement(tag);

    if (attr) {
        Object.assign(element, attr);
    }

    if (append && append instanceof HTMLElement) {
        element.append(append);
    }

    if (appends && appends.every(item => item instanceof HTMLElement)) {
        element.append(...appends);
    }

    if (parent && parent instanceof HTMLElement) {
        parent.append(element);
    }

    if (cb && typeof cb === 'function') {
        cb(element);
    }

    return element;
};

const API_URL = 'https://gorest.co.in/public-api/posts';
const COUNT_PAGINATION = 3;
const blogList = document.querySelector('.blog__list');
const articleContainer = document.querySelector('.article__container');
const wrapperPagination = document.querySelector('.pagination');


const getData = async (urlApi) => {
    const url = new URL(urlApi);
    const response = await fetch(url);
    const data = await response.json();

    return data;
};

const getUrl = (params) => {
    let url = window.location.pathname;

    const searchParams = new URLSearchParams(url.search);

    for (const keys in params) {
        searchParams.set(keys, params[keys]);
    }

    url += `?${searchParams.toString()}`;

    return url;
};

const renderPagination = (page, pages, count) => {
    wrapperPagination.textContent = '';

    const paginationList = createElement('ul', {
        className: 'pagination__list',
    }, {
        parent: wrapperPagination,
    });

    const isNotStart = page - Math.floor(count / 2) > 1;
    const isEnd = page + Math.floor(count / 2) >= pages;

    if (count > pages) {
        count = pages;
    }

    for (let i = 0; i < count; i++) {
        let n = i + 1;

        if (isNotStart) {
            if (isEnd) {
                n = pages - count + i + 1;
            } else {
                n = page - Math.floor(count / 2) + i;
            }
        }

        createElement('li', {
            className: 'pagination__item',
        }, {
            parent: paginationList,
            append: createElement('a', {
                textContent: n,
                href: getUrl({page: n}),
                className: `pagination__link ${n === page ? 'pagination__link_active' : ''}`,
            }),
        });
    }

    if (pages > count) {
        createElement('a', {
            className: `pagination__arrow pagination__arrow_start
                ${!isNotStart ? 'pagination__arrow_start-disabled' : ''}`,
            href: getUrl({page: 1}),
            tabIndex: !isNotStart ? '-1' : '0',
            innerHTML: `
                <svg width="29" height="19" viewbox="0 0 29 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M28.375 7.95833H6.52958L12.0487 2.42375L9.875 0.25L0.625 9.5L9.875 18.75L12.0487 16.5763L6.52958 11.0417H28.375V7.95833Z" fill="currentColor"/>
                </svg>           
            `,
            ariaLabel: 'В начало',
        }, {
            cb(arrow) {
                wrapperPagination.prepend(arrow);
            },
        }),
        createElement('a', {
            className: `pagination__arrow pagination__arrow_end
                ${isEnd ? 'pagination__arrow_end-disabled' : ''}`,
            href: getUrl({page: pages}),
            tabIndex: isEnd ? '-1' : '0',
            innerHTML: `
                <svg width="29" height="19" viewbox="0 0 29 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.625 7.95833H22.4704L16.9513 2.42375L19.125 0.25L28.375 9.5L19.125 18.75L16.9513 16.5763L22.4704 11.0417H0.625V7.95833Z" fill="currentColor"/>
                </svg>
            `,
            ariaLabel: 'В конец',
        }, {
            parent: wrapperPagination,
        });
    }
};

const getAutor = async (userID) => {
    const result = await fetch(`https://gorest.co.in/public-api/users/${userID}`);

    const response = await result.json();
    const autorData = response.data;

    return autorData;
};

const createTemplate = async (article, id, autorId) => {
    const dataAutor = await getAutor(autorId);

    const getRandom = (min, max) =>
        (Math.floor(Math.random() * (max - min)) + min);
    const random = getRandom(1, 13);

    blogList.insertAdjacentHTML('beforeend', `
        <li class="blog__item">
            <img src="img/blog/${random}.jpg" class="blog__img">
            <div class="blog__text">
                <a href="article.html?id=${id}" id="${id}" class="blog__link">
                    <div class="blog__descr">
                        <h2 class="blog__title">${article.title}</h2>
                        <p class="blog__body">${article.body}</p>
                    </div>
                </a>    
                <div class="blog__scan">
                    <p class="blog__count">Автор: 
                        <a href="#" class="blog__autor">${dataAutor.name}</a>
                    </p>
                </div>
            </div>
        </li>
        
    `);
};

const getAtricle = async (id) => {
    const result = await fetch(`https://gorest.co.in/public-api/posts/${id}`);

    const response = await result.json();
    const articleData = response.data;

    return articleData;
};

const createArticlePage = async (articlePageID, articleData, userId) => {
    const dataUser = await getAutor(userId);

    articleContainer.insertAdjacentHTML('beforeend', `
        <div class="bread">
            <a href="index.html" class="bread__link">Главная</a>
                <img src="icons/blog/bread__right.svg" alt="arrow right" class="bread__img">
            <a href="blog.html" class="bread__link">Блог</a>
                <img src="icons/blog/bread__right.svg" alt="arrow right" class="bread__img">
            <a href="article.html?id=${articlePageID}" class="bread__link">${articleData.title}</a>
        </div>
        <div class="article__wrapper">
                <div class="article__text">
                    <div class="article__title">${articleData.title}</div>
                    <p class="article__body">${articleData.body}</p>
                    
                    <div class="article__footer">
                        <div class="back">
                            <img src="icons/blog/left.svg" alt="arrow back" class="back__img">
                            <a href="blog.html" class="back__link">К списку статей</a>
                        </div>
                        
                        <div class="autor">
                            <p class="autor__name">${dataUser.name}</p>
                            <div class="autor__info">
                                <p class="autor__status">Gender: ${dataUser.gender}</p>
                                <p class="autor__status">Status: ${dataUser.status}</p>
                            </div>
                            <a href="mailto:${dataUser.email}" class="autor__email">E-mail: ${dataUser.email}</a>
                        </div>
                    </div>
                </div>
                <div class="article__adevertisting">
                    <img src="img/blog/add.jpg" alt="adevertisting" class="article__img">
                    <img src="img/blog/add2.jpg" alt="adevertisting" class="article__img">
                </div>
            </div>
    `);
};

const createArticleLink = () => {
    blogList.addEventListener('click', async (e) => {
        e.preventDefault();
        const target = e.target;
        const idArticle = target.closest('a').id;

        window.location.href = `article.html?id=${idArticle}`;
    });
};

const renderArticlePage = async () => {
    if (blogList) {
        createArticleLink();
    }

    const searchParams = new URLSearchParams(window.location.search);
    const articlePageID = searchParams.get('id');

    const articleData = await getAtricle(articlePageID);
    const userId = articleData.user_id;

    createArticlePage(articlePageID, articleData, userId);
};


const renderPages = async () => {
    let page = 1;
    const searchParams = new URL(document.location).searchParams;

    page = searchParams.get('page');

    const data = await getData(`${API_URL}?page=${page}`);
    const pages = data.meta.pagination.pages;

    const dataPage = data.data;

    if (dataPage) {
        dataPage.forEach(article => {
            const id = article.id;
            const autorId = article.user_id;
            if (blogList) {
                createTemplate(article, id, autorId);
            }
        });
    }

    if (pages && pages > 1) {
        renderPagination(page, pages, COUNT_PAGINATION);
    }
};


const init = () => {
    if (blogList) {
        renderPages();
    }

    if (articleContainer) {
        renderArticlePage();
    }
};
init();

