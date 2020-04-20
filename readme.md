# Open Weather API

This project features a node js backend that retrieves weather data from [OpenWeatherMap](https://openweathermap.org/) and caches retrieved data in mongoDB.

## Starting the application

Before starting the project, you need to get an OpenWeather api key. Please refer to the following page on how to get it.

[How to get an OpenWeather api key](https://openweathermap.org/appid)

To start the project, there are two ways:

### Pure Docker Approach

Make sure docker is installed on your local machine.  
Note: If your are using docker toolbox on Windows platform, replace `localhost` with `192.168.99.100` in the commands below.

```console
docker pull mongo
docker pull ethernoy/open-weather-api
docker run -d -p 27017:27017 --name openWeatherDb mongo
docker run -d -p 3000:3000 -e DB_ENDPOINT=localhost:27017 -e OPEN_WEATHER_API_KEY=${your api key} --name openWeatherApi ethernoy/open-weather-api
```

Then the server should be hosted on `192.168.99.100:3000` or `localhost:3000` depending on your docker configuration.

### Local npm Approach

Make sure git, nodeJS, npm and docker are installed on your local machine.

```console
git clone https://github.com/ethernoy/open-weather-api.git
cd open-weather-api
npm install
```

Navigate to the project directory, copy `.env.example` file and rename it as `.env`, then fill in your api key and db entry point (shoule be `localhost:27017` or `192.168.99.100:27017`) accordingly.

```console
docker pull mongo
docker run -d -p 27017:27017 --name openWeatherDb mongo
npm start
```

Then the server should be hosted on localhost:3000.

In addition, you can test the application using the following command:

```console
npm test
```

## Using the application

After the application is started, you should be able to see the main page on `localhost:3000` or `192.168.99.100:3000`.

To use the weather api, you need to first retrieve the bearer token from `/token`. Note that it is recommended to visit `/weather` using [Postman](https://www.postman.com/) since bearer token is needed to pass authorization.

### Example output

```json
{
    "coord": {
        "lon": 114.16,
        "lat": 22.29
    },
    "weather": [
        {
            "id": 801,
            "main": "Clouds",
            "description": "few clouds",
            "icon": "02n"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 297.64,
        "feels_like": 298.66,
        "temp_min": 296.48,
        "temp_max": 299.15,
        "pressure": 1013,
        "humidity": 78
    },
    "visibility": 10000,
    "wind": {
        "speed": 4.1,
        "deg": 120
    },
    "clouds": {
        "all": 20
    },
    "dt": 1587391897,
    "sys": {
        "type": 1,
        "id": 9154,
        "country": "HK",
        "sunrise": 1587333547,
        "sunset": 1587379499
    },
    "timezone": 28800,
    "id": 1819729,
    "name": "Hong Kong",
    "cod": 200,
    "createDate": "2020-04-20T14:15:56.140Z",
    "_id": "5e9dae9ce5025908b8f08365"
}
```
