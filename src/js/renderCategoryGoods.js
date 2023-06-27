const navigationList = document.querySelector('.navigation__list_catalog');

const getCategory = async (category) => {
    const url = new URL(`https://jumpy-global-capricorn.glitch.me/api/goods/${category}`);

    const response = await fetch(url);
    const data = await response.json();

    return data;
};

export const categoryControl = async () => {
    const params = new URL(document.location).searchParams;
    const pageCategory = params.get('category');
    console.log('pageCategory: ', pageCategory);

    const dataCategory = await getCategory(pageCategory);
    console.log('dataCategory: ', dataCategory);
};
