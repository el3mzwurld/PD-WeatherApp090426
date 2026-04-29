export interface GeoCodingRes {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  timezone: string;
}
export interface GeoCodingResponse {
  results?: GeoCodingRes[];
}

export interface SelectedLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  country_code: string;
}

export interface UnitFormats {
  temp: string;
  windSpeed: string;
  precipitation: string;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number; /*Temperature 2m above ground */
  weather_code: number; /*WMO weather code to give me an accurate weather description*/
  apparent_temperature: number;
  wind_speed_10m: number;
  precipitation: number;
}

//Returns an array of objects, one for each day
export interface DailyWeatherRaw {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
}

// One object for each day
export interface DailyWeather {
  date: string;
  dayLabel: string; // Monday
  dayShort: string; // Mon
  weather_code: number;
  temp_max: number;
  temp_min: number;
  precipitation_probability: number;
}

export interface HourlyWeatherRaw {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
}

export interface HourlyWeather {
  time: string;
  temperature_2m: number;
  weather_code: number;
}

export interface WeatherResponse {
  current: CurrentWeather;
  daily: DailyWeatherRaw;
  hourly?: HourlyWeatherRaw;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyWeather[];
}
