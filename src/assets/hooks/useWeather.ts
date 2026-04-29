import { useState } from "react";

import type {
  SelectedLocation,
  UnitFormats,
  WeatherData,
  DailyWeather,
  HourlyWeather,
  HourlyWeatherRaw,
  DailyWeatherRaw,
} from "../Types/weatherTypes";

const base_api = "https://api.open-meteo.com/v1/forecast";

// Helpers
const mapWindSpeed = (unit: string): string => {
  if (unit === "km/h") return "kmh";
  return unit;
};
const mapPrecip = (unit: string): string => {
  if (unit === "in") return "inch";
  return unit;
};
const getDayLabel = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "long" });
};
const getDayShort = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
};
const normalizeDailyData = (raw: DailyWeatherRaw): DailyWeather[] => {
  return raw.time.map((date, index) => ({
    date,
    dayLabel: getDayLabel(date),
    dayShort: getDayShort(date),
    weather_code: raw.weather_code[index],
    temp_max: raw.temperature_2m_max[index],
    temp_min: raw.temperature_2m_min[index],
    precipitation_probability: raw.precipitation_probability_max[index],
  }));
};
const normalizeHourlyData = (raw: HourlyWeatherRaw): HourlyWeather[] => {
  return raw.time.map((time, i) => ({
    time,
    temperature_2m: raw.temperature_2m[i],
    weather_code: raw.weather_code[i],
  }));
};

interface UseWeatherProps {
  weatherData: WeatherData | null;
  hourlyData: HourlyWeather[];
  isLoading: boolean;
  isHourlyLoading: boolean;
  error: string | null;
  fetchWeather: (
    Location: SelectedLocation,
    units: UnitFormats,
  ) => Promise<void>;
  fetchHourlyWeather: (
    date: string,
    location: SelectedLocation,
    units: UnitFormats,
  ) => Promise<void>;
}
const useWeather = (): UseWeatherProps => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyWeather[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHourlyLoading, setIsHourlyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //   Fetch function to get current and daily data
  const fetchWeather = async (
    location: SelectedLocation,
    units: UnitFormats,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        current:
          "temperature_2m,apparent_temperature,wind_speed_10m,precipitation,weather_code",
        daily:
          "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
        temperature_unit: units.temp,
        wind_speed_unit: mapWindSpeed(units.windSpeed),
        precipitation_unit: mapPrecip(units.precipitation),
        timezone: "auto",
        forecast_days: "7",
      });
      const response = await fetch(`${base_api}?${params}`);

      if (!response.ok) throw new Error("Failed to fetch weather data");

      const data = await response.json();

      setWeatherData({
        current: data.current,
        daily: normalizeDailyData(data.daily),
      });
    } catch (error) {
      setError("Server Error: Error loading weather data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchHourlyWeather = async (
    date: string,
    location: SelectedLocation,
    units: UnitFormats,
  ) => {
    setIsHourlyLoading(true);

    try {
      const params = new URLSearchParams({
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        hourly: "temperature_2m,weather_code",
        temperature_unit: units.temp,
        wind_speed_unit: mapWindSpeed(units.windSpeed),
        precipitation_unit: mapPrecip(units.precipitation),
        timezone: "auto",
        start_date: date,
        end_date: date,
      });

      const response = await fetch(`${base_api}?${params}`);
      if (!response.ok) throw new Error("Error fetching Hourly weather data");

      const data = await response.json();

      if (data.hourly) {
        setHourlyData(normalizeHourlyData(data.hourly));
      }
    } catch (error) {
      console.error(error);
      setError("Server Error: Unable fetch data from server");
      setHourlyData([]);
    } finally {
      setIsHourlyLoading(false);
    }
  };

  return {
    weatherData,
    hourlyData,
    isLoading,
    isHourlyLoading,
    error,
    fetchHourlyWeather,
    fetchWeather,
  };
};

export default useWeather;
