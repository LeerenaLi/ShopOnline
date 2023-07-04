const headerCount = document.querySelector('.icons__header-count');
const cartCount = document.querySelector('.cart__title-count');

export const getStorage = () => JSON.parse(localStorage.getItem('dataArr')) || [];

const setStorage = (goods) => {
    localStorage.setItem('dataArr', JSON.stringify(goods));
};

export const addProductData = (product) => {
    const dataArr = getStorage('dataArr');
    dataArr.push(product);
    setStorage(dataArr);
    console.log('dataArr: ', dataArr);
    headerCount.textContent = dataArr.length;
};

export const removeStorage = (id) => {
    const dataArr = getStorage('dataArr');
    const newArr = dataArr.filter(item => item.id !== id);
    setStorage(newArr);
    console.log('newArr: ', newArr);
    headerCount.textContent = newArr.length;
    cartCount.textContent = headerCount.textContent;
};

// export default {
//     getStorage,
//     setStorage,
//     addProductData,
//     removeStorage,
// };
