const fetchRequest = async (url, {
    method = 'GET',
    callback,
    body,
    headers,
}) => {
    try {
        const options = {
            method,
        };

        if (body) options.body = JSON.stringify(body);

        if (headers) options.headers = headers;

        const response = await fetch(url, options);
        console.log('response: ', response);

        if (response.ok) {
            const data = await response.json();
            if (callback) return callback(null, data);
            return;
        }

        if (!response.ok) {
            if (response.status > 400) {
                throw new Error(`Ошибка: ${response.status}: ${response.statusText}`);
            }
            // throw new Error(`${response.status} Что-то пошло не так...`);
            throw new Error('default');
        }
    } catch (err) {
        return callback(err);
    }
};
