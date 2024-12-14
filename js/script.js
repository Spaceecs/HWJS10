// Елементи DOM
const selectArea = document.getElementById('npAreas');
const inputCitySearch = document.getElementById('citySearch');
const selectCities = document.getElementById('npCities');
const selectWarehouses = document.getElementById('npWarehouses');
const errorMessages = document.getElementById('errorMessages');
const getWarehousesButton = document.getElementById('getWarehousesButton');

// API Key
const apiKey = '70c790dbca123facef86380d79edf525';

// Массиви для даних
let areas = [];
let cities = [];
let warehouses = [];

// Завантаження списку областей
function getAreas() {
    fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        body: JSON.stringify({
            apiKey,
            modelName: "AddressGeneral",
            calledMethod: "getAreas",
            methodProperties: {}
        }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => {
            if (!data.success) throw new Error('Не вдалося завантажити області');
            areas = data.data;
            buildAreas();
        })
        .catch(err => {
            console.error('Помилка завантаження областей:', err);
            showError('Не вдалося завантажити області');
        });
}

// Заповнення списку областей
function buildAreas() {
    selectArea.innerHTML = '<option disabled selected>Оберіть область</option>';
    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area.Ref;
        option.textContent = area.Description;
        selectArea.appendChild(option);
    });
}

// Завантаження міст
function getCities() {
    const areaRef = selectArea.value;
    const search = inputCitySearch.value.trim();

    if (!areaRef) {
        showError('Спочатку оберіть область');
        return;
    }

    fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        body: JSON.stringify({
            apiKey,
            modelName: "AddressGeneral",
            calledMethod: "getCities",
            methodProperties: {
                AreaRef: areaRef,
                FindByString: search
            }
        }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => {
            if (!data.success) throw new Error('Не вдалося знайти міста');
            cities = data.data;
            buildCities();
        })
        .catch(err => {
            console.error('Помилка завантаження міст:', err);
            showError('Не вдалося завантажити міста');
        });
}

// Заповнення списку міст
function buildCities() {
    selectCities.innerHTML = '<option disabled selected>Оберіть місто</option>';
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.Ref;
        option.textContent = city.Description;
        selectCities.appendChild(option);
    });
}

// Завантаження відділень
function getWarehouses() {
    const cityRef = selectCities.value;

    if (!cityRef) {
        showError('Оберіть місто для отримання відділень');
        return;
    }

    fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        body: JSON.stringify({
            apiKey,
            modelName: "AddressGeneral",
            calledMethod: "getWarehouses",
            methodProperties: { CityRef: cityRef }
        }),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => {
            if (!data.success) throw new Error('Не вдалося завантажити відділення');
            warehouses = data.data;
            buildWarehouses();
        })
        .catch(err => {
            console.error('Помилка завантаження відділень:', err);
            showError('Не вдалося завантажити відділення');
        });
}

// Заповнення списку відділень
function buildWarehouses() {
    selectWarehouses.innerHTML = '<option disabled selected>Список відділень</option>';
    warehouses.forEach(warehouse => {
        const option = document.createElement('option');
        option.value = warehouse.Ref;
        option.textContent = warehouse.Description;
        selectWarehouses.appendChild(option);
    });
}

// Показати повідомлення про помилку
function showError(message) {
    errorMessages.textContent = message;
    errorMessages.style.display = 'block';
}

// Обробники подій
inputCitySearch.addEventListener('input', () => {
    if (selectArea.value) {
        getCities();
    } else {
        showError('Спочатку оберіть область');
    }
});

selectArea.addEventListener('change', getCities);
selectCities.addEventListener('change', getWarehouses);
getWarehousesButton.addEventListener('click', getWarehouses);

// Початкове завантаження
getAreas();
