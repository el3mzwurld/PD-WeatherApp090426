import {
  Box,
  Button,
  Container,
  HStack,
  Image,
  Menu,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

// Images
import mainCompBg from "../img/images/bg-today-large.svg";
// Images....Weather icons
import iconDrizzle from "../img/images/icon-drizzle.webp";
import iconFog from "../img/images/icon-fog.webp";
import iconCloudy from "../img/images/icon-partly-cloudy.webp";
import iconRain from "../img/images/icon-rain.webp";
import iconSunny from "../img/images/icon-sunny.webp";
import iconStorm from "../img/images/icon-storm.webp";
import iconSnow from "../img/images/icon-snow.webp";

// Types
import type {
  UnitFormats,
  WeatherData,
  HourlyWeather,
  SelectedLocation,
  DailyWeather,
} from "../Types/weatherTypes";

interface LayoutProps {
  units: UnitFormats; //unit formats type, changes are handled my unitformat state in Home.tsx
  isHourlyLoading: boolean; //boolean to handle hourly weather data loading state, state is handled when the date is changed int he hourly dailyMenu
  weatherData: WeatherData | null; //Weather data type to pass weather data from Home.tsx, either containing an object, or empty
  hourlyData: HourlyWeather[]; //Hourly data type to pass hourly data, containing an array of hourly weather data each containing a time, temperature at that time and a weather code to tell us what the weather could be like at the time(sunny, rainy, windy etc.)
  selectedLocation: SelectedLocation | null; //SelectedLocation data type, passing this in will help us handle location data, each location will have a name, geolocation data(long. & lang.), a country code and a bunch of other stuff relevenat to the location data.
  onDaySelect: (date: string) => void; //helper function to immediately fetch hourly data once a location is seelcted in the daily menu
}
const Layout = ({
  units,
  isHourlyLoading,
  weatherData,
  hourlyData,
  selectedLocation,
  onDaySelect,
}: LayoutProps) => {
  return (
    <Container
      maxW={"full"}
      height={{ base: "80vh", lg: "582px", xl: "819px" }}
      paddingX={{ lg: "80px", xl: "113px" }}
      paddingY={{ lg: "44px", xl: "62px" }}
      asChild
    >
      <section>
        <HStack
          alignItems={"start"}
          justifyContent={"center"}
          gap={{ lg: 6.25, xl: 9 }}
        >
          <VStack width={"auto"} height={"auto"} alignItems={"start"} gap={5}>
            <MainStack
              units={units}
              weatherData={weatherData}
              selectedLocation={selectedLocation}
            />
            <Box
              display={"flex"}
              flexDir={"column"}
              alignItems={"start"}
              width={{ lg: "586px", xl: "800px" }}
              height={{ lg: "155px", xl: "205px" }}
              justifyContent={"space-between"}
            >
              <Text width={"auto"} asChild>
                <h2>Daily Forecast</h2>
              </Text>

              <HStack
                alignItems={"start"}
                width={"full"}
                height={"auto"}
                justifyContent={"start"}
                gap={2.5}
              >
                {weatherData
                  ? weatherData.daily.map((day, index) => (
                      <DailyForecastCard key={index} day={day} units={units} />
                    ))
                  : Array(7)
                      .fill(0)
                      .map((_, index) => (
                        <DailyForecastCard key={index} units={units} />
                      ))}
              </HStack>
            </Box>
          </VStack>
          <HourlyForecastStack
            hourlyData={hourlyData}
            isHourlyLoading={isHourlyLoading}
            onDaySelect={onDaySelect}
            units={units}
            dailyData={weatherData ? weatherData.daily : []}
          />
        </HStack>
      </section>
    </Container>
  );
};
interface MainStackProps {
  units: UnitFormats;
  weatherData: WeatherData | null;
  selectedLocation: SelectedLocation | null;
}

const MainStack = ({
  units,
  weatherData,
  selectedLocation,
}: MainStackProps) => {
  const current = weatherData?.current;

  return (
    <VStack
      width={{ lg: "566px", xl: "796px" }}
      height={{ lg: "306px", xl: "431px" }}
    >
      <Box
        width={{ lg: "566px", xl: "801px" }}
        height={{ lg: "220px", xl: "286px" }}
        backdropBlur={"blur"}
        borderRadius={{ lg: "lg", xl: "xl" }}
        position={"relative"}
        zIndex={0}
        fontFamily={"Dm sans, sans-serif"}
        overflow={"hidden"}
      >
        <Image
          position={"absolute"}
          objectFit={"cover"}
          objectPosition={"center"}
          width={"full"}
          height={"full"}
          src={mainCompBg}
          zIndex={-1}
        />
        <HStack
          width={"full"}
          position={"absolute"}
          height={"full"}
          bg={"transparent"}
          align={"center"}
          justifyContent={"space-between"}
          px={5}
        >
          <VStack color={"white"} alignItems={"start"}>
            <Text
              fontSize={{ lg: 18, xl: 20 }}
              fontWeight={600}
              fontStyle={"italic"}
              wordSpacing={1.5}
            >
              {selectedLocation ? (
                <HStack>
                  <span>{selectedLocation.name}</span>,{" "}
                  <span>{selectedLocation.country}</span>
                </HStack>
              ) : (
                "Search up a city"
              )}
            </Text>
            <Text fontSize={{ lg: 14, xl: 26 }}>
              {new Date().toDateString()}
            </Text>
          </VStack>

          <HStack>
            <Text
              fontSize={{ lg: 48, xl: 48 }}
              fontWeight={600}
              fontStyle={"italic"}
              wordSpacing={1.5}
            >
              {current ? (
                <Box>
                  {" "}
                  <span>{Math.round(current.temperature_2m)}°</span>
                  <span> {units.temp === "celsius" ? "C" : "F"}</span>
                </Box>
              ) : (
                "0°"
              )}
            </Text>
          </HStack>
        </HStack>
      </Box>
      <HStack
        alignItems={"start"}
        width={"full"}
        height={"auto"}
        justifyContent={"space-between"}
      >
        <MainForecastCard
          label="Feels like"
          value={
            weatherData ? `${weatherData.current.apparent_temperature}°` : "--"
          }
        />
        <MainForecastCard
          label="Wind"
          value={
            weatherData
              ? `${weatherData.current.wind_speed_10m} ${units.windSpeed}`
              : "--"
          }
        />{" "}
        <MainForecastCard
          label="Precipitation"
          value={
            weatherData
              ? `${weatherData.current.precipitation} ${units.precipitation}`
              : "--"
          }
        />
        <MainForecastCard label="" value={""} />
      </HStack>
    </VStack>
  );
};

interface CardProps {
  label: string;
  value: string | number;
}

const MainForecastCard = ({ label, value }: CardProps) => {
  return (
    <VStack
      width={{ lg: "129px", xl: "182px" }}
      height={{ lg: "84px", xl: "118px" }}
      bgColor={"#d5d4d93e"}
      _hover={{ bgColor: "#ebeaef3d" }}
      borderRadius={10}
      padding={"10px 10px"}
      align={"start"}
    >
      <Text fontSize={{ lg: 14, xl: 16 }}>{label}</Text>
      <Text>{value}</Text>
    </VStack>
  );
};

interface DailyProps {
  units: UnitFormats;
  day?: DailyWeather;
}
const DailyForecastCard = (props: DailyProps) => {
  return (
    <VStack
      width={{ lg: "72px", xl: "101px" }}
      height={{ lg: "118px", xl: "165px" }}
      bgColor={"#d5d4d93e"}
      _hover={{ bgColor: "#ebeaef3d" }}
      padding={"5px 5px"}
      align={"center"}
      justify={"space-between"}
      borderRadius={"md"}
    >
      {props.day && (
        <>
          <Text fontSize={13}>{props.day.dayShort}</Text>

          <Box
            display={"flex"}
            flex={1}
            w={"full"}
            h={"full"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            {props.day.weather_code < 2 && (
              <img
                src={iconSunny}
                alt=""
                style={{
                  width: "60%",
                  height: "60%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
            {props.day.weather_code >= 2 && props.day.weather_code < 45 && (
              <img
                src={iconCloudy}
                alt=""
                style={{
                  width: "60%",
                  height: "60%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
            {props.day.weather_code >= 45 && props.day.weather_code < 51 && (
              <img
                src={iconFog}
                alt=""
                style={{
                  width: "60%",
                  height: "60%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
            {props.day.weather_code >= 51 && props.day.weather_code < 61 && (
              <img
                src={iconFog}
                alt=""
                style={{
                  width: "60%",
                  height: "60%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
            {props.day.weather_code >= 61 && props.day.weather_code < 71 && (
              <img
                src={iconRain}
                alt=""
                style={{
                  width: "60%",
                  height: "60%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
            {props.day.weather_code >= 71 && props.day.weather_code < 95 && (
              <img
                src={iconSnow}
                alt=""
                style={{
                  width: "60%",
                  height: "60%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
            {props.day.weather_code >= 95 && props.day.weather_code < 100 && (
              <img
                src={iconStorm}
                alt=""
                style={{
                  width: "60%",
                  height: "60%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
          </Box>
          <HStack
            width={"full"}
            fontSize={{ lg: 12, xl: 14 }}
            alignItems={"center"}
            padding={0.5}
            justifyContent={"space-between"}
          >
            <span>{Math.round(props.day.temp_max)}°</span>
            <span>{Math.round(props.day.temp_min)}°</span>
          </HStack>
        </>
      )}
    </VStack>
  );
};

interface HourlyForecastStackProps {
  units: UnitFormats;
  hourlyData: HourlyWeather[];
  isHourlyLoading: boolean;
  dailyData: DailyWeather[];
  onDaySelect: (date: string) => void;
}
const HourlyForecastStack = ({
  units,
  hourlyData,
  isHourlyLoading,
  dailyData,
  onDaySelect,
}: HourlyForecastStackProps) => {
  const [selectedDay, setSelectedDay] = useState<DailyWeather | null>(null);
  // default day logic
  useEffect(() => {
    if (dailyData.length > 0 && !selectedDay) {
      const today = dailyData[0];
      setSelectedDay(today);
      onDaySelect(today.date);
    }
  }, [dailyData]);

  const handleDayChange = (day: DailyWeather) => {
    setSelectedDay(day);
    onDaySelect(day.date);
  };
  return (
    <VStack
      width={{ lg: "273px", xl: "384px" }}
      height={{ lg: "492px", xl: "694px" }}
      background={"#d5d4d940"}
      backdropBlur={"blur(10px)"}
      borderRadius={{ lg: "lg", xl: "xl" }}
      py={5}
      px={{ lg: 3, xl: 6 }}
      gap={{ lg: 5, xl: 8 }}
      overflow={"hidden"}
    >
      <HStack width={"full"} justifyContent={"space-between"}>
        <Text
          width={"auto"}
          fontSize={{ lg: 14, xl: 18 }}
          fontWeight={500}
          fontFamily={"dm sans ,sans-serif"}
          asChild
        >
          <p>Hourly Forecast</p>
        </Text>

        <DailyMenu
          dailyData={dailyData}
          selectedDay={selectedDay}
          onChangeDay={handleDayChange}
        />
      </HStack>

      <VStack
        width={"full"}
        minHeight={0}
        gap={{ lg: 3, xl: 8 }}
        overflowY={"scroll"}
        className="hourly-reports"
        display={"flex"}
        flex={"1 1 auto"}
      >
        {hourlyData.length > 0
          ? hourlyData.map((hour, index) => (
              <HourlyReport key={index} units={units} entry={hour} />
            ))
          : Array(24)
              .fill(0)
              .map((_, index) => <HourlyReport key={index} units={units} />)}
      </VStack>
    </VStack>
  );
};

interface HourlyReportProps {
  units: UnitFormats;
  entry?: HourlyWeather;
}

const formatHour = (timeStr: string): string => {
  const date = new Date(timeStr);
  return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
};
const HourlyReport = ({ units, entry }: HourlyReportProps) => {
  return (
    <Box
      width={"full"}
      height={{ lg: "43px", xl: "60px" }}
      opacity={1}
      bgColor={"#d5d4d917"}
      _hover={{ bgColor: "#ebeaef1f" }}
      flexShrink={0}
      borderRadius={{ lg: "md", xl: "lg" }}
      display={"flex"}
      px={3}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      {entry && (
        <>
          <HStack
            fontSize={{ lg: 13, xl: 15 }}
            color={"white"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Text width={"50px"} textAlign={"left"} pl={2}>
              {formatHour(entry.time)}
            </Text>
            {entry.weather_code < 2 && (
              <img
                src={iconSunny}
                alt=""
                style={{
                  width: "38px",
                  height: "38px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
            {entry.weather_code >= 2 && entry.weather_code < 45 && (
              <img
                src={iconCloudy}
                alt=""
                style={{
                  width: "38px",
                  height: "38px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
            {entry.weather_code >= 45 && entry.weather_code < 51 && (
              <img
                src={iconFog}
                alt=""
                style={{
                  width: "38px",
                  height: "38px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
            {entry.weather_code >= 51 && entry.weather_code < 61 && (
              <img
                src={iconFog}
                alt=""
                style={{
                  width: "38px",
                  height: "38px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
            {entry.weather_code >= 61 && entry.weather_code < 71 && (
              <img
                src={iconRain}
                alt=""
                style={{
                  width: "38px",
                  height: "38px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
            {entry.weather_code >= 71 && entry.weather_code < 95 && (
              <img
                src={iconSnow}
                alt=""
                style={{
                  width: "38px",
                  height: "38px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
            {entry.weather_code >= 95 && entry.weather_code < 100 && (
              <img
                src={iconStorm}
                alt=""
                style={{
                  width: "38px",
                  height: "38px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}
          </HStack>
          <Text
            fontSize={{ lg: 12, xl: 14 }}
            color={"white"}
            fontWeight={500}
            opacity={0.7}
          >
            {Math.round(entry.temperature_2m)}°
            <span> {units.temp === "celsius" ? "C" : "F"}</span>
          </Text>
        </>
      )}
    </Box>
  );
};

interface DailyMenuProps {
  dailyData: DailyWeather[];
  selectedDay: DailyWeather | null;
  onChangeDay: (day: DailyWeather) => void;
}
const DailyMenu = ({ dailyData, selectedDay, onChangeDay }: DailyMenuProps) => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          className="daily-dropdown"
          color={"white"}
          fontWeight={"semibold"}
          fontSize={{ base: "12px", md: "13px", xl: "16px" }}
          _focus={{ outline: "none" }}
          width={{ lg: "84px", xl: "118px" }}
          height={{ lg: "26px", xl: "37px" }}
          display={"flex"}
          gap={2.5}
        >
          {selectedDay ? selectedDay.dayLabel : "Today"}
        </Button>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content width={"full"} bgColor={"#3d3b5e"} px={5} py={2.5}>
            {dailyData.length > 0 ? (
              dailyData.map((day, index) => {
                const isActive = day.date === selectedDay?.date;

                return (
                  <Menu.CheckboxItem
                    key={index}
                    value={day.date}
                    checked={isActive}
                    onClick={() => {
                      onChangeDay(day);
                    }}
                    color={"white"}
                    _hover={{ bgColor: "none", color: "black" }}
                  >
                    {day.dayLabel}
                    {isActive && <Menu.ItemIndicator />}
                  </Menu.CheckboxItem>
                );
              })
            ) : (
              <Text px={2} py={1.5} fontSize={12} opacity={0.5} color={"white"}>
                Select a city first
              </Text>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
export default Layout;
