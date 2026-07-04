import { useLocation } from "react-router-dom";

export const useCountryNavigation = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const isBangladesh = pathname.startsWith("/bangladesh");
  const isPakistan = pathname.startsWith("/pakistan");
  const isUK = pathname.startsWith("/uk");
  const isMalaysia = pathname.startsWith("/malaysia");

  let navPaths = {
    home: "/",
    about: "/about",
    services: "/services",
    careers: "/careers",
    contact: "/contact",
    globalPresence: "/global-presence",
  };

  if (isBangladesh) {
    navPaths = {
      home: "/bangladesh",
      about: "/bangladesh/about",
      services: "/bangladesh/services",
      careers: "/bangladesh/careers",
      contact: "/bangladesh/contact",
      globalPresence: "/bangladesh/global-presence",
    };
  } else if (isPakistan) {
    navPaths = {
      home: "/pakistan",
      about: "/pakistan/about",
      services: "/pakistan/services",
      careers: "/pakistan/careers",
      contact: "/pakistan/contact",
      globalPresence: "/pakistan/global-presence",
    };
  } else if (isUK) {
    navPaths = {
      home: "/uk",
      about: "/uk/about",
      services: "/uk/services",
      careers: "/uk/careers",
      contact: "/uk/contact",
      globalPresence: "/uk/global-presence",
    };
  } else if (isMalaysia) {
    navPaths = {
      home: "/malaysia",
      about: "/malaysia/about",
      services: "/malaysia/services",
      careers: "/malaysia/careers",
      contact: "/malaysia/contact",
      globalPresence: "/malaysia/global-presence",
    };
  }

  return {
    isBangladesh,
    isPakistan,
    isUK,
    isMalaysia,
    navPaths,
  };
};