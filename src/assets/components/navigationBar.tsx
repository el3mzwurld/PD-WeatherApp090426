import {
  Box,
  Button,
  HStack,
  Image,
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";

// Image and Icon imports
import logo from "../img/header-logo.png";

// icons
import { CiSettings } from "react-icons/ci";

interface NavProps {
  setFormats: (
    unit: "temp" | "windSpeed" | "precipitation",
    format: string,
  ) => void;
  units: {
    temp: string;
    windSpeed: string;
    precipitation: string;
  };
}

const Nav = (props: NavProps) => {
  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      minHeight={{ base: "45px", md: "60px", xl: "80px" }}
      paddingX={{ base: 2, md: 4, xl: 8 }}
    >
      <HStack
        display={"flex"}
        gap={2}
        width={"auto"}
        maxH={{ md: "50px", xl: "60px" }}
        ml={{ base: 0, lg: 4 }}
      >
        <Image src={logo} h={"full"} w={"auto"} alt="Weather App logo" />
        <Text
          fontSize={{ base: "lg", md: "2xl", xl: "3xl" }}
          fontWeight={"semibold"}
          letterSpacing={1.5}
        >
          Weather Now
        </Text>
      </HStack>

      <UnitFormatDisplay setFormats={props.setFormats} units={props.units} />
    </Box>
  );
};

const UnitFormatDisplay = (props: NavProps) => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          className="units-dropDown"
          color={"white"}
          fontWeight={"semibold"}
          fontSize={{ base: "12px", md: "14px", xl: "16px" }}
          _focus={{ outline: "none" }}
          display={"flex"}
          gap={2.5}
        >
          <CiSettings size={20} />
          Units
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            width={"full"}
            px={2}
            py={{ base: 1.5, md: 5 }}
            mt={{ base: 2.5, lg: 5 }}
            bg={{ lg: "black", xl: "white" }}
            color={"white"}
          >
            <Menu.ItemGroup borderBottom={"1px solid gray"}>
              <Menu.ItemGroupLabel>
                Temperature
                {tempUnits.map(({ label, value }) => {
                  const isActive = props.units.temp === value;

                  return (
                    <Menu.CheckboxItem
                      key={value}
                      value={value}
                      checked={isActive}
                      onClick={() => props.setFormats("temp", value)}
                      color={"white"}
                    >
                      {label}
                      {isActive && <Menu.ItemIndicator />}
                    </Menu.CheckboxItem>
                  );
                })}
              </Menu.ItemGroupLabel>
            </Menu.ItemGroup>
            <Menu.ItemGroup borderBottom={"1px solid gray"} py={1}>
              <Menu.ItemGroupLabel>WindSpeed</Menu.ItemGroupLabel>
              {windSpeedUnits.map((unit) => {
                const isActive = props.units.windSpeed === unit.value;

                return (
                  <Menu.CheckboxItem
                    key={unit.value}
                    value={unit.value}
                    checked={isActive}
                    onClick={() => {
                      props.setFormats("windSpeed", unit.value);
                    }}
                    color={"white"}
                  >
                    {unit.label}
                    {isActive && <Menu.ItemIndicator />}
                  </Menu.CheckboxItem>
                );
              })}
            </Menu.ItemGroup>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Precipitation</Menu.ItemGroupLabel>
              {precipitationUnits.map((unit) => {
                const isActive = props.units.precipitation === unit.value;

                return (
                  <Menu.CheckboxItem
                    key={unit.value}
                    value={unit.value}
                    checked={isActive}
                    onClick={() => {
                      props.setFormats("precipitation", unit.value);
                    }}
                    color={"white"}
                  >
                    {unit.label}
                    {isActive && <Menu.ItemIndicator />}
                  </Menu.CheckboxItem>
                );
              })}
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
const tempUnits: { label: string; value: string }[] = [
  { label: "Celsius", value: "celsius" },
  { label: "Fahrenheit", value: "fahrenheit" },
];
const windSpeedUnits: { label: string; value: string }[] = [
  { label: "km/h", value: "km/h" },
  { label: "mph", value: "mph" },
];
const precipitationUnits: { label: string; value: string }[] = [
  { label: "Millimeters(mm)", value: "mm" },
  { label: "Inches(in)", value: "in" },
];

export default Nav;
