async function get_weather(city) {
    res = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=WDDRBN3YHDBNZ6MJF4GKG5V5A&contentType=json`)
    data = await res.json();
    let currentTime = new Date();
    let hour = currentTime.getHours();
    return {location: data.resolvedAddress, temp: data.days[0].hours[hour].temp, conditions: data.days[0].hours[hour].conditions, humidity: data.days[0].hours[hour].humidity, icon: data.days[0].hours[hour].icon};
}

const h2 = document.createElement('h2');
const ul = document.createElement('ul');
const li_location = document.createElement('li');
const li_temp = document.createElement('li');
const li_conditions = document.createElement('li');
const li_humidity = document.createElement('li');
const li_icon = document.createElement('li');
const p = document.createElement('p');
const button = document.createElement('button');
const img = document.createElement('img');

var temp;

document.querySelector('form').addEventListener('submit', (event) => {
    const city = document.querySelector('input').value;
    document.querySelector('div').style.display = 'block';
    get_weather(city)
    .then(res => {
        document.querySelector('div').style.display = 'none';
        p.textContent = '';
        h2.textContent = `Today's Weather of ${res.location}`;
        li_location.textContent = `Location: ${res.location}`;
        li_temp.innerHTML = `<b>Temprature: ${res.temp} °C</b>`;
        li_conditions.textContent = `Conditions: ${res.conditions}`;
        li_humidity.textContent = `Humidity: ${res.humidity}`;
        li_icon.textContent = `Icon: ${res.icon}`;
        ul.append(li_location, li_temp, li_conditions, li_humidity, li_icon);
        button.textContent = 'Show °F';
        button.style.marginLeft = '10px';
        button.className = 'btn btn-primary'
        document.body.append(button, h2, ul);
        get_gif(res.icon);
        temp = res.temp;
    }, () => {
        document.querySelector('div').style.display = 'none';
        h2.textContent = '';
        ul.textContent = '';
        p.textContent = 'No city found for ' + city;
        p.style.color = 'red';
        document.body.append(p);
    });
    event.preventDefault();
});

async function get_gif(icon) {
    try {
        const res = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=ciGAfltaQNbtfcbxxrNmATUz59wEA1wG&s=${icon}`);
        const data = await res.json()
        if(data.data) {
            img.src = data.data.images.original.url;
        }
        else img.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyp3I4d1dyUilENcDxwqKHMwcnFrAOq-BBvg&s';
    } catch (error) {
        img.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyp3I4d1dyUilENcDxwqKHMwcnFrAOq-BBvg&s';
    }
    document.body.append(img);
}

button.addEventListener('click', () => {
    if(button.textContent == 'Show °F') {
        button.textContent = 'Show °C'; 
        li_temp.innerHTML = `<b>Temprature: ${temp*1.8+32} °F</b>`;
    }
    else {
        button.textContent = 'Show °F';
        li_temp.innerHTML = `<b>Temprature: ${temp} °C</b>`;
    }
});