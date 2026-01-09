// Обновление времени и даты
function updateTime() {
    const now = new Date();
    
    // Время
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('time').textContent = `${h}:${m}:${s}`;
    
    // Дата
    const days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    document.getElementById('date').textContent = `${dayName}, ${day} ${month} ${year}`;
}

updateTime();
setInterval(updateTime, 1000);

// Создание календаря
function createCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    // Заголовки
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    dayNames.forEach(name => {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = name;
        calendar.appendChild(header);
    });
    
    // Пустые ячейки до первого дня
    for (let i = 0; i < firstDayOfWeek; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day other-month';
        calendar.appendChild(empty);
    }
    
    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        if (day === today) {
            dayDiv.classList.add('today');
        }
        dayDiv.textContent = day;
        calendar.appendChild(dayDiv);
    }
}

createCalendar();

// Загрузка погоды
async function loadWeather() {
    try {
        const apiKey = 'lf0e3ilwJlcpI1SjUyVPgNz3EvIOr209';
        const location = '31.2587,35.2126'; // Арад, Израиль
        const url = `https://api.tomorrow.io/v4/weather/realtime?location=${location}&units=metric&apikey=${apiKey}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        const values = data.data.values;
        const temp = Math.round(values.temperature);
        const humidity = values.humidity;
        const windSpeed = Math.round(values.windSpeed);
        const weatherCode = values.weatherCode;
        
        // Описания погоды
        const weatherDescriptions = {
            1000: 'Ясно',
            1001: 'Облачно',
            1100: 'Преимущественно ясно',
            1101: 'Переменная облачность',
            1102: 'Преимущественно облачно',
            2000: 'Туман',
            2100: 'Лёгкий туман',
            4000: 'Морось',
            4001: 'Дождь',
            4200: 'Лёгкий дождь',
            4201: 'Сильный дождь',
            5000: 'Снег',
            5001: 'Метель',
            5100: 'Лёгкий снег',
            5101: 'Сильный снег',
            6000: 'Мокрый снег',
            6001: 'Замерзающий дождь',
            7000: 'Град',
            8000: 'Гроза'
        };
        
        const description = weatherDescriptions[weatherCode] || 'Облачно';
        
        // Эмодзи погоды
        const weatherEmojis = {
            1000: '☀️',
            1001: '☁️',
            1100: '🌤️',
            1101: '⛅',
            1102: '🌥️',
            2000: '🌫️',
            2100: '🌁',
            4000: '🌦️',
            4001: '🌧️',
            4200: '🌦️',
            4201: '⛈️',
            5000: '❄️',
            5001: '🌨️',
            5100: '🌨️',
            5101: '❄️',
            6000: '🌨️',
            6001: '🧊',
            7000: '🧊',
            8000: '⛈️'
        };
        
        const emoji = weatherEmojis[weatherCode] || '🌤️';
        
        document.getElementById('weather-container').innerHTML = `
            <div class="weather-info">
                <div>
                    <div class="temp">${emoji} ${temp}°</div>
                    <div class="weather-desc">${description}</div>
                </div>
                <div class="weather-details">
                    <div>💧 Влажность: ${humidity}%</div>
                    <div>💨 Ветер: ${windSpeed} м/с</div>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Ошибка загрузки погоды:', error);
        document.getElementById('weather-container').innerHTML = `
            <div class="error-message">
                ⚠️ Не удалось загрузить погоду<br>
                <small>Проверьте подключение к интернету</small>
            </div>
        `;
    }
}

setTimeout(loadWeather, 500);
