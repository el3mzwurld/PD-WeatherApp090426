import {
  Box,
  Button,
  Container,
  HStack,
  Menu,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import type {
  UnitFormats,
  WeatherData,
  HourlyWeather,
  SelectedLocation,
  DailyWeather,
} from "../Types/weatherTypes";

interface LayoutProps {
  units: UnitFormats;
  isHourlyLoading: boolean;
  weatherData: WeatherData | null;
  hourlyData: HourlyWeather[];
  selectedLocation: SelectedLocation | null;
  onDaySelect: (date: string) => void;
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
            <MainStack units={units} />
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
                {Array(7)
                  .fill(0)
                  .map((_, index) => (
                    <DailyForecastStack key={index} units={units} />
                  ))}
              </HStack>
            </Box>
          </VStack>
          <HourlyForecastStack units={units} />
        </HStack>
      </section>
    </Container>
  );
};

const MainStack = ({ units }: LayoutProps) => {
  return (
    <VStack
      width={{ lg: "566px", xl: "796px" }}
      height={{ lg: "306px", xl: "431px" }}
    >
      <Box
        width={{ lg: "566px", xl: "801px" }}
        height={{ lg: "203px", xl: "286px" }}
        background={"#d5d4d957"}
        backdropBlur={"blur"}
        borderRadius={{ lg: "lg", xl: "xl" }}
      ></Box>
      <HStack
        alignItems={"start"}
        width={"full"}
        height={"auto"}
        justifyContent={"space-between"}
      >
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <MainForecastCard key={index} units={units} />
          ))}
      </HStack>
    </VStack>
  );
};

const MainForecastCard = ({ units }: LayoutProps) => {
  return (
    <Box
      width={{ lg: "129px", xl: "182px" }}
      height={{ lg: "84px", xl: "118px" }}
      bgColor={"#d5d4d93e"}
      _hover={{ bgColor: "#ebeaef3d" }}
    ></Box>
  );
};
const DailyForecastStack = ({ units }: LayoutProps) => {
  return (
    <Box
      width={{ lg: "72px", xl: "101px" }}
      height={{ lg: "118px", xl: "165px" }}
      bgColor={"#d5d4d93e"}
      _hover={{ bgColor: "#ebeaef3d" }}
    ></Box>
  );
};

const HourlyForecastStack = ({ units }: LayoutProps) => {
  const [day, setDay] = useState<string | null>(null);

  useEffect(() => {
    const currentDay = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });
    setDay(currentDay);
  }, []);

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

        <DailyMenu currDay={day} setCurrDay={setDay} />
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
        {Array(24)
          .fill(0)
          .map((_, index) => (
            <HourlyReport key={index} units={units} />
          ))}
      </VStack>
    </VStack>
  );
};

const HourlyReport = ({ units }: LayoutProps) => {
  return (
    <Box
      width={"full"}
      height={{ lg: "43px", xl: "60px" }}
      opacity={0.5}
      bgColor={"#d5d4d93e"}
      _hover={{ bgColor: "#ebeaef3d" }}
      flexShrink={0}
      borderRadius={{ lg: "md", xl: "lg" }}
    ></Box>
  );
};
const DailyMenu = ({ currDay, setCurrDay }: MenuProps) => {
  const [menuOpen, isMenuOpen] = useState(false);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleDayChange = (day: string) => {
    setCurrDay(day);
  };

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
          {currDay}
        </Button>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content width={"full"} bgColor={"#3d3b5e"} px={5} py={2.5}>
            {days.map((day, index) => {
              const isActive = day === currDay;

              return (
                <Menu.CheckboxItem
                  key={index}
                  value={day}
                  checked={isActive}
                  onClick={() => {
                    handleDayChange(day);
                  }}
                  color={"white"}
                  _hover={{ bgColor: "none", color: "black" }}
                >
                  {day}
                  {isActive && <Menu.ItemIndicator />}
                </Menu.CheckboxItem>
              );
            })}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
export default Layout;
