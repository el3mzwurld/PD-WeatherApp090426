import {
  Box,
  Container,
  HStack,
  Input,
  VStack,
  Text,
  InputGroup,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

// components
import SkeletonLayout from "../components/skeletonLayout";
// Images and Icons
import Nav from "../components/navigationBar";
import { LuSearch } from "react-icons/lu";
import Layout from "../components/Layout";

// hooks and types
import useGeocoding from "../hooks/useGeoResults";
import type { GeoCodingRes, SelectedLocation } from "../Types/weatherTypes";
import useWeather from "../hooks/useWeather";
const Home = () => {
  // states
  const [unitFormats, setUnitFormats] = useState({
    temp: "celsius",
    windSpeed: "km/h",
    precipitation: "mm",
  });
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  const {
    weatherData,
    hourlyData,
    isHourlyLoading,
    isLoading,
    error,
    fetchWeather,
    fetchHourlyWeather,
  } = useWeather();
  // Helper functons
  const handleUnitFormatChange = (
    unit: "temp" | "windSpeed" | "precipitation",
    format: string,
  ) => {
    setUnitFormats((prev) => ({
      ...prev,
      [unit]: format,
    }));
  };
  const handleLocationSelection = (place: SelectedLocation) => {
    setSelectedLocation(place);
    fetchWeather(place, unitFormats);
  };
  // Watch the unitformats state, if it changes, check if the user has selected some location already, if yes? refetch weather data
  useEffect(() => {
    if (selectedLocation) {
      fetchWeather(selectedLocation, unitFormats);
    }
  }, [unitFormats]);
  return (
    <div className="home">
      <header>
        <Nav setFormats={handleUnitFormatChange} units={unitFormats} />
      </header>

      <VStack maxW={"full"} height={"auto"} asChild>
        <main>
          <VStack
            width={{ lg: "70%" }}
            height={"auto"}
            py={5}
            gap={{ base: 5, lg: 10 }}
          >
            <Text
              className="hero-para"
              fontSize={{ lg: 36, xl: 40 }}
              fontWeight={{ lg: "semibold", base: "bold" }}
            >
              How's the sky lookin today?
            </Text>

            <SearchBar onLocationSelect={handleLocationSelection} />
            {selectedLocation && (
              <Text fontSize={14} opacity={0.6}>
                Showing weather for{" "}
                <strong>
                  {selectedLocation.name}, {selectedLocation.country}
                </strong>{" "}
                ({selectedLocation.latitude.toFixed(2)},{" "}
                {selectedLocation.longitude.toFixed(2)})
              </Text>
            )}
          </VStack>

          {isLoading ? (
            <SkeletonLayout />
          ) : (
            <Layout
              units={unitFormats}
              isHourlyLoading={isHourlyLoading}
              weatherData={weatherData}
              hourlyData={hourlyData}
              selectedLocation={selectedLocation}
              onDaySelect={(date) =>
                selectedLocation &&
                fetchHourlyWeather(date, selectedLocation, unitFormats)
              }
            />
          )}
        </main>
      </VStack>
    </div>
  );
};

interface SearchBarPops {
  onLocationSelect: (location: SelectedLocation) => void;
}

const SearchBar = (props: SearchBarPops) => {
  // handle queries and changes in queries
  const [query, setQuery] = useState("");
  // Handle search modal open or close states
  const [isOpen, setIsOpen] = useState(false);
  // Geocoding hook
  const { results, isSearching, searchCities, error, clearResults } =
    useGeocoding();

  const wrapperRef = useRef<HTMLDivElement>(null);

  // handle Mouse click within search bar
  useEffect(() => {
    const handleMouseClick = (e: MouseEvent) => {
      // If user clicks outside the main container for search bar, close the search modal
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseClick);

    return () => document.removeEventListener("mousedown", handleMouseClick);
  }, []);

  // helper functions

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setQuery(value);
    setIsOpen(true);
    searchCities(value);
  };

  const handleCitySelection = (result: GeoCodingRes) => {
    // define the location data
    const location: SelectedLocation = {
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      admin1: result.admin1,
      country_code: result.country_code,
    };

    setQuery(`${result.name}, ${result.country}`);
    setIsOpen(false);
    clearResults();
    // Pass the location data to the main component, so I can actually be able to pass data around the layout component
    props.onLocationSelect(location);
  };
  const ButtonHandler = () => {
    if (results.length > 0) handleCitySelection(results[0]);
  };
  const showDropdown = isOpen && (results.length > 0 || !!error || isSearching);

  return (
    <Box ref={wrapperRef} position={"relative"}>
      <HStack>
        <InputGroup
          width={{ lg: "525px" }}
          startElement={
            isSearching ? (
              <Spinner size={"sm"} color={"purple"} />
            ) : (
              <LuSearch color="white" />
            )
          }
          bgColor={"#d5d4d93e"}
          border={"none"}
          borderRadius={10}
        >
          <Input
            placeholder="Search for cities..."
            borderRadius={10}
            _focus={{ outline: "none" }}
            _placeholder={{ color: "white", opacity: 0.5 }}
            value={query}
            onChange={handleInputChange}
            onFocus={() => results.length > 0 && setIsOpen(true)}
          />
        </InputGroup>

        <Button
          width={{ lg: "80px", base: "65px" }}
          bgColor={"#4455da"}
          color={"white"}
          disabled={results.length === 0}
          onClick={ButtonHandler}
        >
          Search
        </Button>
      </HStack>

      {showDropdown && (
        <Box
          position={"absolute"}
          top={"110%"}
          left={0}
          width={{ lg: "525px", base: "full" }}
          bgColor={"#1e1d3a"}
          borderRadius={"lg"}
          overflow={"hidden"}
          zIndex={100}
          boxShadow={"lg"}
          border={"1px solid rgba(255,255,255,0.1)"}
        >
          {error && (
            <Text px={4} py={3} fontSize={13} opacity={0.6} color={"white"}>
              {error}
            </Text>
          )}

          {results.map((result) => (
            <Box
              key={result.id}
              px={4}
              py={3}
              cursor={"pointer"}
              _hover={{ bgColor: "#2e2d4e" }}
              onClick={() => handleCitySelection(result)}
              borderBottom={"1px solid rgba(255,255,255,0.05)"}
            >
              <Text color={"white"} fontSize={14} fontWeight={500}>
                {result.name}
                {result.admin1 ? `, ${result.admin1}` : ""}
              </Text>
              <Text color={"white"} fontSize={12} opacity={0.5}>
                {result.country} · {result.latitude.toFixed(2)},{" "}
                {result.longitude.toFixed(2)}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Home;
