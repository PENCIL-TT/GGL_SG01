import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Pencil, Plus, Trash2, Globe, FileText, LayoutGrid, Save, Info, RefreshCw, Upload, PanelBottom, Briefcase, Flag, ChevronDown, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  SeoPayload,
  SeoRecord,
  createSeoRecord,
  deleteSeoRecord,
  fetchSeoRecords,
  updateSeoRecord,
} from "@/lib/seo";
import {
  fetchAboutUsRecords,
  updateAboutUsRecord,
  AboutUsRecord
} from "@/lib/aboutUs";
import {
  fetchServicesRecords,
  fetchServicesByCountry,
  updateServiceRecord,
  ServiceRecord
} from "@/lib/services";
import {
  fetchGlobalPresenceRecords,
  updateGlobalPresenceRecord,
  GlobalPresenceRecord,
  fetchGlobalPresenceOffices,
  createGlobalPresenceOffice,
  updateGlobalPresenceOffice,
  deleteGlobalPresenceOffice,
  GlobalPresenceOffice
} from "@/lib/globalPresence";
import {
  fetchQuickEnquiryRecords,
  updateQuickEnquiryRecord,
  QuickEnquiryRecord
} from "@/lib/quickEnquiry";
import {
  fetchFooterOffices,
  updateFooterOffice,
  fetchFooterGeneral,
  updateFooterGeneral,
  FooterOffice,
  FooterGeneral
} from "@/lib/footer";
import {
  fetchNavBarSettings,
  updateNavBarSettings,
  fetchAboutUsPageSettings,
  updateAboutUsPageSettings,
  NavBarSettings,
  AboutUsPageSettings
} from "@/lib/navAbout";
import {
  fetchCareersPageSettings,
  updateCareersPageSettings,
  CareersPageSettings
} from "@/lib/careers";
import {
  fetchServicesPageSettings,
  updateServicesPageSettings,
  ServicesPageSettings
} from "@/lib/servicesPage";
import {
  fetchServiceDetailsPageSettings,
  updateServiceDetailsPageSettings,
  ServiceDetailsPageSettings
} from "@/lib/serviceDetails";import {
  fetchContactPageByCountry,
  updateContactPageRecord,
  ContactPageRecord
} from "@/lib/contactPage";

const ADMIN_EMAIL = "admin@gglsingapore.com";
const ADMIN_PASSWORD = "GGLsingapore@123";
const AUTH_STORAGE_KEY = "gglsingapore-admin-authenticated";

interface FormState {
  path: string;
  title: string;
  description: string;
  keywords: string;
  extraMeta: string;
}

const emptyFormState: FormState = {
  path: "",
  title: "",
  description: "",
  keywords: "",
  extraMeta: "",
};

function parseExtraMeta(value: string): Record<string, string> | null {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmedValue);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Extra meta must be an object");
    }

    const result: Record<string, string> = {};
    Object.entries(parsed).forEach(([key, val]) => {
      if (!key) {
        return;
      }
      if (typeof val === "string") {
        result[key] = val;
      } else {
        result[key] = JSON.stringify(val);
      }
    });

    if (Object.keys(result).length === 0) {
      return null;
    }

    return result;
  } catch {
    const meta: Record<string, string> = {};
    const entries = trimmedValue
      .split(/\r?\n|,/)
      .map((entry) => entry.trim())
      .filter(Boolean);

    entries.forEach((entry) => {
      const separatorIndex = entry.indexOf("=") >= 0 ? entry.indexOf("=") : entry.indexOf(":");
      if (separatorIndex <= 0) {
        throw new Error(
          "Extra meta must be valid JSON or key/value pairs like robots=index,follow"
        );
      }

      const key = entry.slice(0, separatorIndex).trim();
      const rawValue = entry.slice(separatorIndex + 1).trim();
      if (!key) {
        throw new Error("Extra meta entries require a key before '=' or ':'");
      }
      const valueWithoutQuotes = rawValue.replace(/^"(.+)"$/s, "$1");
      meta[key] = valueWithoutQuotes;
    });

    if (Object.keys(meta).length === 0) {
      return null;
    }

    return meta;
  }
}

function formatExtraMeta(meta: Record<string, string> | null | undefined) {
  if (!meta || Object.keys(meta).length === 0) {
    return "";
  }
  return Object.entries(meta)
    .map(([key, val]) => `${key}=${val}`)
    .join("\n");
}

function formatTimestamp(value?: string | null) {
  if (!value) return "—";
  try {
    return new Intl.DateTimeFormat("en-SG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

const DEFAULT_ABOUT_US: Record<string, Omit<AboutUsRecord, "id" | "country_code" | "updated_at">> = {
  SG: {
    title: "About Us",
    content_paragraph_1: "At GGL, we are proud to be one of Singapore's leading logistics companies. We offer specialized divisions in warehousing, forwarding (air and ocean), and transportation. Our mission is to deliver comprehensive end-to-end solutions in global freight forwarding, managed through a trusted network of partners who excel in all logistics segments.",
    content_paragraph_2: "We are dedicated to fostering deep, collaborative relationships with our clients, and creating genuine partnerships that drive mutual growth. Our work goes beyond forwarding and logistics; it's about building trust with our customers by delivering world-class service and solutions.",
    image_url: "/lovable-uploads/3c0c858f-8cb2-4284-b2f7-ea7bf2b6d6df.png",
    button_text: "Learn More",
    learn_more_path: "/about"
  },
  BD: {
    title: "About Us",
    content_paragraph_1: "GGL is a trusted global leader in LCL (Less-than-Container Load) consolidation. With a robust presence across North America, the UK, the Middle East, the Indian Subcontinent, Southeast Asia, and the Far East, we offer streamlined groupage services backed by strong customer support and competitive pricing.",
    content_paragraph_2: "We are Strategically positioned in major transshipment hubs like Singapore, Malaysia, Sri Lanka, and Dubai, GGL operates direct weekly sailings to key global ports. Our expansive network ensures fast, reliable, and cost-effective consolidation options for freight forwarders and logistics providers.",
    image_url: "/lovable-uploads/14c89acc-9c64-4484-b520-f5142136ccc6.png",
    button_text: "Learn More",
    learn_more_path: "/bangladesh/about"
  },
  MY: {
    title: "About Us",
    content_paragraph_1: "GGL is a trusted global leader in LCL (Less-than-Container Load) consolidation. With a robust presence across North America, the UK, the Middle East, the Indian Subcontinent, Southeast Asia, and the Far East, we offer streamlined groupage services backed by strong customer support and competitive pricing.",
    content_paragraph_2: "We are Strategically positioned in major transshipment hubs like Singapore, Malaysia, Sri Lanka, and Dubai, GGL operates direct weekly sailings to key global ports. Our expansive network ensures fast, reliable, and cost-effective consolidation options for freight forwarders and logistics providers.",
    image_url: "/lovable-uploads/14c89acc-9c64-4484-b520-f5142136ccc6.png",
    button_text: "Learn More",
    learn_more_path: "/malaysia/about"
  },
  PK: {
    title: "About Us",
    content_paragraph_1: "GGL is a trusted global leader in LCL (Less-than-Container Load) consolidation. With a robust presence across North America, the UK, the Middle East, the Indian Subcontinent, Southeast Asia, and the Far East, we offer streamlined groupage services backed by strong customer support and competitive pricing.",
    content_paragraph_2: "We are Strategically positioned in major transshipment hubs like Singapore, Malaysia, Sri Lanka, and Dubai, GGL operates direct weekly sailings to key global ports. Our expansive network ensures fast, reliable, and cost-effective consolidation options for freight forwarders and logistics providers.",
    image_url: "/lovable-uploads/14c89acc-9c64-4484-b520-f5142136ccc6.png",
    button_text: "Learn More",
    learn_more_path: "/pakistan/about"
  },
  UK: {
    title: "About Us",
    content_paragraph_1: "GGL is a trusted global leader in logistics and consolidation. With a robust presence in the UK and across the globe, we offer streamlined services backed by strong customer support and competitive pricing.",
    content_paragraph_2: "Strategically positioned to serve the UK market, GGL connects businesses to key global ports and hubs. Our expansive network ensures fast, reliable, and cost-effective options for freight forwarders and logistics providers.",
    image_url: "/Uabout.png",
    button_text: "Learn More",
    learn_more_path: "/uk/about"
  }
};

const DEFAULT_SERVICES_FALLBACK: Record<string, Omit<ServiceRecord, "id" | "updated_at">[]> = {
  SG: [
    { country_code: 'SG', service_index: 0, title: 'Ocean Freight', description: 'GGL\'s dedicated ocean freight department specialize in the complete range freight management services for LCL and FCL loads, supported thru a well established and reliable partner network around the world, for efficient collection, storage & delivery from shippers door to door.', image_url: '/lovable-uploads/oceanfrieght.jpg', link: '/services/ocean-freight', icon_type: 'Anchor' },
    { country_code: 'SG', service_index: 1, title: 'Air Freight', description: 'At GGL, we provide a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams offer seamless air import, export, and express options, all on a convenient door-to-door basis. GGL stands out with competitive rates.', image_url: '/cargoplane.png', link: '/services/air-freight', icon_type: 'Plane' },
    { country_code: 'SG', service_index: 2, title: 'Transportation And Distribution', description: 'GGL boasts a dedicated fleet of vehicles to ensure timely domestic distribution and deliveries. Our efficient operational infrastructure provides our clients with high productivity, frequent services, and fast, reliable distribution operations. GGL is committed to delivering excellence.', image_url: '/truck12.png', link: '/services/transportation', icon_type: 'Truck' },
    { country_code: 'SG', service_index: 3, title: 'Warehousing', description: 'GGL is a premier supply chain solutions provider in Singapore, addressing the full spectrum of logistics needs for our clients. We facilitate the movement of goods from suppliers to manufacturers (for parts and components), from manufacturers and brand owners to resellers and distributors.', image_url: '/lovable-uploads/warehouse.jpg', link: '/services/warehousing', icon_type: 'Warehouse' },
    { country_code: 'SG', service_index: 4, title: 'LCL Consolidation', description: 'GGL is a LCL Consolidator with global presence covering North America, UK, Middle East, Indian Sub Continent, South East Asia and Far East. Our LCL Groupage services is backed by very efficient customer support at competitive prices.', image_url: '/lcl.png', link: '/services/lcl-consolidation', icon_type: 'Warehouse' },
    { country_code: 'SG', service_index: 5, title: 'Project Cargo', description: 'Project cargo refers to the specialized transportation of large, heavy, high-value, or complex equipment, often associated with large-scale infrastructure or construction projects.', image_url: '/projectcargo3.png', link: '/services/project-cargo', icon_type: 'Package' },
    { country_code: 'SG', service_index: 6, title: 'Liquid Transportation', description: 'We provide safe and reliable transport of liquid cargo, utilizing specialized tankers and equipment for chemical, food-grade, or hazardous liquids.', image_url: '/transports.png', link: '/services/liquid-transportation', icon_type: 'Truck' },
    { country_code: 'SG', service_index: 7, title: 'Customs Clearance', description: 'Our dedicated customs brokerage team ensures full compliance and fast clearance at all air, sea, and land border checkpoints.', image_url: '/lovable-uploads/cc.jpg', link: '/services/customs-clearance', icon_type: 'Package' }
  ],
  BD: [
    { country_code: 'BD', service_index: 0, title: 'Ocean Freight', description: 'At GGL India, we specialize in providing comprehensive ocean freight solutions that cater to the diverse needs of our clients. Whether you\'re shipping large volumes or smaller consignments, our services are designed to ensure efficiency, reliability, and cost-effectiveness', image_url: '/hom1.png', link: '/bangladesh/services/ocean-freight', icon_type: 'Anchor' },
    { country_code: 'BD', service_index: 1, title: 'LCL Consolidation', description: 'We collect your goods from your location and prepare them for consolidation. This includes proper labelling, packaging, and documentation to ensure smooth transit.', image_url: '/hom4.png', link: '/bangladesh/services/lcl-consolidation', icon_type: 'Warehouse' },
    { country_code: 'BD', service_index: 2, title: 'Transportation And Distribution', description: 'At GGL India, we understand that efficient transportation and distribution are the backbone of a seamless supply chain. Our dedicated fleet and robust infrastructure ensure that your goods reach their destination on time, every time.', image_url: '/hom3.png', link: '/bangladesh/services/transportation', icon_type: 'Truck' },
    { country_code: 'BD', service_index: 3, title: 'Warehousing', description: 'At GGL India, we offer comprehensive warehousing and third-party logistics (3PL) solutions designed to streamline your supply chain operations. Our services are tailored to meet the diverse needs of businesses, ensuring efficiency, reliability, and scalability.', image_url: '/warehosing.png', link: '/bangladesh/services/warehousing', icon_type: 'Warehouse' },
    { country_code: 'BD', service_index: 4, title: 'Air Freight', description: 'At GGL India, we offer a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams provide seamless air import, export, and express options, all on a convenient door-to-door basis.', image_url: '/aircargo1.png', link: '/bangladesh/services/air-freight', icon_type: 'Plane' },
    { country_code: 'BD', service_index: 5, title: 'Project Cargo', description: 'At GGL, we specialize in managing project cargo—the transportation of large, heavy, high-value, or complex pieces of equipment and materials essential to major infrastructure, engineering, or industrial projects.', image_url: '/cargoh1.png', link: '/bangladesh/services/project-cargo', icon_type: 'Warehouse' },
    { country_code: 'BD', service_index: 6, title: 'Liquid Transportation', description: 'At GGL, we provide safe, compliant, and efficient transport of liquid cargo, utilizing specialized tankers and equipment for chemical, food-grade, or hazardous liquids.', image_url: '/transports.png', link: '/bangladesh/services/liquid-transportation', icon_type: 'Truck' },
    { country_code: 'BD', service_index: 7, title: 'Customs Clearance', description: 'Our dedicated customs brokerage team ensures full compliance and fast clearance at all air, sea, and land border checkpoints across Bangladesh.', image_url: '/lovable-uploads/cc.jpg', link: '/bangladesh/services/customs-clearance', icon_type: 'Package' }
  ],
  MY: [
    { country_code: 'MY', service_index: 0, title: 'Ocean Freight', description: 'At GGL, we specialize in providing comprehensive ocean freight solutions that cater to the diverse needs of our clients. Whether you\'re shipping large volumes or smaller consignments, our services are designed to ensure efficiency, reliability, and cost-effectiveness', image_url: '/mocean.png', link: '/malaysia/services/ocean-freight', icon_type: 'Anchor' },
    { country_code: 'MY', service_index: 1, title: 'LCL Consolidation', description: 'We collect your goods from your location and prepare them for consolidation. This includes proper labelling, packaging, and documentation to ensure smooth transit.', image_url: '/mlcl.png', link: '/malaysia/services/lcl-consolidation', icon_type: 'Warehouse' },
    { country_code: 'MY', service_index: 2, title: 'Transportation And Distribution', description: 'At GGL, we understand that efficient transportation and distribution are the backbone of a seamless supply chain. Our dedicated fleet and robust infrastructure ensure that your goods reach their destination on time, every time.', image_url: '/mtransport.png', link: '/malaysia/services/transportation', icon_type: 'Truck' },
    { country_code: 'MY', service_index: 3, title: 'Warehousing', description: 'At GGL, we offer comprehensive warehousing and third-party logistics (3PL) solutions designed to streamline your supply chain operations. Our services are tailored to meet the diverse needs of businesses, ensuring efficiency, reliability, and scalability.', image_url: '/mwarehouse.png', link: '/malaysia/services/warehousing', icon_type: 'Warehouse' },
    { country_code: 'MY', service_index: 4, title: 'Air Freight', description: 'At GGL, we offer a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams provide seamless air import, export, and express options, all on a convenient door-to-door basis.', image_url: '/mair.png', link: '/malaysia/services/air-freight', icon_type: 'Plane' },
    { country_code: 'MY', service_index: 5, title: 'Project Cargo', description: 'At GGL, we specialize in managing project cargo—the transportation of large, heavy, high-value, or complex pieces of equipment and materials essential to major infrastructure, engineering, or industrial projects.', image_url: '/mproject.png', link: '/malaysia/services/project-cargo', icon_type: 'Warehouse' },
    { country_code: 'MY', service_index: 6, title: 'Liquid Transportation', description: 'At GGL, we provide safe, compliant, and efficient transport of liquid cargo, utilizing specialized tankers and equipment for chemical, food-grade, or hazardous liquids.', image_url: '/transports.png', link: '/malaysia/services/liquid-transportation', icon_type: 'Truck' },
    { country_code: 'MY', service_index: 7, title: 'Customs Clearance', description: 'Our dedicated customs brokerage team ensures full compliance and fast clearance at all air, sea, and land border checkpoints across Malaysia.', image_url: '/lovable-uploads/cc.jpg', link: '/malaysia/services/customs-clearance', icon_type: 'Package' }
  ],
  PK: [
    { country_code: 'PK', service_index: 0, title: 'Ocean Freight', description: 'At GGL, we specialize in providing comprehensive ocean freight solutions that cater to the diverse needs of our clients. Whether you\'re shipping large volumes or smaller consignments, our services are designed to ensure efficiency, reliability, and cost-effectiveness', image_url: '/ps1.png', link: '/pakistan/services/ocean-freight', icon_type: 'Anchor' },
    { country_code: 'PK', service_index: 1, title: 'LCL Consolidation', description: 'We collect your goods from your location and prepare them for consolidation. This includes proper labelling, packaging, and documentation to ensure smooth transit.', image_url: '/ps5.png', link: '/pakistan/services/lcl-consolidation', icon_type: 'Warehouse' },
    { country_code: 'PK', service_index: 2, title: 'Transportation And Distribution', description: 'At GGL, we understand that efficient transportation and distribution are the backbone of a seamless supply chain. Our dedicated fleet and robust infrastructure ensure that your goods reach their destination on time, every time.', image_url: '/ps3.png', link: '/pakistan/services/transportation', icon_type: 'Truck' },
    { country_code: 'PK', service_index: 3, title: 'Warehousing', description: 'At GGL, we offer comprehensive warehousing and third-party logistics (3PL) solutions designed to streamline your supply chain operations. Our services are tailored to meet the diverse needs of businesses, ensuring efficiency, reliability, and scalability.', image_url: '/ps4.png', link: '/pakistan/services/warehousing', icon_type: 'Warehouse' },
    { country_code: 'PK', service_index: 4, title: 'Air Freight', description: 'At GGL, we offer a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams provide seamless air import, export, and express options, all on a convenient door-to-door basis.', image_url: '/ps2.png', link: '/pakistan/services/air-freight', icon_type: 'Plane' },
    { country_code: 'PK', service_index: 5, title: 'Project Cargo', description: 'At GGL, we specialize in managing project cargo—the transportation of large, heavy, high-value, or complex pieces of equipment and materials essential to major infrastructure, engineering, or industrial projects.', image_url: '/ps6.png', link: '/pakistan/services/project-cargo', icon_type: 'Warehouse' },
    { country_code: 'PK', service_index: 6, title: 'Liquid Transportation', description: 'At GGL, we provide safe, compliant, and efficient transport of liquid cargo, utilizing specialized tankers and equipment for chemical, food-grade, or hazardous liquids.', image_url: '/transports.png', link: '/pakistan/services/liquid-transportation', icon_type: 'Truck' },
    { country_code: 'PK', service_index: 7, title: 'Customs Clearance', description: 'Our dedicated customs brokerage team ensures full compliance and fast clearance at all air, sea, and land border checkpoints across Pakistan.', image_url: '/lovable-uploads/cc.jpg', link: '/pakistan/services/customs-clearance', icon_type: 'Package' }
  ],
  UK: [
    { country_code: 'UK', service_index: 0, title: 'Ocean Freight', description: 'At GGL, we specialize in providing comprehensive ocean freight solutions that cater to the diverse needs of our clients. Whether you\'re shipping large volumes or smaller consignments, our services are designed to ensure efficiency, reliability, and cost-effectiveness', image_url: '/us1.png', link: '/uk/services/ocean-freight', icon_type: 'Anchor' },
    { country_code: 'UK', service_index: 1, title: 'LCL Consolidation', description: 'We collect your goods from your location and prepare them for consolidation. This includes proper labelling, packaging, and documentation to ensure smooth transit.', image_url: '/us5.png', link: '/uk/services/lcl-consolidation', icon_type: 'Warehouse' },
    { country_code: 'UK', service_index: 2, title: 'Transportation And Distribution', description: 'At GGL, we understand that efficient transportation and distribution are the backbone of a seamless supply chain. Our dedicated fleet and robust infrastructure ensure that your goods reach their destination on time, every time.', image_url: '/us3.png', link: '/uk/services/transportation', icon_type: 'Truck' },
    { country_code: 'UK', service_index: 3, title: 'Warehousing', description: 'At GGL, we offer comprehensive warehousing and third-party logistics (3PL) solutions designed to streamline your supply chain operations. Our services are tailored to meet the diverse needs of businesses, ensuring efficiency, reliability, and scalability.', image_url: '/us4.png', link: '/uk/services/warehousing', icon_type: 'Warehouse' },
    { country_code: 'UK', service_index: 4, title: 'Air Freight', description: 'At GGL, we offer a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams provide seamless air import, export, and express options, all on a convenient door-to-door basis.', image_url: '/us2.png', link: '/uk/services/air-freight', icon_type: 'Plane' },
    { country_code: 'UK', service_index: 5, title: 'Project Cargo', description: 'At GGL, we specialize in managing project cargo—the transportation of large, heavy, high-value, or complex pieces of equipment and materials essential to major infrastructure, engineering, or industrial projects.', image_url: '/us6.png', link: '/uk/services/project-cargo', icon_type: 'Warehouse' },
    { country_code: 'UK', service_index: 6, title: 'Liquid Transportation', description: 'At GGL, we provide safe, compliant, and efficient transport of liquid cargo, utilizing specialized tankers and equipment for chemical, food-grade, or hazardous liquids.', image_url: '/transports.png', link: '/uk/services/liquid-transportation', icon_type: 'Truck' },
    { country_code: 'UK', service_index: 7, title: 'Customs Clearance', description: 'Our dedicated customs brokerage team ensures full compliance and fast clearance at all air, sea, and land border checkpoints across the UK.', image_url: '/lovable-uploads/cc.jpg', link: '/uk/services/customs-clearance', icon_type: 'Package' }
  ]
};

export interface AdminCountry {
  id?: number;
  code: string;
  name: string;
  flag: string;
  link_path?: string;
}

const FALLBACK_COUNTRIES: AdminCountry[] = [
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States (USA)", flag: "🇺🇸" },
];

const getFrontendUrl = (countryCode: string, view: string, serviceSlug?: string | null) => {
  const code = countryCode.toLowerCase();
  let prefix = "";
  if (code !== "sg") {
    if (code === "bd") prefix = "/bangladesh";
    else if (code === "gb" || code === "uk") prefix = "/uk";
    else if (code === "my") prefix = "/malaysia";
    else if (code === "pk") prefix = "/pakistan";
    else {
      prefix = `/${code}`;
    }
  }

  switch (view) {
    case "seo":
      return `${prefix}/`;
    case "about-us":
      return `${prefix}/`;
    case "services":
      return `${prefix}/`;
    case "global-presence":
      return `${prefix}/global-presence`;
    case "quick-enquiry":
      return `${prefix}/`;
    case "about-us-page":
      return `${prefix}/about`;
    case "careers-page":
      return `${prefix}/careers`;
    case "services-page":
      return `${prefix}/services`;
    case "service-details":
      return `${prefix}/services/${serviceSlug || ""}`;
    default:
      return `${prefix}/`;
  }
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  });
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const [activeView, setActiveView] = useState<"seo" | "about-us" | "services" | "global-presence" | "global-presence-page" | "quick-enquiry" | "footer" | "navigation-bar" | "about-us-page" | "careers-page" | "services-page" | "service-details" | "countries-manager" | "contact-page">("seo");
  const [selectedCountry, setSelectedCountry] = useState<string>("SG");
  
  const { data: dbCountries, refetch: refetchCountries } = useQuery({
    queryKey: ["admin-countries"],
    queryFn: async (): Promise<AdminCountry[]> => {
      const res = await fetch("/api/countries");
      if (!res.ok) throw new Error("Failed to fetch countries");
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const countries = dbCountries || FALLBACK_COUNTRIES;

  // Country Manager CRUD State & Mutations
  const [countryForm, setCountryForm] = useState<Omit<AdminCountry, "id">>({
    code: "",
    name: "",
    flag: "🏳️",
    link_path: "",
  });
  const [editingCountryId, setEditingCountryId] = useState<number | null>(null);

  const createCountryMutation = useMutation({
    mutationFn: async (payload: Omit<AdminCountry, "id">) => {
      const res = await fetch("/api/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to add country");
      }
    },
    onSuccess: () => {
      refetchCountries();
      toast({ title: "Country added successfully!" });
      setCountryForm({ code: "", name: "", flag: "🏳️", link_path: "" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to add country", description: err.message, variant: "destructive" });
    }
  });

  const updateCountryMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Omit<AdminCountry, "id"> }) => {
      const res = await fetch(`/api/countries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to update country");
      }
    },
    onSuccess: () => {
      refetchCountries();
      toast({ title: "Country updated successfully!" });
      setEditingCountryId(null);
      setCountryForm({ code: "", name: "", flag: "🏳️", link_path: "" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update country", description: err.message, variant: "destructive" });
    }
  });

  const deleteCountryMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/countries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to delete country");
      }
    },
    onSuccess: () => {
      refetchCountries();
      toast({ title: "Country deleted successfully!" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to delete country", description: err.message, variant: "destructive" });
    }
  });

  const [activeServiceDetail, setActiveServiceDetail] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>(emptyFormState);
  const [editingRecord, setEditingRecord] = useState<SeoRecord | null>(null);
  const [editFormState, setEditFormState] = useState<FormState>(emptyFormState);

  // About Us form state
  const [aboutForm, setAboutForm] = useState({
    title: "",
    content_paragraph_1: "",
    content_paragraph_2: "",
    image_url: "",
    button_text: "Learn More",
    learn_more_path: "",
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAboutUsPageImage, setIsUploadingAboutUsPageImage] = useState(false);
  const [isUploadingHeroImage, setIsUploadingHeroImage] = useState(false);
  const [isUploadingSection1Image, setIsUploadingSection1Image] = useState(false);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setIsUploadingHeroImage(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload hero image");
      }

      const result = await response.json();
      if (result.url) {
        setServiceDetailsPageForm(prev => ({ ...prev, hero_image_url: result.url }));
        toast({
          title: "Hero image uploaded successfully",
          description: `Image saved at: ${result.url}`,
        });
      }
    } catch (uploadError) {
      console.error("Error uploading hero image:", uploadError);
      toast({
        title: "Upload failed",
        description: uploadError instanceof Error ? uploadError.message : "Internal Server Error",
        variant: "destructive",
      });
    } finally {
      setIsUploadingHeroImage(false);
      e.target.value = "";
    }
  };

  const handleSection1ImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setIsUploadingSection1Image(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload section image");
      }

      const result = await response.json();
      if (result.url) {
        setServiceDetailsPageForm(prev => ({ ...prev, section1_image_url: result.url }));
        toast({
          title: "Section image uploaded successfully",
          description: `Image saved at: ${result.url}`,
        });
      }
    } catch (uploadError) {
      console.error("Error uploading section image:", uploadError);
      toast({
        title: "Upload failed",
        description: uploadError instanceof Error ? uploadError.message : "Internal Server Error",
        variant: "destructive",
      });
    } finally {
      setIsUploadingSection1Image(false);
      e.target.value = "";
    }
  };

  const handleAboutUsPageImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setIsUploadingAboutUsPageImage(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      if (result.url) {
        setAboutUsPageForm(prev => ({ ...prev, image_url: result.url }));
        toast({
          title: "Image uploaded successfully",
          description: `Image saved at: ${result.url}`,
        });
      }
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError);
      toast({
        title: "Upload failed",
        description: uploadError instanceof Error ? uploadError.message : "Internal Server Error",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAboutUsPageImage(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setIsUploadingImage(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      if (result.url) {
        setAboutForm(prev => ({ ...prev, image_url: result.url }));
        toast({
          title: "Image uploaded successfully",
          description: `Image saved at: ${result.url}`,
        });
      }
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError);
      toast({
        title: "Upload failed",
        description: uploadError instanceof Error ? uploadError.message : "Internal Server Error",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
      // Reset the file input so the same file can be uploaded again if needed
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (editingRecord) {
      setEditFormState({
        path: editingRecord.path,
        title: editingRecord.title ?? "",
        description: editingRecord.description ?? "",
        keywords: editingRecord.keywords ?? "",
        extraMeta: formatExtraMeta(editingRecord.extra_meta),
      });
    }
  }, [editingRecord]);

  // Queries
  const { data: seoRecords, isLoading: isLoadingSeo, isError: isSeoError, error: seoError } = useQuery({
    queryKey: ["seo-records"],
    queryFn: fetchSeoRecords,
    enabled: isAuthenticated,
  });

  const { data: aboutUsRecords, isLoading: isLoadingAboutUs, isError: isAboutUsError, error: aboutUsError } = useQuery({
    queryKey: ["about-us-records"],
    queryFn: fetchAboutUsRecords,
    enabled: isAuthenticated,
  });

  // Populate About Us form when records are loaded or selection changes
  const activeAboutUsRecord = useMemo(() => {
    return aboutUsRecords?.find(r => r.country_code === selectedCountry);
  }, [aboutUsRecords, selectedCountry]);

  useEffect(() => {
    if (activeAboutUsRecord) {
      setAboutForm({
        title: activeAboutUsRecord.title || "",
        content_paragraph_1: activeAboutUsRecord.content_paragraph_1 || "",
        content_paragraph_2: activeAboutUsRecord.content_paragraph_2 || "",
        image_url: activeAboutUsRecord.image_url || "",
        button_text: activeAboutUsRecord.button_text || "Learn More",
        learn_more_path: activeAboutUsRecord.learn_more_path || "",
      });
    } else {
      const fallback = DEFAULT_ABOUT_US[selectedCountry];
      if (fallback) {
        setAboutForm({
          title: fallback.title,
          content_paragraph_1: fallback.content_paragraph_1,
          content_paragraph_2: fallback.content_paragraph_2,
          image_url: fallback.image_url,
          button_text: fallback.button_text,
          learn_more_path: fallback.learn_more_path,
        });
      }
    }
  }, [activeAboutUsRecord, selectedCountry]);

  // Services State and Query
  const [servicesForm, setServicesForm] = useState<Omit<ServiceRecord, "id" | "updated_at">[]>([]);

  const { data: servicesRecords, isLoading: isLoadingServices, isError: isServicesError, error: servicesError } = useQuery({
    queryKey: ["services-records"],
    queryFn: fetchServicesRecords,
    enabled: isAuthenticated,
  });

  const activeServices = useMemo(() => {
    return servicesRecords?.filter(r => r.country_code === selectedCountry) || [];
  }, [servicesRecords, selectedCountry]);

  useEffect(() => {
    if (activeServices && activeServices.length > 0) {
      const sorted = [...activeServices].sort((a, b) => a.service_index - b.service_index);
      setServicesForm(sorted.map(s => ({
        country_code: s.country_code,
        service_index: s.service_index,
        title: s.title,
        description: s.description,
        image_url: s.image_url,
        link: s.link,
        icon_type: s.icon_type
      })));
    } else {
      const fallback = DEFAULT_SERVICES_FALLBACK[selectedCountry] || [];
      setServicesForm(fallback);
    }
  }, [activeServices, selectedCountry]);

  // Global Presence State and Query
  const [gpForm, setGpForm] = useState({
    title: "",
    content_paragraph: "",
    button_text: "Explore Our Global Network",
    link_path: "",
    map_iframe_url: "",
  });

  const { data: gpRecords, isLoading: isLoadingGp, isError: isGpError, error: gpError } = useQuery({
    queryKey: ["global-presence-records"],
    queryFn: fetchGlobalPresenceRecords,
    enabled: isAuthenticated,
  });

  const activeGpRecord = useMemo(() => {
    return gpRecords?.find(r => r.country_code === selectedCountry);
  }, [gpRecords, selectedCountry]);

  useEffect(() => {
    if (activeGpRecord) {
      setGpForm({
        title: activeGpRecord.title || "",
        content_paragraph: activeGpRecord.content_paragraph || "",
        button_text: activeGpRecord.button_text || "Explore Our Global Network",
        link_path: activeGpRecord.link_path || "",
        map_iframe_url: activeGpRecord.map_iframe_url || "https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1",
      });
    } else {
      if (selectedCountry === 'MY') {
        setGpForm({
          title: 'Global Network, Local Expertise',
          content_paragraph: 'From our hubs in Malaysia, we connect you to GGL\'s extensive global network, ensuring your cargo reaches any corner of the world with the same reliability and care.',
          button_text: 'Explore Our Global Presence',
          link_path: '/malaysia/global-presence',
          map_iframe_url: "https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1",
        });
      } else {
        const lowerCode = selectedCountry.toLowerCase();
        setGpForm({
          title: 'Global Presence',
          content_paragraph: 'Our logistics network spans across continents, enabling seamless global shipping solutions.',
          button_text: 'Explore Our Global Network',
          link_path: lowerCode === 'sg' ? '/global-presence' : `/${lowerCode}/global-presence`,
          map_iframe_url: "https://www.google.com/maps/d/embed?mid=1gHiLvBql3xBjzw5wfyD2vPQ8IE4jfUE&ehbc=2E312F&noprof=1",
        });
      }
    }
  }, [activeGpRecord, selectedCountry]);

  const updateGpMutation = useMutation({
    mutationFn: (payload: Omit<GlobalPresenceRecord, "id" | "country_code">) =>
      updateGlobalPresenceRecord(selectedCountry, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["global-presence-records"] });
      toast({ title: "Global Presence updated successfully!" });
    },
    onError: (mutationError: Error) => {
      toast({
        title: "Failed to update Global Presence",
        description: mutationError.message,
        variant: "destructive",
      });
    },
  });

  // Global Presence Offices Query & Mutations
  const { data: officesRecords, refetch: refetchOffices, isLoading: isLoadingOffices } = useQuery({
    queryKey: ["global-presence-offices-records"],
    queryFn: fetchGlobalPresenceOffices,
    enabled: isAuthenticated,
  });

  const [officeForm, setOfficeForm] = useState<Omit<GlobalPresenceOffice, "id" | "updated_at">>({
    country_code: "in",
    office_country: "India",
    city_name: "",
    office_name: "",
    address: "",
    phone: "",
    email: "",
    latitude: 0,
    longitude: 0,
  });

  const [editingOfficeId, setEditingOfficeId] = useState<number | null>(null);

  const createOfficeMutation = useMutation({
    mutationFn: createGlobalPresenceOffice,
    onSuccess: () => {
      refetchOffices();
      toast({ title: "Office created successfully!" });
      // Reset form
      setOfficeForm({
        country_code: "in",
        office_country: "India",
        city_name: "",
        office_name: "",
        address: "",
        phone: "",
        email: "",
        latitude: 0,
        longitude: 0,
      });
      setEditingOfficeId(null);
    },
    onError: (err: Error) => {
      toast({ title: "Failed to create office", description: err.message, variant: "destructive" });
    }
  });

  const updateOfficeMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Omit<GlobalPresenceOffice, "id" | "updated_at"> }) =>
      updateGlobalPresenceOffice(id, payload),
    onSuccess: () => {
      refetchOffices();
      toast({ title: "Office updated successfully!" });
      setEditingOfficeId(null);
      // Reset form
      setOfficeForm({
        country_code: "in",
        office_country: "India",
        city_name: "",
        office_name: "",
        address: "",
        phone: "",
        email: "",
        latitude: 0,
        longitude: 0,
      });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update office", description: err.message, variant: "destructive" });
    }
  });

  const deleteOfficeMutation = useMutation({
    mutationFn: deleteGlobalPresenceOffice,
    onSuccess: () => {
      refetchOffices();
      toast({ title: "Office deleted successfully!" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to delete office", description: err.message, variant: "destructive" });
    }
  });

  // Quick Enquiry State and Query
  const [qeForm, setQeForm] = useState({
    title: "Quick Enquiry",
    subtitle: "Have a question? Fill out the form below and we'll get back to you shortly.",
    email_recipient: "",
    success_message: "Your enquiry has been submitted successfully. We'll contact you soon.",
    error_message: "Something went wrong. Please try again later.",
  });

  const { data: qeRecords, isLoading: isLoadingQe, isError: isQeError, error: qeError } = useQuery({
    queryKey: ["quick-enquiry-records"],
    queryFn: fetchQuickEnquiryRecords,
    enabled: isAuthenticated,
  });

  const activeQeRecord = useMemo(() => {
    return qeRecords?.find(r => r.country_code === selectedCountry);
  }, [qeRecords, selectedCountry]);

  useEffect(() => {
    if (activeQeRecord) {
      setQeForm({
        title: activeQeRecord.title || "Quick Enquiry",
        subtitle: activeQeRecord.subtitle || "",
        email_recipient: activeQeRecord.email_recipient || "",
        success_message: activeQeRecord.success_message || "Your enquiry has been submitted successfully. We'll contact you soon.",
        error_message: activeQeRecord.error_message || "Something went wrong. Please try again later.",
      });
    } else {
      setQeForm({
        title: "Quick Enquiry",
        subtitle: "Have a question? Fill out the form below and we'll get back to you shortly.",
        email_recipient: selectedCountry === 'SG' ? 'June@ggl.sg' : selectedCountry === 'BD' ? 'info.bd@ggl.sg' : selectedCountry === 'UK' ? 'Sukant@ggl.sg' : 'info.pk@ggl.sg',
        success_message: "Your enquiry has been submitted successfully. We'll contact you soon.",
        error_message: "Something went wrong. Please try again later.",
      });
    }
  }, [activeQeRecord, selectedCountry]);

  const updateQeMutation = useMutation({
    mutationFn: (payload: Omit<QuickEnquiryRecord, "id" | "country_code">) =>
      updateQuickEnquiryRecord(selectedCountry, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quick-enquiry-records"] });
      toast({ title: "Quick Enquiry configuration updated successfully!" });
    },
    onError: (mutationError: Error) => {
      toast({
        title: "Failed to update Quick Enquiry configuration",
        description: mutationError.message,
        variant: "destructive",
      });
    },
  });

  // Footer State and Query
  const [footerGeneralForm, setFooterGeneralForm] = useState<FooterGeneral>({
    about_text: "",
    facebook_url: "",
    linkedin_url: "",
  });

  const [footerOfficesForm, setFooterOfficesForm] = useState<{
    title: string;
    address: string;
    phone: string;
    email: string;
  }[]>([
    { title: "", address: "", phone: "", email: "" }
  ]);

  const { data: footerOfficesRecords, refetch: refetchFooterOffices } = useQuery({
    queryKey: ["footer-offices-records"],
    queryFn: fetchFooterOffices,
    enabled: isAuthenticated,
  });

  const { data: footerGeneralRecord, refetch: refetchFooterGeneral } = useQuery({
    queryKey: ["footer-general-record"],
    queryFn: fetchFooterGeneral,
    enabled: isAuthenticated,
  });

  // Populate General Footer Settings when loaded
  useEffect(() => {
    if (footerGeneralRecord) {
      setFooterGeneralForm({
        about_text: footerGeneralRecord.about_text || "",
        facebook_url: footerGeneralRecord.facebook_url || "",
        linkedin_url: footerGeneralRecord.linkedin_url || "",
      });
    }
  }, [footerGeneralRecord]);

  // Selected country offices list
  const activeCountryOffices = useMemo(() => {
    if (!footerOfficesRecords) return [];
    return footerOfficesRecords.filter(o => o.country_code === selectedCountry);
  }, [footerOfficesRecords, selectedCountry]);

  // Populate offices state when selectedCountry or records change
  useEffect(() => {
    const expectedSlotsCount = selectedCountry === 'MY' ? 2 : 1;
    const formSlots = [];

    for (let idx = 0; idx < expectedSlotsCount; idx++) {
      const dbRecord = activeCountryOffices.find(o => o.office_index === idx);

      if (dbRecord) {
        formSlots.push({
          title: dbRecord.title || "",
          address: dbRecord.address ? dbRecord.address.replace(/\\n/g, '\n') : "",
          phone: dbRecord.phone || "",
          email: dbRecord.email || "",
        });
      } else {
        if (selectedCountry === 'SG') {
          formSlots.push({ title: "GGL (Singapore) Pte Ltd.", address: "Blk 511 Kampong Bahru Road\n#03-01 Keppel Distripark\nSingapore - 099447", phone: "+65 69080838", email: "june@ggl.sg" });
        } else if (selectedCountry === 'BD') {
          formSlots.push({ title: "GGL (Bangladesh) Ltd.", address: "ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh", phone: "", email: "info.bd@ggl.sg" });
        } else if (selectedCountry === 'PK') {
          formSlots.push({ title: "GGL (Pakistan) - Karachi", address: "Suite No. 507 & 508, 5th Floor Fortune Center, Block-6, P.E.C.H.S, Shahrah-e-Faisal, Karachi, Pakistan.", phone: "+92 21 34542881 / +92 21 34542882 / +92 21 34542883 / +92 21 34542884", email: "info.pk@ggl.sg" });
        } else if (selectedCountry === 'UK') {
          formSlots.push({ title: "GGL (UK) Ltd.", address: "15 Woodlands Park Villas, North Gosforth , NE136PR , Newcastle Upon Tyne, United Kingdom.", phone: "+44(0)7305 856 612", email: "Sukant@ggl.sg" });
        } else if (selectedCountry === 'MY') {
          if (idx === 0) {
            formSlots.push({ title: "GGL (Malaysia) - Port Klang", address: "MTBBT 2, 3A-5, Jalan Batu Nilam 16, The Landmark (Behind AEON Mall), Bandar Bukit Tinggi 2, 41200 Klang, Selangor D.E", phone: "+603 - 3319 2778 / 74 / 75", email: "jayesh@ggl.sg" });
          } else {
            formSlots.push({ title: "GGL (Malaysia) - Pasir Gudang", address: "Unit 20-03A, Level 20 Menara Zurich, 15 Jalan Dato Abdullah Tahir, 80300 Johor Bahru", phone: "603-3319 2778 / 74 / 75, 79", email: "jayesh@ggl.sg" });
          }
        }
      }
    }

    setFooterOfficesForm(formSlots);
  }, [activeCountryOffices, selectedCountry]);

  // Mutations
  const updateFooterGeneralMutation = useMutation({
    mutationFn: updateFooterGeneral,
    onSuccess: () => {
      refetchFooterGeneral();
      toast({ title: "General Footer settings updated successfully!" });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to update General Footer settings",
        description: err.message,
        variant: "destructive",
      });
    }
  });

  const updateFooterOfficeMutation = useMutation({
    mutationFn: ({ countryCode, officeIndex, payload }: { countryCode: string, officeIndex: number, payload: any }) =>
      updateFooterOffice(countryCode, officeIndex, payload),
    onSuccess: () => {
      refetchFooterOffices();
      toast({ title: "Footer office contacts updated successfully!" });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to update Footer office contact",
        description: err.message,
        variant: "destructive",
      });
    }
  });

  const saveAllOfficesForCountry = async () => {
    try {
      for (let i = 0; i < footerOfficesForm.length; i++) {
        await updateFooterOfficeMutation.mutateAsync({
          countryCode: selectedCountry,
          officeIndex: i,
          payload: footerOfficesForm[i]
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Navigation Bar State and Query
  const [navBarForm, setNavBarForm] = useState<Omit<NavBarSettings, "id" | "updated_at">>({
    home_label: "Home",
    info_label: "Info",
    about_label: "About Us",
    careers_label: "Careers",
    services_label: "Services",
    global_presence_label: "Global Presence",
    contact_label: "Contact / Quote",
  });

  const { data: navBarRecord, refetch: refetchNavBar } = useQuery({
    queryKey: ["navbar-settings"],
    queryFn: fetchNavBarSettings,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (navBarRecord) {
      setNavBarForm({
        home_label: navBarRecord.home_label || "Home",
        info_label: navBarRecord.info_label || "Info",
        about_label: navBarRecord.about_label || "About Us",
        careers_label: navBarRecord.careers_label || "Careers",
        services_label: navBarRecord.services_label || "Services",
        global_presence_label: navBarRecord.global_presence_label || "Global Presence",
        contact_label: navBarRecord.contact_label || "Contact / Quote",
      });
    }
  }, [navBarRecord]);

  const updateNavBarMutation = useMutation({
    mutationFn: updateNavBarSettings,
    onSuccess: () => {
      refetchNavBar();
      toast({ title: "Navigation Bar labels updated successfully!" });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to update Navigation Bar labels",
        description: err.message,
        variant: "destructive",
      });
    }
  });

  // About Us Page Content State and Query (per country)
  const [aboutUsPageForm, setAboutUsPageForm] = useState<Omit<AboutUsPageSettings, "id" | "country_code" | "updated_at">>({
    hero_title: "About GGL",
    hero_subtitle: "",
    about_title: "About GGL",
    paragraph_1: "",
    paragraph_2: "",
    paragraph_3: "",
    paragraph_4: null,
    image_url: "",
    floating_card_title: "",
    floating_card_subtitle: "",
    final_paragraph: "",
  });

  const { data: aboutUsPageRecord, refetch: refetchAboutUsPage } = useQuery({
    queryKey: ["about-us-page-settings", selectedCountry],
    queryFn: () => fetchAboutUsPageSettings(selectedCountry),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (aboutUsPageRecord) {
      setAboutUsPageForm({
        hero_title: aboutUsPageRecord.hero_title || "",
        hero_subtitle: aboutUsPageRecord.hero_subtitle || "",
        about_title: aboutUsPageRecord.about_title || "",
        paragraph_1: aboutUsPageRecord.paragraph_1 || "",
        paragraph_2: aboutUsPageRecord.paragraph_2 || "",
        paragraph_3: aboutUsPageRecord.paragraph_3 || "",
        paragraph_4: aboutUsPageRecord.paragraph_4 || null,
        image_url: aboutUsPageRecord.image_url || "",
        floating_card_title: aboutUsPageRecord.floating_card_title || "",
        floating_card_subtitle: aboutUsPageRecord.floating_card_subtitle || "",
        final_paragraph: aboutUsPageRecord.final_paragraph || "",
      });
    }
  }, [aboutUsPageRecord]);

  const updateAboutUsPageMutation = useMutation({
    mutationFn: (payload: Omit<AboutUsPageSettings, "id" | "country_code" | "updated_at">) =>
      updateAboutUsPageSettings(selectedCountry, payload),
    onSuccess: () => {
      refetchAboutUsPage();
      toast({ title: "About Us page content updated successfully!" });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to update About Us page content",
        description: err.message,
        variant: "destructive",
      });
    }
  });

  // Contact Page Content State and Query (per country)
  const [contactPageForm, setContactPageForm] = useState<Omit<ContactPageRecord, "id" | "country_code" | "updated_at">>({
    title: "Get in Touch",
    subtitle: "",
    email_recipient: "June@ggl.sg",
    phone: "",
    address: "",
    map_iframe_url: "",
  });

  const { data: contactPageRecord, refetch: refetchContactPage } = useQuery({
    queryKey: ["contact-page-settings", selectedCountry],
    queryFn: () => fetchContactPageByCountry(selectedCountry),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (contactPageRecord) {
      setContactPageForm({
        title: contactPageRecord.title || "Get in Touch",
        subtitle: contactPageRecord.subtitle || "",
        email_recipient: contactPageRecord.email_recipient || "",
        phone: contactPageRecord.phone || "",
        address: contactPageRecord.address || "",
        map_iframe_url: contactPageRecord.map_iframe_url || "",
      });
    }
  }, [contactPageRecord]);

  const updateContactPageMutation = useMutation({
    mutationFn: (payload: Omit<ContactPageRecord, "id" | "country_code" | "updated_at">) =>
      updateContactPageRecord(selectedCountry, payload),
    onSuccess: () => {
      refetchContactPage();
      toast({ title: "Contact page content updated successfully!" });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to update Contact page content",
        description: err.message,
        variant: "destructive",
      });
    }
  });

  // Careers Page Content State and Query (per country)
  const [careersPageForm, setCareersPageForm] = useState<Omit<CareersPageSettings, "id" | "country_code" | "updated_at">>({
    hero_title: "Join Our Global Team",
    hero_subtitle: "",
    hero_button_text: "View Open Positions",
    why_join_title: "Why Choose GGL?",
    why_join_description: "",
    opportunities_title: "Current Opportunities",
    opportunities_description: "",
    opportunities_status: "",
    cta_title: "Ready to Start Your Journey?",
    cta_subtitle: "",
    cta_btn1_label: "Submit Your Resume",
    cta_btn2_label: "Contact HR",
  });

  const { data: careersPageRecord, refetch: refetchCareersPage } = useQuery({
    queryKey: ["careers-page-settings", selectedCountry],
    queryFn: () => fetchCareersPageSettings(selectedCountry),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (careersPageRecord) {
      setCareersPageForm({
        hero_title: careersPageRecord.hero_title || "",
        hero_subtitle: careersPageRecord.hero_subtitle || "",
        hero_button_text: careersPageRecord.hero_button_text || "View Open Positions",
        why_join_title: careersPageRecord.why_join_title || "",
        why_join_description: careersPageRecord.why_join_description || "",
        opportunities_title: careersPageRecord.opportunities_title || "",
        opportunities_description: careersPageRecord.opportunities_description || "",
        opportunities_status: careersPageRecord.opportunities_status || "",
        cta_title: careersPageRecord.cta_title || "",
        cta_subtitle: careersPageRecord.cta_subtitle || "",
        cta_btn1_label: careersPageRecord.cta_btn1_label || "Submit Your Resume",
        cta_btn2_label: careersPageRecord.cta_btn2_label || "Contact HR",
      });
    }
  }, [careersPageRecord]);

  const updateCareersPageMutation = useMutation({
    mutationFn: (payload: Omit<CareersPageSettings, "id" | "country_code" | "updated_at">) =>
      updateCareersPageSettings(selectedCountry, payload),
    onSuccess: () => {
      refetchCareersPage();
      toast({ title: "Careers page content updated successfully!" });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to update Careers page content",
        description: err.message,
        variant: "destructive",
      });
    }
  });

  // Services Page Content State and Query (per country)
  const [servicesPageForm, setServicesPageForm] = useState<Omit<ServicesPageSettings, "id" | "country_code" | "updated_at">>({
    hero_title: "Our Logistics Services",
    hero_subtitle: "",
    services_title: "All Services",
    services_description: "",
    why_choose_title: "Why Choose Our Logistics Services?",
    why_choose_description: "",
    cta_btn_text: "Request a Quote",
  });

  const { data: servicesPageRecord, refetch: refetchServicesPage } = useQuery({
    queryKey: ["services-page-settings", selectedCountry],
    queryFn: () => fetchServicesPageSettings(selectedCountry),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (servicesPageRecord) {
      setServicesPageForm({
        hero_title: servicesPageRecord.hero_title || "",
        hero_subtitle: servicesPageRecord.hero_subtitle || "",
        services_title: servicesPageRecord.services_title || "All Services",
        services_description: servicesPageRecord.services_description || "",
        why_choose_title: servicesPageRecord.why_choose_title || "",
        why_choose_description: servicesPageRecord.why_choose_description || "",
        cta_btn_text: servicesPageRecord.cta_btn_text || "Request a Quote",
      });
    }
  }, [servicesPageRecord]);

  const updateServicesPageMutation = useMutation({
    mutationFn: (payload: Omit<ServicesPageSettings, "id" | "country_code" | "updated_at">) =>
      updateServicesPageSettings(selectedCountry, payload),
    onSuccess: () => {
      refetchServicesPage();
      toast({ title: "Services page content updated successfully!" });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to update Services page content",
        description: err.message,
        variant: "destructive",
      });
    }
  });

  // Service Details Page Content State and Query (per country and service)
  const [serviceDetailsPageForm, setServiceDetailsPageForm] = useState<Omit<ServiceDetailsPageSettings, "id" | "country_code" | "service_slug" | "updated_at">>({
    hero_title: "",
    hero_subtitle: "",
    hero_image_url: "",
    section1_title: "",
    section1_content: "",
    section1_image_url: "",
    features_title: "",
    features_list: [],
    cta_title: "",
    cta_button_text: "",
    cta_button_link: "",
  });

  const { data: serviceDetailsPageRecord, refetch: refetchServiceDetailsPage, isLoading: isLoadingServiceDetails } = useQuery({
    queryKey: ["service-details-page-settings", selectedCountry, activeServiceDetail],
    queryFn: () => fetchServiceDetailsPageSettings(selectedCountry, activeServiceDetail!),
    enabled: isAuthenticated && !!activeServiceDetail,
  });

  useEffect(() => {
    if (serviceDetailsPageRecord) {
      setServiceDetailsPageForm({
        hero_title: serviceDetailsPageRecord.hero_title || "",
        hero_subtitle: serviceDetailsPageRecord.hero_subtitle || "",
        hero_image_url: serviceDetailsPageRecord.hero_image_url || "",
        section1_title: serviceDetailsPageRecord.section1_title || "",
        section1_content: serviceDetailsPageRecord.section1_content || "",
        section1_image_url: serviceDetailsPageRecord.section1_image_url || "",
        features_title: serviceDetailsPageRecord.features_title || "",
        features_list: serviceDetailsPageRecord.features_list || [],
        cta_title: serviceDetailsPageRecord.cta_title || "",
        cta_button_text: serviceDetailsPageRecord.cta_button_text || "",
        cta_button_link: serviceDetailsPageRecord.cta_button_link || "",
      });
    } else {
      // Reset or set to default when no record is found
      setServiceDetailsPageForm({
        hero_title: "",
        hero_subtitle: "",
        hero_image_url: "",
        section1_title: "",
        section1_content: "",
        section1_image_url: "",
        features_title: "",
        features_list: [],
        cta_title: "",
        cta_button_text: "",
        cta_button_link: "",
      });
    }
  }, [serviceDetailsPageRecord]);

  const updateServiceDetailsPageMutation = useMutation({
    mutationFn: (payload: Omit<ServiceDetailsPageSettings, "id" | "country_code" | "service_slug" | "updated_at">) =>
      updateServiceDetailsPageSettings(selectedCountry, activeServiceDetail!, payload),
    onSuccess: () => {
      refetchServiceDetailsPage();
      toast({ title: "Service detail page content updated successfully!" });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to update service detail page content",
        description: err.message,
        variant: "destructive",
      });
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: SeoPayload) => createSeoRecord(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-records"] });
      toast({ title: "SEO entry created" });
      setFormState(emptyFormState);
    },
    onError: (mutationError: Error) => {
      toast({
        title: "Failed to create entry",
        description: mutationError.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SeoPayload }) =>
      updateSeoRecord(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-records"] });
      toast({ title: "SEO entry updated" });
      setEditingRecord(null);
    },
    onError: (mutationError: Error) => {
      toast({
        title: "Failed to update entry",
        description: mutationError.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteSeoRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-records"] });
      toast({ title: "SEO entry deleted" });
    },
    onError: (mutationError: Error) => {
      toast({
        title: "Failed to delete entry",
        description: mutationError.message,
        variant: "destructive",
      });
    },
  });

  const updateAboutUsMutation = useMutation({
    mutationFn: (payload: Omit<AboutUsRecord, "id" | "country_code">) =>
      updateAboutUsRecord(selectedCountry, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-us-records"] });
      toast({ title: "About Us section updated successfully!" });
    },
    onError: (mutationError: Error) => {
      toast({
        title: "Failed to update About Us content",
        description: mutationError.message,
        variant: "destructive",
      });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ countryCode, serviceIndex, payload }: {
      countryCode: string;
      serviceIndex: number;
      payload: Omit<ServiceRecord, "id" | "country_code" | "service_index" | "updated_at">
    }) => updateServiceRecord(countryCode, serviceIndex, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services-records"] });
      toast({
        title: "Service saved successfully",
        description: "The service card content has been updated.",
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to save service",
        description: err instanceof Error ? err.message : "Error saving to database",
        variant: "destructive",
      });
    }
  });

  const sortedRecords = useMemo(() => {
    if (!seoRecords) return [];
    return [...seoRecords].sort((a, b) => a.path.localeCompare(b.path));
  }, [seoRecords]);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      credentials.email.trim().toLowerCase() === ADMIN_EMAIL &&
      credentials.password === ADMIN_PASSWORD
    ) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
      }
      toast({ title: "Welcome back" });
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please check your email and password.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    toast({ title: "Signed out" });
  };

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const extra_meta = parseExtraMeta(formState.extraMeta);
      const payload: SeoPayload = {
        path: formState.path.trim(),
        title: formState.title.trim() || undefined,
        description: formState.description.trim() || undefined,
        keywords: formState.keywords.trim() || undefined,
        extra_meta,
      };
      if (!payload.path) {
        throw new Error("Path is required");
      }
      createMutation.mutate(payload);
    } catch (mutationError) {
      toast({
        title: "Unable to create entry",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Please check the provided details.",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingRecord) return;

    try {
      const extra_meta = parseExtraMeta(editFormState.extraMeta);
      const payload: SeoPayload = {
        path: editFormState.path.trim(),
        title: editFormState.title.trim() || undefined,
        description: editFormState.description.trim() || undefined,
        keywords: editFormState.keywords.trim() || undefined,
        extra_meta,
      };
      if (!payload.path) {
        throw new Error("Path is required");
      }
      updateMutation.mutate({ id: editingRecord.id, payload });
    } catch (mutationError) {
      toast({
        title: "Unable to update entry",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Please check the provided details.",
        variant: "destructive",
      });
    }
  };

  const handleAboutUsSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateAboutUsMutation.mutate(aboutForm);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] p-4 admin-theme">
        <Card className="w-full max-w-md border-slate-200 bg-white text-slate-900 shadow-xl rounded-2xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <span className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
                <LayoutGrid className="h-6 w-6" />
              </span>
            </div>
            <CardTitle className="text-2xl text-center font-bold tracking-tight">GGL Admin Panel</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Sign in to manage SEO and website content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gglsingapore.com"
                  className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500"
                  autoComplete="username"
                  value={credentials.email}
                  onChange={(event) =>
                    setCredentials((prev) => ({ ...prev, email: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500"
                  autoComplete="current-password"
                  value={credentials.password}
                  onChange={(event) =>
                    setCredentials((prev) => ({ ...prev, password: event.target.value }))
                  }
                  required
                />
              </div>
              <Button className="w-full bg-amber-500 text-slate-950 font-semibold hover:bg-amber-600 transition-all mt-6" type="submit">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 font-sans admin-theme">
      {/* Sidebar Panel */}
      <aside className="w-64 border-r border-slate-200 bg-white text-slate-700 flex flex-col justify-between p-5 flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-200">
            <span className="rounded-lg bg-amber-500/10 p-2 text-amber-500 shadow-inner">
              <LayoutGrid className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-extrabold text-slate-950 leading-tight tracking-wide">GGL Singapore</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600">Admin Control</span>
            </div>
          </div>

          <nav className="space-y-4">
            {/* Section: Pages */}
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 px-2 block mb-1">
                Pages
              </Label>

              {/* Global Country Switcher */}
              <div className="px-2 pb-2 mb-1 border-b border-slate-200 space-y-2">
                <Label className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">Switch Country</Label>
                <div className="relative">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none cursor-pointer"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>

                {/* Dynamic View Frontend Link */}
                <div className="pt-1">
                  <a
                    href={
                      countries.find(c => c.code === selectedCountry)?.link_path ||
                      getFrontendUrl(selectedCountry, activeView, activeServiceDetail)
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition-all duration-200"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    View Frontend Page ↗
                  </a>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveView("about-us-page");
                  setActiveServiceDetail(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeView === "about-us-page"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Info className="h-4 w-4" />
                About Us Page
              </button>

              <button
                onClick={() => {
                  setActiveView("services-page");
                  setActiveServiceDetail(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeView === "services-page"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Services Page
              </button>

              <button
                onClick={() => {
                  setActiveView("global-presence-page");
                  setActiveServiceDetail(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeView === "global-presence-page"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Globe className="h-4 w-4" />
                Global Presence Page
              </button>

              <button
                onClick={() => {
                  setActiveView("service-details");
                  if (!activeServiceDetail) {
                    setActiveServiceDetail("ocean-freight");
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeView === "service-details"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <FileText className="h-4 w-4" />
                Service Details Pages
              </button>
              {activeView === "service-details" && (
                <div className="pl-6 border-l-2 border-amber-500/30 ml-5 space-y-1 py-1.5">
                  <button
                    onClick={() => {
                      setActiveView("service-details");
                      setActiveServiceDetail("ocean-freight");
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeServiceDetail === 'ocean-freight' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    Ocean Freight Page
                  </button>
                  <button
                    onClick={() => {
                      setActiveView("service-details");
                      setActiveServiceDetail("air-freight");
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeServiceDetail === 'air-freight' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    Air Freight Page
                  </button>
                  <button
                    onClick={() => {
                      setActiveView("service-details");
                      setActiveServiceDetail("transportation");
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeServiceDetail === 'transportation' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    Transportation Page
                  </button>
                  <button
                    onClick={() => {
                      setActiveView("service-details");
                      setActiveServiceDetail("warehousing");
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeServiceDetail === 'warehousing' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    Warehousing Page
                  </button>
                  <button
                    onClick={() => {
                      setActiveView("service-details");
                      setActiveServiceDetail("lcl-consolidation");
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeServiceDetail === 'lcl-consolidation' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    LCL Consolidation Page
                  </button>
                  <button
                    onClick={() => {
                      setActiveView("service-details");
                      setActiveServiceDetail("project-cargo");
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeServiceDetail === 'project-cargo' ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    Project Cargo Page
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setActiveView("careers-page");
                  setActiveServiceDetail(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeView === "careers-page"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Briefcase className="h-4 w-4" />
                Careers Page
              </button>

              <button
                onClick={() => {
                  setActiveView("contact-page");
                  setActiveServiceDetail(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeView === "contact-page"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Phone className="h-4 w-4" />
                Contact Page
              </button>
            </div>

            {/* Section: Components */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <Label className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 px-2 block mb-1">
                Components
              </Label>

              <button
                onClick={() => {
                  setActiveView("about-us");
                  setActiveServiceDetail(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeView === "about-us"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <FileText className="h-4 w-4" />
                About Us Sections
              </button>

              <button
                onClick={() => {
                  setActiveView("services");
                  setActiveServiceDetail(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeView === "services"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Services Sections
              </button>

              <button
                onClick={() => {
                  setActiveView("global-presence");
                  setActiveServiceDetail(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeView === "global-presence"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Globe className="h-4 w-4" />
                Global Presence
              </button>

              <button
                onClick={() => {
                  setActiveView("quick-enquiry");
                  setActiveServiceDetail(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeView === "quick-enquiry"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <FileText className="h-4 w-4" />
                Quick Enquiry
              </button>

              <button
                onClick={() => {
                  setActiveView("navigation-bar");
                  setActiveServiceDetail(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeView === "navigation-bar"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                Navigation Bar
              </button>

              <button
                onClick={() => {
                  setActiveView("footer");
                  setActiveServiceDetail(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeView === "footer"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <PanelBottom className="h-4 w-4" />
                Footer Settings
              </button>
            </div>

            {/* Section: System Settings */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <Label className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 px-2 block mb-1">
                System & Config
              </Label>

              <button
                onClick={() => {
                  setActiveView("seo");
                  setActiveServiceDetail(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeView === "seo"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Globe className="h-4 w-4" />
                SEO Metadata
              </button>

              <button
                onClick={() => {
                  setActiveView("countries-manager");
                  setActiveServiceDetail(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeView === "countries-manager"
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <Flag className="h-4 w-4" />
                Manage Countries
              </button>
            </div>
          </nav>
        </div>

        <div className="border-t border-slate-200 pt-4 space-y-3">
          <div className="px-2">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Logged in as</p>
            <p className="text-xs text-slate-800 font-bold truncate mt-0.5" title={ADMIN_EMAIL}>
              {ADMIN_EMAIL}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start border-slate-200 bg-white text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
        {activeView === "seo" ? (
          <div className="space-y-6">
            <header className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">SEO Metadata Manager</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Manage title tags, keywords, descriptions, and custom meta tags for every page.
                </p>
              </div>
            </header>

            {/* Create SEO Entry Form */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Create new SEO entry</CardTitle>
                <CardDescription>
                  Provide the page URL path and associated metadata tags to configure dynamic head tags.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4" onSubmit={handleCreate}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="path">Page path</Label>
                      <Input
                        id="path"
                        placeholder="/services/air-freight"
                        value={formState.path}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, path: event.target.value }))
                        }
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keywords">Keywords</Label>
                      <Input
                        id="keywords"
                        placeholder="logistics, shipping, Singapore"
                        value={formState.keywords}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, keywords: event.target.value }))
                        }
                        className="bg-white border-slate-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title tag</Label>
                    <Input
                      id="title"
                      placeholder="GGL Singapore | Reliable B2B Logistics Partner"
                      value={formState.title}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, title: event.target.value }))
                      }
                      className="bg-white border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Meta description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a concise summary of the page content for search result snippets..."
                      rows={3}
                      value={formState.description}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, description: event.target.value }))
                      }
                      className="bg-white border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="extraMeta">Extra custom meta tags (JSON or key=value)</Label>
                    <Textarea
                      id="extraMeta"
                      placeholder={'og:type=website\nrobots=index,follow'}
                      rows={3}
                      value={formState.extraMeta}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, extraMeta: event.target.value }))
                      }
                      className="bg-white border-slate-200 font-mono text-sm"
                    />
                    <p className="text-xs text-slate-500">
                      Examples: <code>og:image=/og-image.png</code>. Put each pair on a new line.
                    </p>
                  </div>
                  <CardFooter className="px-0 pt-2 pb-0 flex justify-end">
                    <Button disabled={createMutation.isPending} type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-sm">
                      {createMutation.isPending && (
                        <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      )}
                      <Plus className="mr-2 h-4 w-4" />
                      Create SEO Entry
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>

            {/* List Table of SEO entries */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Existing SEO entries</CardTitle>
                <CardDescription>
                  {isLoadingSeo
                    ? "Loading entries from remote MySQL..."
                    : isSeoError
                      ? seoError instanceof Error
                        ? seoError.message
                        : "Unable to load entries"
                      : `Total configured paths: ${sortedRecords.length}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto p-0">
                <Table>
                  <TableHeader className="bg-slate-100/50">
                    <TableRow>
                      <TableHead className="min-w-[160px] font-semibold text-slate-700">Path</TableHead>
                      <TableHead className="min-w-[180px] font-semibold text-slate-700">Title Tag</TableHead>
                      <TableHead className="font-semibold text-slate-700">Description</TableHead>
                      <TableHead className="min-w-[180px] font-semibold text-slate-700">Keywords</TableHead>
                      <TableHead className="min-w-[120px] font-semibold text-slate-700">Updated At</TableHead>
                      <TableHead className="min-w-[150px] text-right font-semibold text-slate-700 pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!sortedRecords.length && !isLoadingSeo ? (
                      <TableRow>
                        <TableCell className="py-10 text-center text-slate-500" colSpan={6}>
                          No SEO records exist in MySQL. Create one above to get started.
                        </TableCell>
                      </TableRow>
                    ) : null}
                    {sortedRecords.map((record) => (
                      <TableRow key={record.id} className="hover:bg-slate-50/70">
                        <TableCell className="font-semibold text-slate-900">{record.path}</TableCell>
                        <TableCell className="text-slate-800 text-sm">{record.title ?? "—"}</TableCell>
                        <TableCell className="max-w-xs text-xs text-slate-600 line-clamp-3 my-2.5">
                          {record.description ?? "—"}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {record.keywords ?? "—"}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {formatTimestamp(record.updated_at)}
                        </TableCell>
                        <TableCell className="text-right gap-2 pr-6">
                          <div className="inline-flex gap-2">
                            <Dialog open={editingRecord?.id === record.id} onOpenChange={(open) => open ? setEditingRecord(record) : setEditingRecord(null)}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-100">
                                  <Pencil className="mr-1 h-3.5 w-3.5" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl bg-white">
                                <DialogHeader>
                                  <DialogTitle>Edit SEO entry</DialogTitle>
                                  <DialogDescription>
                                    Update the SEO metadata configurations for path: <span className="font-mono font-semibold text-slate-900">{record.path}</span>.
                                  </DialogDescription>
                                </DialogHeader>
                                <form className="grid gap-4 mt-2" onSubmit={handleUpdate}>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-path">Page path</Label>
                                    <Input
                                      id="edit-path"
                                      value={editFormState.path}
                                      onChange={(event) =>
                                        setEditFormState((prev) => ({
                                          ...prev,
                                          path: event.target.value,
                                        }))
                                      }
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-title">Title tag</Label>
                                    <Input
                                      id="edit-title"
                                      value={editFormState.title}
                                      onChange={(event) =>
                                        setEditFormState((prev) => ({
                                          ...prev,
                                          title: event.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-description">Meta description</Label>
                                    <Textarea
                                      id="edit-description"
                                      rows={3}
                                      value={editFormState.description}
                                      onChange={(event) =>
                                        setEditFormState((prev) => ({
                                          ...prev,
                                          description: event.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-keywords">Keywords</Label>
                                    <Input
                                      id="edit-keywords"
                                      value={editFormState.keywords}
                                      onChange={(event) =>
                                        setEditFormState((prev) => ({
                                          ...prev,
                                          keywords: event.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-extraMeta">
                                      Extra custom meta tags (JSON or key=value)
                                    </Label>
                                    <Textarea
                                      id="edit-extraMeta"
                                      rows={3}
                                      value={editFormState.extraMeta}
                                      onChange={(event) =>
                                        setEditFormState((prev) => ({
                                          ...prev,
                                          extraMeta: event.target.value,
                                        }))
                                      }
                                      className="font-mono text-sm"
                                    />
                                  </div>
                                  <DialogFooter className="gap-2 sm:justify-between border-t border-slate-100 pt-4 mt-2">
                                    <div className="text-xs text-slate-500 flex items-center">
                                      Last updated {formatTimestamp(record.updated_at)}
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setEditingRecord(null)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button disabled={updateMutation.isPending} type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold">
                                        {updateMutation.isPending && (
                                          <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        )}
                                        Save changes
                                      </Button>
                                    </div>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={deleteMutation.isPending}
                                  className="shadow-sm"
                                >
                                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                                  Delete
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-white">
                                <DialogHeader>
                                  <DialogTitle>Delete entry</DialogTitle>
                                  <DialogDescription>
                                    This action cannot be undone. This will permanently remove the custom SEO configurations for path: <span className="font-mono font-semibold text-slate-900">{record.path}</span>.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="gap-2 pt-4">
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button
                                      variant="destructive"
                                      onClick={() => deleteMutation.mutate(record.id)}
                                    >
                                      Delete Record
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : activeView === "about-us" ? (
          <div className="space-y-6">
            <header className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Home Page About Us Sections</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Edit the content, buttons, paths, and images in the Home Page "About Us" sections for all country domains.
                </p>
              </div>
            </header>

            {/* Country Selector Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60 max-w-max">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedCountry === country.code
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>

            {/* Edit Content Form */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Edit Content for {countries.find(c => c.code === selectedCountry)?.name} ({selectedCountry})
                  </CardTitle>
                  <CardDescription>
                    These changes are stored in Hostinger MySQL database and affect the Home Page directly.
                  </CardDescription>
                </div>
                {isLoadingAboutUs && (
                  <RefreshCw className="h-5 w-5 animate-spin text-slate-400" />
                )}
              </CardHeader>
              <CardContent>
                {isAboutUsError && (
                  <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
                    Failed to connect to MySQL database: {aboutUsError instanceof Error ? aboutUsError.message : "Database offline"}.
                    <p className="font-semibold mt-1">Note: Using default prefilled content as fallback.</p>
                  </div>
                )}
                
                <form className="space-y-5" onSubmit={handleAboutUsSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="about-title">Section Header Title</Label>
                      <Input
                        id="about-title"
                        value={aboutForm.title}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="About Us"
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about-image">Image URL / Path</Label>
                      <div className="flex gap-2">
                        <Input
                          id="about-image"
                          value={aboutForm.image_url}
                          onChange={(e) => setAboutForm(prev => ({ ...prev, image_url: e.target.value }))}
                          placeholder="/lovable-uploads/3c0c858f-8cb2-4284-b2f7-ea7bf2b6d6df.png"
                          required
                          className="bg-white border-slate-200 flex-grow"
                        />
                        <div className="relative flex-shrink-0">
                          <input
                            type="file"
                            id="image-file-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => document.getElementById("image-file-upload")?.click()}
                            disabled={isUploadingImage}
                            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 h-10 px-3 flex items-center gap-1.5 font-semibold text-xs"
                          >
                            {isUploadingImage ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Upload className="h-3.5 w-3.5" />
                            )}
                            {isUploadingImage ? "Uploading..." : "Upload Image"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about-content1">Content Paragraph 1</Label>
                    <Textarea
                      id="about-content1"
                      value={aboutForm.content_paragraph_1}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, content_paragraph_1: e.target.value }))}
                      placeholder="Enter the first paragraph here..."
                      rows={5}
                      required
                      className="bg-white border-slate-200 leading-relaxed text-slate-700 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about-content2">Content Paragraph 2</Label>
                    <Textarea
                      id="about-content2"
                      value={aboutForm.content_paragraph_2}
                      onChange={(e) => setAboutForm(prev => ({ ...prev, content_paragraph_2: e.target.value }))}
                      placeholder="Enter the second paragraph here..."
                      rows={5}
                      required
                      className="bg-white border-slate-200 leading-relaxed text-slate-700 text-sm"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="about-btn-text">Button Label</Label>
                      <Input
                        id="about-btn-text"
                        value={aboutForm.button_text}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, button_text: e.target.value }))}
                        placeholder="Learn More"
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about-btn-path">Learn More Route Path</Label>
                      <Input
                        id="about-btn-path"
                        value={aboutForm.learn_more_path}
                        onChange={(e) => setAboutForm(prev => ({ ...prev, learn_more_path: e.target.value }))}
                        placeholder="/about"
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  <CardFooter className="px-0 pt-4 pb-0 flex justify-between items-center border-t border-slate-100 mt-6">
                    <div className="text-xs text-slate-500">
                      {activeAboutUsRecord?.updated_at ? (
                        <span>Last updated in Hostinger MySQL: {formatTimestamp(activeAboutUsRecord.updated_at)}</span>
                      ) : (
                        <span>Currently using local fallback. Press Save to store in Remote MySQL.</span>
                      )}
                    </div>
                    <Button disabled={updateAboutUsMutation.isPending} type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-sm">
                      {updateAboutUsMutation.isPending && (
                        <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>


          </div>
        ) : activeView === "services" ? (
          <div className="space-y-6">
            <header className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Home Page Services Sections</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Edit the 6 service cards displayed in the Home Page "Our Core Services" section for each country domain.
                </p>
              </div>
            </header>

            {/* Country Selector Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60 max-w-max">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedCountry === country.code
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>

            {isServicesError && (
              <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
                Failed to connect to MySQL database: {servicesError instanceof Error ? servicesError.message : "Database offline"}.
                <p className="font-semibold mt-1">Note: Using default prefilled content as fallback.</p>
              </div>
            )}

            {/* Edit 6 Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesForm.map((service, index) => {
                const handleFieldChange = (field: keyof typeof service, value: string | number) => {
                  setServicesForm(prev => {
                    const next = [...prev];
                    next[index] = { ...next[index], [field]: value };
                    return next;
                  });
                };

                const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("image", file);

                  toast({
                    title: "Uploading image...",
                    description: "Please wait while image is being saved.",
                  });

                  try {
                    const response = await fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                    });

                    if (!response.ok) {
                      throw new Error("Failed to upload image");
                    }

                    const result = await response.json();
                    if (result.url) {
                      handleFieldChange("image_url", result.url);
                      toast({
                        title: "Image uploaded successfully",
                        description: `Saved at: ${result.url}`,
                      });
                    }
                  } catch (err) {
                    console.error("Error uploading image:", err);
                    toast({
                      title: "Upload failed",
                      description: err instanceof Error ? err.message : "Unknown error",
                      variant: "destructive",
                    });
                  }
                };

                const handleSaveCard = (e: React.FormEvent) => {
                  e.preventDefault();
                  updateServiceMutation.mutate({
                    countryCode: selectedCountry,
                    serviceIndex: service.service_index,
                    payload: {
                      title: service.title,
                      description: service.description,
                      image_url: service.image_url,
                      link: service.link,
                      icon_type: service.icon_type
                    }
                  });
                };

                return (
                  <Card key={index} className="border-slate-200 shadow-sm flex flex-col justify-between">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#f6b100] text-white flex items-center justify-center text-xs font-semibold">
                            {service.service_index + 1}
                          </span>
                          {service.title || "Untitled Service"}
                        </CardTitle>
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Index {service.service_index}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor={`service-${index}-title`} className="text-xs">Title</Label>
                          <Input
                            id={`service-${index}-title`}
                            value={service.title}
                            onChange={(e) => handleFieldChange("title", e.target.value)}
                            required
                            className="bg-white border-slate-200 text-sm h-9"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor={`service-${index}-icon`} className="text-xs">Icon Class</Label>
                          <select
                            id={`service-${index}-icon`}
                            value={service.icon_type}
                            onChange={(e) => handleFieldChange("icon_type", e.target.value)}
                            className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm h-9 focus:border-slate-400 focus:ring-slate-400"
                          >
                            <option value="Anchor">Anchor (Ocean)</option>
                            <option value="Plane">Plane (Air)</option>
                            <option value="Truck">Truck (Transport)</option>
                            <option value="Warehouse">Warehouse (Storage)</option>
                            <option value="Package">Package (Cargo)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor={`service-${index}-image`} className="text-xs">Image URL / Path</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`service-${index}-image`}
                            value={service.image_url}
                            onChange={(e) => handleFieldChange("image_url", e.target.value)}
                            required
                            className="bg-white border-slate-200 text-sm h-9 flex-grow"
                          />
                          <div className="relative flex-shrink-0">
                            <input
                              type="file"
                              id={`service-file-upload-${index}`}
                              className="hidden"
                              accept="image/*"
                              onChange={handleServiceImageUpload}
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => document.getElementById(`service-file-upload-${index}`)?.click()}
                              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 h-9 px-2.5 flex items-center gap-1 font-semibold text-xs"
                            >
                              <Upload className="h-3 w-3" />
                              Upload
                            </Button>
                          </div>
                        </div>
                        {service.image_url && (
                          <div className="mt-2 relative w-full h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                            <img src={service.image_url} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor={`service-${index}-link`} className="text-xs">Link Route Path</Label>
                        <Input
                          id={`service-${index}-link`}
                          value={service.link}
                          onChange={(e) => handleFieldChange("link", e.target.value)}
                          required
                          className="bg-white border-slate-200 text-sm h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor={`service-${index}-desc`} className="text-xs">Description</Label>
                        <Textarea
                          id={`service-${index}-desc`}
                          value={service.description}
                          onChange={(e) => handleFieldChange("description", e.target.value)}
                          rows={3}
                          required
                          className="bg-white border-slate-200 text-xs leading-relaxed"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-slate-100 bg-slate-50/50 py-2.5 flex justify-end">
                      <Button
                        type="button"
                        onClick={handleSaveCard}
                        disabled={updateServiceMutation.isPending}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-8 px-4"
                      >
                        {updateServiceMutation.isPending && (
                          <span className="mr-1.5 inline-flex h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                        )}
                        <Save className="mr-1 h-3.5 w-3.5" />
                        Save Card
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : activeView === "global-presence" ? (
          <div className="space-y-6">
            <header className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Home Page Global Presence</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Edit the content, title, and buttons for the Home Page "Global Presence" section across all country domains.
                </p>
              </div>
            </header>

            {/* Country Selector Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60 max-w-max">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedCountry === country.code
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>

            {isGpError && (
              <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
                Failed to connect to MySQL database: {gpError instanceof Error ? gpError.message : "Database offline"}.
                <p className="font-semibold mt-1">Note: Using default prefilled content as fallback.</p>
              </div>
            )}

            {/* Form Card */}
            <Card className="border-slate-200 shadow-sm max-w-4xl">
              <CardHeader>
                <CardTitle className="text-lg">Edit Content Details</CardTitle>
                <CardDescription>
                  Update the main headings, text paragraphs, button labels, and redirection path.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateGpMutation.mutate(gpForm);
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="gp-title">Section Title</Label>
                    <Input
                      id="gp-title"
                      value={gpForm.title}
                      onChange={(e) => setGpForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Global Presence"
                      required
                      className="bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gp-content">Content Description</Label>
                    <Textarea
                      id="gp-content"
                      value={gpForm.content_paragraph}
                      onChange={(e) => setGpForm(prev => ({ ...prev, content_paragraph: e.target.value }))}
                      placeholder="Our logistics network spans across continents..."
                      rows={4}
                      required
                      className="bg-white border-slate-200 leading-relaxed"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="gp-btn-text">Button Label</Label>
                      <Input
                        id="gp-btn-text"
                        value={gpForm.button_text}
                        onChange={(e) => setGpForm(prev => ({ ...prev, button_text: e.target.value }))}
                        placeholder="Explore Our Global Network"
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gp-btn-path">Explore Route Path</Label>
                      <Input
                        id="gp-btn-path"
                        value={gpForm.link_path}
                        onChange={(e) => setGpForm(prev => ({ ...prev, link_path: e.target.value }))}
                        placeholder="/global-presence"
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  <CardFooter className="px-0 pt-4 pb-0 flex justify-between items-center border-t border-slate-100 mt-6">
                    <div className="text-xs text-slate-500">
                      {activeGpRecord?.updated_at ? (
                        <span>Last updated in Hostinger MySQL: {formatTimestamp(activeGpRecord.updated_at)}</span>
                      ) : (
                        <span>Currently using local fallback. Press Save to store in Remote MySQL.</span>
                      )}
                    </div>
                    <Button disabled={updateGpMutation.isPending} type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-sm">
                      {updateGpMutation.isPending && (
                        <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>

            {/* Map URL Card */}
            <Card className="border-slate-200 shadow-sm max-w-4xl mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Global Presence Map Embed Link</CardTitle>
                <CardDescription>
                  Configure the Google My Maps iframe embed URL. This updates the interactive map displayed on this country's global presence page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateGpMutation.mutate(gpForm);
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="gp-map-url">Google Maps Embed Link (iframe src)</Label>
                    <Input
                      id="gp-map-url"
                      value={gpForm.map_iframe_url}
                      onChange={(e) => setGpForm(prev => ({ ...prev, map_iframe_url: e.target.value }))}
                      placeholder="https://www.google.com/maps/d/embed?mid=..."
                      required
                      className="bg-white border-slate-200"
                    />
                  </div>
                  {gpForm.map_iframe_url && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 aspect-[16/9] w-full max-w-2xl bg-slate-50 shadow-sm">
                      <iframe
                        src={gpForm.map_iframe_url}
                        title="Interactive Map Preview"
                        className="w-full h-full border-0"
                      />
                    </div>
                  )}
                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      disabled={updateGpMutation.isPending}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-sm"
                    >
                      Save Map Link
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : activeView === "global-presence-page" ? (
          <div className="space-y-6">
            <header className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Global Presence Office Locations</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Manage all country office addresses, phone numbers, email contacts, and map markers displayed on the Global Presence pages.
                </p>
              </div>
            </header>

            {/* Offices CRUD Card */}
            <Card className="border-slate-200 shadow-sm max-w-4xl mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Manage Office Locations & Coordinates</CardTitle>
                <CardDescription>
                  Add, update, or remove office locations, addresses, phone contacts, emails, and coordinates displayed on the Global Presence maps and sidebar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Form to Add / Edit Office */}
                <form
                  className="space-y-4 bg-slate-50 border border-slate-200/60 p-5 rounded-2xl"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingOfficeId) {
                      updateOfficeMutation.mutate({ id: editingOfficeId, payload: officeForm });
                    } else {
                      createOfficeMutation.mutate(officeForm);
                    }
                  }}
                >
                  <h3 className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{editingOfficeId ? "✏️ Edit Office Location" : "➕ Add New Office Location"}</span>
                    {editingOfficeId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingOfficeId(null);
                          setOfficeForm({
                            country_code: "in",
                            office_country: "India",
                            city_name: "",
                            office_name: "",
                            address: "",
                            phone: "",
                            email: "",
                            latitude: 0,
                            longitude: 0,
                          });
                        }}
                        className="text-xs font-semibold hover:bg-slate-200"
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Country Code (Lowercase)</Label>
                      <Input
                        value={officeForm.country_code}
                        onChange={(e) => setOfficeForm(prev => ({ ...prev, country_code: e.target.value.toLowerCase() }))}
                        placeholder="e.g. in, my, ae, sg, bd, pk, gb"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country Name</Label>
                      <Input
                        value={officeForm.office_country}
                        onChange={(e) => setOfficeForm(prev => ({ ...prev, office_country: e.target.value }))}
                        placeholder="e.g. India, Malaysia, Singapore"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>City Name</Label>
                      <Input
                        value={officeForm.city_name}
                        onChange={(e) => setOfficeForm(prev => ({ ...prev, city_name: e.target.value }))}
                        placeholder="e.g. Kochi, Port Klang, Dubai"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Office Name</Label>
                      <Input
                        value={officeForm.office_name}
                        onChange={(e) => setOfficeForm(prev => ({ ...prev, office_name: e.target.value }))}
                        placeholder="e.g. GGL (Singapore) Pte Ltd."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Contact</Label>
                      <Input
                        value={officeForm.email}
                        onChange={(e) => setOfficeForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="e.g. info@ggl.sg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Office Address</Label>
                    <Textarea
                      value={officeForm.address}
                      onChange={(e) => setOfficeForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter full office address details..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Phone Contact</Label>
                      <Input
                        value={officeForm.phone}
                        onChange={(e) => setOfficeForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="e.g. +65 69080838"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Latitude Coordinate</Label>
                      <Input
                        type="number"
                        step="0.00000001"
                        value={officeForm.latitude}
                        onChange={(e) => setOfficeForm(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                        placeholder="e.g. 1.2766"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Longitude Coordinate</Label>
                      <Input
                        type="number"
                        step="0.00000001"
                        value={officeForm.longitude}
                        onChange={(e) => setOfficeForm(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                        placeholder="e.g. 103.8290"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      disabled={createOfficeMutation.isPending || updateOfficeMutation.isPending}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-sm"
                    >
                      {editingOfficeId ? "Save Office Changes" : "Create Office Location"}
                    </Button>
                  </div>
                </form>

                {/* Office list table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white mt-4">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="p-3">Country / City</th>
                        <th className="p-3">Office Name & Address</th>
                        <th className="p-3">Coordinates (Lat, Lng)</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {isLoadingOffices ? (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-slate-400">
                            <span className="inline-flex animate-spin mr-2 h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full" />
                            Loading offices...
                          </td>
                        </tr>
                      ) : !officesRecords || officesRecords.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-slate-400">
                            No office locations found in the Hostinger database.
                          </td>
                        </tr>
                      ) : (
                        officesRecords.map((office) => (
                          <tr key={office.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 align-top font-semibold text-slate-900">
                              <div>{office.office_country}</div>
                              <div className="text-xs text-slate-500 font-normal">{office.city_name} ({office.country_code})</div>
                            </td>
                            <td className="p-3 align-top max-w-sm">
                              <div className="font-semibold text-slate-800">{office.office_name}</div>
                              <div className="text-xs text-slate-500 mt-1 whitespace-pre-line leading-relaxed">{office.address}</div>
                              {(office.phone || office.email) && (
                                <div className="text-[11px] text-amber-600 mt-1 font-medium">
                                  {office.phone && <span>📞 {office.phone}</span>}
                                  {office.phone && office.email && <span className="mx-1">|</span>}
                                  {office.email && <span>✉️ {office.email}</span>}
                                </div>
                              )}
                            </td>
                            <td className="p-3 align-top text-xs text-slate-600 font-mono">
                              <div>Lat: {office.latitude}</div>
                              <div>Lng: {office.longitude}</div>
                            </td>
                            <td className="p-3 align-top text-right space-x-1.5 whitespace-nowrap">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingOfficeId(office.id!);
                                  setOfficeForm({
                                    country_code: office.country_code,
                                    office_country: office.office_country,
                                    city_name: office.city_name,
                                    office_name: office.office_name,
                                    address: office.address,
                                    phone: office.phone || "",
                                    email: office.email || "",
                                    latitude: Number(office.latitude),
                                    longitude: Number(office.longitude),
                                  });
                                }}
                                className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
                              >
                                ✏️
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this office location?")) {
                                    deleteOfficeMutation.mutate(office.id!);
                                  }
                                }}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              >
                                🗑️
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : activeView === "quick-enquiry" ? (
          <div className="space-y-6">
            <header className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Home Page Quick Enquiry</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Manage the Quick Enquiry form headings, recipient email, success alerts, and error alerts across all country domains.
                </p>
              </div>
            </header>

            {/* Country Selector Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60 max-w-max">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedCountry === country.code
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>

            {isQeError && (
              <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
                Failed to connect to MySQL database: {qeError instanceof Error ? qeError.message : "Database offline"}.
                <p className="font-semibold mt-1">Note: Using default prefilled content as fallback.</p>
              </div>
            )}

            {/* Form Card */}
            <Card className="border-slate-200 shadow-sm max-w-4xl">
              <CardHeader>
                <CardTitle className="text-lg">Edit Enquiry Details</CardTitle>
                <CardDescription>
                  Configure the email receiver and custom feedback alerts for customers who submit the form.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateQeMutation.mutate(qeForm);
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="qe-title">Form Title</Label>
                      <Input
                        id="qe-title"
                        value={qeForm.title}
                        onChange={(e) => setQeForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Quick Enquiry"
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qe-email">Recipient Email Address (FormSubmit.co)</Label>
                      <Input
                        id="qe-email"
                        value={qeForm.email_recipient}
                        onChange={(e) => setQeForm(prev => ({ ...prev, email_recipient: e.target.value }))}
                        placeholder="June@ggl.sg"
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qe-subtitle">Subtitle Description</Label>
                    <Textarea
                      id="qe-subtitle"
                      value={qeForm.subtitle}
                      onChange={(e) => setQeForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="Have a question? Fill out the form below..."
                      rows={3}
                      required
                      className="bg-white border-slate-200 leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qe-success">Success Feedback Message</Label>
                    <Textarea
                      id="qe-success"
                      value={qeForm.success_message}
                      onChange={(e) => setQeForm(prev => ({ ...prev, success_message: e.target.value }))}
                      placeholder="Your enquiry has been submitted successfully."
                      rows={2}
                      required
                      className="bg-white border-slate-200 leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qe-error">Error Feedback Message</Label>
                    <Textarea
                      id="qe-error"
                      value={qeForm.error_message}
                      onChange={(e) => setQeForm(prev => ({ ...prev, error_message: e.target.value }))}
                      placeholder="Something went wrong. Please try again later."
                      rows={2}
                      required
                      className="bg-white border-slate-200 leading-relaxed"
                    />
                  </div>

                  <CardFooter className="px-0 pt-4 pb-0 flex justify-between items-center border-t border-slate-100 mt-6">
                    <div className="text-xs text-slate-500">
                      {activeQeRecord?.updated_at ? (
                        <span>Last updated in Hostinger MySQL: {formatTimestamp(activeQeRecord.updated_at)}</span>
                      ) : (
                        <span>Currently using local fallback. Press Save to store in Remote MySQL.</span>
                      )}
                    </div>
                    <Button disabled={updateQeMutation.isPending} type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-sm">
                      {updateQeMutation.isPending && (
                        <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : activeView === "footer" ? (
          <div className="space-y-8">
            <header className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Footer Settings</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Manage the company description (about text), social links, and contact addresses in the footer sections.
                </p>
              </div>
            </header>

            {/* General Settings Form Card */}
            <Card className="border-slate-200 shadow-sm max-w-4xl">
              <CardHeader>
                <CardTitle className="text-lg">General Footer Information</CardTitle>
                <CardDescription>
                  Configure the main about text (displayed under the logo) and social links.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateFooterGeneralMutation.mutate(footerGeneralForm);
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="about-text">Company About Text</Label>
                    <Textarea
                      id="about-text"
                      value={footerGeneralForm.about_text}
                      onChange={(e) => setFooterGeneralForm(prev => ({ ...prev, about_text: e.target.value }))}
                      placeholder="At GGL, we are proud to be one of Singapore's leading logistics companies..."
                      rows={4}
                      required
                      className="bg-white border-slate-200 leading-relaxed"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="facebook-url">Facebook Page URL</Label>
                      <Input
                        id="facebook-url"
                        value={footerGeneralForm.facebook_url}
                        onChange={(e) => setFooterGeneralForm(prev => ({ ...prev, facebook_url: e.target.value }))}
                        placeholder="https://www.facebook.com/gglusa"
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
                      <Input
                        id="linkedin-url"
                        value={footerGeneralForm.linkedin_url}
                        onChange={(e) => setFooterGeneralForm(prev => ({ ...prev, linkedin_url: e.target.value }))}
                        placeholder="https://www.linkedin.com/company/gglus/"
                        className="bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  <CardFooter className="px-0 pt-4 pb-0 flex justify-between items-center border-t border-slate-100 mt-6">
                    <div className="text-xs text-slate-500">
                      {footerGeneralRecord?.updated_at ? (
                        <span>Last updated in Hostinger MySQL: {formatTimestamp(footerGeneralRecord.updated_at)}</span>
                      ) : (
                        <span>Currently using local fallback. Press Save to store in Remote MySQL.</span>
                      )}
                    </div>
                    <Button disabled={updateFooterGeneralMutation.isPending} type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-sm">
                      {updateFooterGeneralMutation.isPending && (
                        <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      Save General Info
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>

            {/* Office Contact Addresses Form Card */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Office Locations & Contact Details</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Select a country tab below to edit the contact details shown in the respective country footer.
                </p>
              </div>

              {/* Country Selector Tabs */}
              <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60 max-w-max">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => setSelectedCountry(country.code)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedCountry === country.code
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                    }`}
                  >
                    <span className="text-base">{country.flag}</span>
                    {country.name}
                  </button>
                ))}
              </div>

              {footerOfficesForm.map((office, idx) => (
                <Card key={idx} className="border-slate-200 shadow-sm max-w-4xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-md font-bold text-slate-950">
                      {selectedCountry === 'MY' ? `Office ${idx + 1}: ${office.title || `Malaysia Location ${idx + 1}`}` : `Primary Office Details (${selectedCountry})`}
                    </CardTitle>
                    <CardDescription>
                      Edit the office title, physical address, and contact numbers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`office-title-${idx}`}>Office Name/Header</Label>
                        <Input
                          id={`office-title-${idx}`}
                          value={office.title}
                          onChange={(e) => {
                            const newOffices = [...footerOfficesForm];
                            newOffices[idx].title = e.target.value;
                            setFooterOfficesForm(newOffices);
                          }}
                          placeholder="e.g. GGL (Singapore) Pte Ltd."
                          required
                          className="bg-white border-slate-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`office-email-${idx}`}>Contact Email</Label>
                        <Input
                          id={`office-email-${idx}`}
                          value={office.email}
                          onChange={(e) => {
                            const newOffices = [...footerOfficesForm];
                            newOffices[idx].email = e.target.value;
                            setFooterOfficesForm(newOffices);
                          }}
                          placeholder="e.g. info@ggl.sg"
                          className="bg-white border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`office-address-${idx}`}>Office Address</Label>
                        <Textarea
                          id={`office-address-${idx}`}
                          value={office.address}
                          onChange={(e) => {
                            const newOffices = [...footerOfficesForm];
                            newOffices[idx].address = e.target.value;
                            setFooterOfficesForm(newOffices);
                          }}
                          placeholder="Line 1&#10;Line 2&#10;Country"
                          rows={3}
                          required
                          className="bg-white border-slate-200 leading-relaxed"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`office-phone-${idx}`}>Phone Numbers</Label>
                        <Textarea
                          id={`office-phone-${idx}`}
                          value={office.phone}
                          onChange={(e) => {
                            const newOffices = [...footerOfficesForm];
                            newOffices[idx].phone = e.target.value;
                            setFooterOfficesForm(newOffices);
                          }}
                          placeholder="+65 69080838"
                          rows={3}
                          className="bg-white border-slate-200 leading-relaxed"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="max-w-4xl flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-500">
                  {activeCountryOffices[0]?.updated_at ? (
                    <span>Last updated in Hostinger MySQL: {formatTimestamp(activeCountryOffices[0].updated_at)}</span>
                  ) : (
                    <span>Currently using local fallback. Press Save to store in Remote MySQL.</span>
                  )}
                </div>
                <Button
                  onClick={saveAllOfficesForCountry}
                  disabled={updateFooterOfficeMutation.isPending}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-sm"
                >
                  {updateFooterOfficeMutation.isPending && (
                    <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  Save Country Offices
                </Button>
              </div>
            </div>
          </div>
        ) : activeView === "navigation-bar" ? (
          <div className="space-y-8">
            <header className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Navigation Bar Settings</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Customize the labels displayed in the main website header navigation.
                </p>
              </div>
            </header>

            <Card className="border-slate-200 shadow-sm max-w-4xl">
              <CardHeader>
                <CardTitle className="text-lg">Header Menu Labels</CardTitle>
                <CardDescription>
                  Update the text for home, info, about, careers, services, global presence, and contact links.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateNavBarMutation.mutate(navBarForm);
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="home-label">Home Page Link Label</Label>
                      <Input
                        id="home-label"
                        value={navBarForm.home_label}
                        onChange={(e) => setNavBarForm(prev => ({ ...prev, home_label: e.target.value }))}
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="info-label">Dropdown Trigger Label</Label>
                      <Input
                        id="info-label"
                        value={navBarForm.info_label}
                        onChange={(e) => setNavBarForm(prev => ({ ...prev, info_label: e.target.value }))}
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="about-label">About Us Dropdown Link Label</Label>
                      <Input
                        id="about-label"
                        value={navBarForm.about_label}
                        onChange={(e) => setNavBarForm(prev => ({ ...prev, about_label: e.target.value }))}
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="careers-label">Careers Dropdown Link Label</Label>
                      <Input
                        id="careers-label"
                        value={navBarForm.careers_label}
                        onChange={(e) => setNavBarForm(prev => ({ ...prev, careers_label: e.target.value }))}
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="services-label">Services Link Label</Label>
                      <Input
                        id="services-label"
                        value={navBarForm.services_label}
                        onChange={(e) => setNavBarForm(prev => ({ ...prev, services_label: e.target.value }))}
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="global-presence-label">Global Presence Link Label</Label>
                      <Input
                        id="global-presence-label"
                        value={navBarForm.global_presence_label}
                        onChange={(e) => setNavBarForm(prev => ({ ...prev, global_presence_label: e.target.value }))}
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-w-md">
                    <Label htmlFor="contact-label">Contact Button Label</Label>
                    <Input
                      id="contact-label"
                      value={navBarForm.contact_label}
                      onChange={(e) => setNavBarForm(prev => ({ ...prev, contact_label: e.target.value }))}
                      required
                      className="bg-white border-slate-200"
                    />
                  </div>

                  <CardFooter className="px-0 pt-4 pb-0 flex justify-between items-center border-t border-slate-100 mt-6">
                    <div className="text-xs text-slate-500">
                      {navBarRecord?.updated_at ? (
                        <span>Last updated in Hostinger MySQL: {formatTimestamp(navBarRecord.updated_at)}</span>
                      ) : (
                        <span>Currently using local fallback. Press Save to store in Remote MySQL.</span>
                      )}
                    </div>
                    <Button disabled={updateNavBarMutation.isPending} type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-sm">
                      {updateNavBarMutation.isPending && (
                        <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      Save Navigation Labels
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : activeView === "about-us-page" ? (
          <div className="space-y-8">
            <header className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">About Us Page Content</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Manage the full text paragraphs, hero section titles, image, and cards of the static About Us page.
                </p>
              </div>
            </header>

            {/* Country Selector Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60 max-w-max">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedCountry === country.code
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>

            <Card className="border-slate-200 shadow-sm max-w-4xl">
              <CardHeader>
                <CardTitle className="text-lg">Edit Page Content ({selectedCountry})</CardTitle>
                <CardDescription>
                  Update the headers, text paragraphs, images, and card contents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateAboutUsPageMutation.mutate(aboutUsPageForm);
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="about-hero-title">Hero Title</Label>
                      <Input
                        id="about-hero-title"
                        value={aboutUsPageForm.hero_title}
                        onChange={(e) => setAboutUsPageForm(prev => ({ ...prev, hero_title: e.target.value }))}
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about-hero-subtitle">Hero Subtitle</Label>
                      <Input
                        id="about-hero-subtitle"
                        value={aboutUsPageForm.hero_subtitle || ""}
                        onChange={(e) => setAboutUsPageForm(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                        className="bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="about-main-title">About Title / Subheading</Label>
                      <Input
                        id="about-main-title"
                        value={aboutUsPageForm.about_title}
                        onChange={(e) => setAboutUsPageForm(prev => ({ ...prev, about_title: e.target.value }))}
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about-image-url">Image URL / Path</Label>
                      <div className="flex gap-2">
                        <Input
                          id="about-image-url"
                          value={aboutUsPageForm.image_url}
                          onChange={(e) => setAboutUsPageForm(prev => ({ ...prev, image_url: e.target.value }))}
                          required
                          className="bg-white border-slate-200 flex-grow"
                        />
                        <div className="relative flex-shrink-0">
                          <input
                            type="file"
                            id="about-us-page-image-file-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAboutUsPageImageUpload}
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => document.getElementById("about-us-page-image-file-upload")?.click()}
                            disabled={isUploadingAboutUsPageImage}
                            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 h-10 px-3 flex items-center gap-1.5 font-semibold text-xs"
                          >
                            {isUploadingAboutUsPageImage ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Upload className="h-3.5 w-3.5" />
                            )}
                            {isUploadingAboutUsPageImage ? "Uploading..." : "Upload Image"}
                          </Button>
                        </div>
                      </div>
                      {aboutUsPageForm.image_url && (
                        <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200 aspect-[16/9] max-w-md bg-slate-50 shadow-sm">
                          <img
                            src={aboutUsPageForm.image_url}
                            alt="About Us Page Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about-p1">Paragraph 1</Label>
                    <Textarea
                      id="about-p1"
                      value={aboutUsPageForm.paragraph_1}
                      onChange={(e) => setAboutUsPageForm(prev => ({ ...prev, paragraph_1: e.target.value }))}
                      rows={4}
                      required
                      className="bg-white border-slate-200 leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about-p2">Paragraph 2</Label>
                    <Textarea
                      id="about-p2"
                      value={aboutUsPageForm.paragraph_2}
                      onChange={(e) => setAboutUsPageForm(prev => ({ ...prev, paragraph_2: e.target.value }))}
                      rows={4}
                      required
                      className="bg-white border-slate-200 leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about-p3">Paragraph 3</Label>
                    <Textarea
                      id="about-p3"
                      value={aboutUsPageForm.paragraph_3}
                      onChange={(e) => setAboutUsPageForm(prev => ({ ...prev, paragraph_3: e.target.value }))}
                      rows={4}
                      required
                      className="bg-white border-slate-200 leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about-p4">Paragraph 4 (Optional)</Label>
                    <Textarea
                      id="about-p4"
                      value={aboutUsPageForm.paragraph_4 || ""}
                      onChange={(e) => setAboutUsPageForm(prev => ({ ...prev, paragraph_4: e.target.value || null }))}
                      rows={3}
                      className="bg-white border-slate-200 leading-relaxed"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="about-floating-title">Floating Badge / Card Title</Label>
                      <Input
                        id="about-floating-title"
                        value={aboutUsPageForm.floating_card_title || ""}
                        onChange={(e) => setAboutUsPageForm(prev => ({ ...prev, floating_card_title: e.target.value }))}
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about-floating-subtitle">Floating Badge / Card Subtitle</Label>
                      <Input
                        id="about-floating-subtitle"
                        value={aboutUsPageForm.floating_card_subtitle || ""}
                        onChange={(e) => setAboutUsPageForm(prev => ({ ...prev, floating_card_subtitle: e.target.value }))}
                        className="bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about-final">Final Footer/Closing Paragraph (Optional)</Label>
                    <Textarea
                      id="about-final"
                      value={aboutUsPageForm.final_paragraph || ""}
                      onChange={(e) => setAboutUsPageForm(prev => ({ ...prev, final_paragraph: e.target.value }))}
                      rows={3}
                      className="bg-white border-slate-200 leading-relaxed"
                    />
                  </div>

                  <CardFooter className="px-0 pt-4 pb-0 flex justify-between items-center border-t border-slate-100 mt-6">
                    <div className="text-xs text-slate-500">
                      {aboutUsPageRecord?.updated_at ? (
                        <span>Last updated in Hostinger MySQL: {formatTimestamp(aboutUsPageRecord.updated_at)}</span>
                      ) : (
                        <span>Currently using local fallback. Press Save to store in Remote MySQL.</span>
                      )}
                    </div>
                    <Button disabled={updateAboutUsPageMutation.isPending} type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-sm">
                      {updateAboutUsPageMutation.isPending && (
                        <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      Save Page Content
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : activeView === "careers-page" ? (
          <div className="space-y-8">
            <header className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Careers Page Settings</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Configure the headers, descriptions, positions messages, and CTA labels for the Careers page.
                </p>
              </div>
            </header>

            {/* Country Selector Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60 max-w-max">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedCountry === country.code
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>

            <Card className="border-slate-200 shadow-sm max-w-4xl">
              <CardHeader>
                <CardTitle className="text-lg">Edit Careers Page ({selectedCountry})</CardTitle>
                <CardDescription>
                  Update the hero section, benefit headings, positions message, and call-to-actions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateCareersPageMutation.mutate(careersPageForm);
                  }}
                >
                  {/* Hero Section */}
                  <div className="space-y-4 border-b border-slate-100 pb-6">
                    <h3 className="text-md font-bold text-slate-900">1. Hero Section</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="careers-hero-title">Hero Title</Label>
                        <Input
                          id="careers-hero-title"
                          value={careersPageForm.hero_title}
                          onChange={(e) => setCareersPageForm(prev => ({ ...prev, hero_title: e.target.value }))}
                          required
                          className="bg-white border-slate-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="careers-hero-btn">Hero Button Text</Label>
                        <Input
                          id="careers-hero-btn"
                          value={careersPageForm.hero_button_text}
                          onChange={(e) => setCareersPageForm(prev => ({ ...prev, hero_button_text: e.target.value }))}
                          required
                          className="bg-white border-slate-200"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="careers-hero-sub">Hero Subtitle</Label>
                      <Textarea
                        id="careers-hero-sub"
                        value={careersPageForm.hero_subtitle}
                        onChange={(e) => setCareersPageForm(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                        rows={3}
                        required
                        className="bg-white border-slate-200 leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Why Join us Section */}
                  <div className="space-y-4 border-b border-slate-100 pb-6">
                    <h3 className="text-md font-bold text-slate-900">2. "Why Choose Us" Header</h3>
                    <div className="space-y-2">
                      <Label htmlFor="careers-why-title">Why Join Title</Label>
                      <Input
                        id="careers-why-title"
                        value={careersPageForm.why_join_title}
                        onChange={(e) => setCareersPageForm(prev => ({ ...prev, why_join_title: e.target.value }))}
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="careers-why-desc">Why Join Description</Label>
                      <Textarea
                        id="careers-why-desc"
                        value={careersPageForm.why_join_description}
                        onChange={(e) => setCareersPageForm(prev => ({ ...prev, why_join_description: e.target.value }))}
                        rows={3}
                        required
                        className="bg-white border-slate-200 leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Current Opportunities Section */}
                  <div className="space-y-4 border-b border-slate-100 pb-6">
                    <h3 className="text-md font-bold text-slate-900">3. Current Opportunities</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="careers-opp-title">Opportunities Section Title</Label>
                        <Input
                          id="careers-opp-title"
                          value={careersPageForm.opportunities_title}
                          onChange={(e) => setCareersPageForm(prev => ({ ...prev, opportunities_title: e.target.value }))}
                          required
                          className="bg-white border-slate-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="careers-opp-status">Opportunities Status Text / Message</Label>
                        <Input
                          id="careers-opp-status"
                          value={careersPageForm.opportunities_status}
                          onChange={(e) => setCareersPageForm(prev => ({ ...prev, opportunities_status: e.target.value }))}
                          required
                          className="bg-white border-slate-200"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="careers-opp-desc">Opportunities Description</Label>
                      <Textarea
                        id="careers-opp-desc"
                        value={careersPageForm.opportunities_description}
                        onChange={(e) => setCareersPageForm(prev => ({ ...prev, opportunities_description: e.target.value }))}
                        rows={2}
                        required
                        className="bg-white border-slate-200 leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Call-to-Action Section */}
                  <div className="space-y-4">
                    <h3 className="text-md font-bold text-slate-900">4. Call to Action (Bottom CTA)</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="careers-cta-title">CTA Title</Label>
                        <Input
                          id="careers-cta-title"
                          value={careersPageForm.cta_title}
                          onChange={(e) => setCareersPageForm(prev => ({ ...prev, cta_title: e.target.value }))}
                          required
                          className="bg-white border-slate-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="careers-cta-btn1">Submit Resume Button Label</Label>
                        <Input
                          id="careers-cta-btn1"
                          value={careersPageForm.cta_btn1_label}
                          onChange={(e) => setCareersPageForm(prev => ({ ...prev, cta_btn1_label: e.target.value }))}
                          required
                          className="bg-white border-slate-200"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="careers-cta-sub">CTA Subtitle</Label>
                        <Input
                          id="careers-cta-sub"
                          value={careersPageForm.cta_subtitle}
                          onChange={(e) => setCareersPageForm(prev => ({ ...prev, cta_subtitle: e.target.value }))}
                          required
                          className="bg-white border-slate-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="careers-cta-btn2">Contact HR Button Label</Label>
                        <Input
                          id="careers-cta-btn2"
                          value={careersPageForm.cta_btn2_label}
                          onChange={(e) => setCareersPageForm(prev => ({ ...prev, cta_btn2_label: e.target.value }))}
                          required
                          className="bg-white border-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  <CardFooter className="px-0 pt-4 pb-0 flex justify-between items-center border-t border-slate-100 mt-6">
                    <div className="text-xs text-slate-500">
                      {careersPageRecord?.updated_at ? (
                        <span>Last updated in Hostinger MySQL: {formatTimestamp(careersPageRecord.updated_at)}</span>
                      ) : (
                        <span>Currently using local fallback. Press Save to store in Remote MySQL.</span>
                      )}
                    </div>
                    <Button disabled={updateCareersPageMutation.isPending} type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-sm">
                      {updateCareersPageMutation.isPending && (
                        <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      Save Careers Content
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : activeView === "services-page" ? (
          <div className="space-y-8">
            <header className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Services Page Settings</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Configure the headers, descriptions, and CTA settings of the main Services page.
                </p>
              </div>
            </header>

            {/* Country Selector Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60 max-w-max">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedCountry === country.code
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>

            <Card className="border-slate-200 shadow-sm max-w-4xl">
              <CardHeader>
                <CardTitle className="text-lg">Edit Services Page ({selectedCountry})</CardTitle>
                <CardDescription>
                  Update the hero section, services list headings, and the why choose us details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateServicesPageMutation.mutate(servicesPageForm);
                  }}
                >
                  {/* Hero Section */}
                  <div className="space-y-4 border-b border-slate-100 pb-6">
                    <h3 className="text-md font-bold text-slate-900">1. Hero Section</h3>
                    <div className="space-y-2">
                      <Label htmlFor="services-hero-title">Hero Title</Label>
                      <Input
                        id="services-hero-title"
                        value={servicesPageForm.hero_title}
                        onChange={(e) => setServicesPageForm(prev => ({ ...prev, hero_title: e.target.value }))}
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="services-hero-sub">Hero Subtitle</Label>
                      <Textarea
                        id="services-hero-sub"
                        value={servicesPageForm.hero_subtitle}
                        onChange={(e) => setServicesPageForm(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                        rows={3}
                        required
                        className="bg-white border-slate-200 leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Services List Section */}
                  <div className="space-y-4 border-b border-slate-100 pb-6">
                    <h3 className="text-md font-bold text-slate-900">2. Services Grid Section Header</h3>
                    <div className="space-y-2">
                      <Label htmlFor="services-sec-title">Section Title</Label>
                      <Input
                        id="services-sec-title"
                        value={servicesPageForm.services_title}
                        onChange={(e) => setServicesPageForm(prev => ({ ...prev, services_title: e.target.value }))}
                        required
                        className="bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="services-sec-desc">Section Description</Label>
                      <Textarea
                        id="services-sec-desc"
                        value={servicesPageForm.services_description}
                        onChange={(e) => setServicesPageForm(prev => ({ ...prev, services_description: e.target.value }))}
                        rows={3}
                        required
                        className="bg-white border-slate-200 leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Why Choose us Section */}
                  <div className="space-y-4">
                    <h3 className="text-md font-bold text-slate-900">3. "Why Choose Us" & CTA Section</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="services-why-title">Why Choose Title</Label>
                        <Input
                          id="services-why-title"
                          value={servicesPageForm.why_choose_title}
                          onChange={(e) => setServicesPageForm(prev => ({ ...prev, why_choose_title: e.target.value }))}
                          required
                          className="bg-white border-slate-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="services-cta-btn">CTA Button Label</Label>
                        <Input
                          id="services-cta-btn"
                          value={servicesPageForm.cta_btn_text}
                          onChange={(e) => setServicesPageForm(prev => ({ ...prev, cta_btn_text: e.target.value }))}
                          required
                          className="bg-white border-slate-200"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="services-why-desc">Why Choose Description</Label>
                      <Textarea
                        id="services-why-desc"
                        value={servicesPageForm.why_choose_description}
                        onChange={(e) => setServicesPageForm(prev => ({ ...prev, why_choose_description: e.target.value }))}
                        rows={3}
                        required
                        className="bg-white border-slate-200 leading-relaxed"
                      />
                    </div>
                  </div>

                  <CardFooter className="px-0 pt-4 pb-0 flex justify-between items-center border-t border-slate-100 mt-6">
                    <div className="text-xs text-slate-500">
                      {servicesPageRecord?.updated_at ? (
                        <span>Last updated in Hostinger MySQL: {formatTimestamp(servicesPageRecord.updated_at)}</span>
                      ) : (
                        <span>Currently using local fallback. Press Save to store in Remote MySQL.</span>
                      )}
                    </div>
                    <Button disabled={updateServicesPageMutation.isPending} type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-sm">
                      {updateServicesPageMutation.isPending && (
                        <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      Save Services Content
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : activeView === "service-details" ? (
          <div className="space-y-8">
            <header className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Service Detail Page: <span className="text-amber-600">{activeServiceDetail?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Manage the content for individual service pages like `/services/ocean-freight`.
                </p>
              </div>
            </header>

            {/* Country Selector Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60 max-w-max">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedCountry === country.code
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  {country.name}
                </button>
              ))}
            </div>

            <Card className="border-slate-200 shadow-sm max-w-4xl">
              <CardHeader>
                <CardTitle className="text-lg">Edit Page Content ({selectedCountry})</CardTitle>
                <CardDescription>
                  Update the hero, content sections, features, and call-to-action for this service.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingServiceDetails ? (
                  <div className="flex items-center justify-center p-10">
                    <RefreshCw className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                ) : (
                  <form
                    className="space-y-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateServiceDetailsPageMutation.mutate(serviceDetailsPageForm);
                    }}
                  >
                    {/* Hero Section */}
                    <div className="space-y-4 border-b border-slate-100 pb-6">
                      <h3 className="text-md font-bold text-slate-900">1. Hero Section</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Hero Title</Label>
                          <Input value={serviceDetailsPageForm.hero_title} onChange={(e) => setServiceDetailsPageForm(prev => ({ ...prev, hero_title: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Hero Image URL</Label>
                          <div className="flex gap-2">
                            <Input value={serviceDetailsPageForm.hero_image_url} onChange={(e) => setServiceDetailsPageForm(prev => ({ ...prev, hero_image_url: e.target.value }))} className="flex-grow" />
                            <div className="relative flex-shrink-0">
                              <input
                                type="file"
                                id="service-hero-image-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleHeroImageUpload}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => document.getElementById("service-hero-image-upload")?.click()}
                                disabled={isUploadingHeroImage}
                                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 h-10 px-3 flex items-center gap-1.5 font-semibold text-xs"
                              >
                                {isUploadingHeroImage ? (
                                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Upload className="h-3.5 w-3.5" />
                                )}
                                {isUploadingHeroImage ? "Uploading..." : "Upload"}
                              </Button>
                            </div>
                          </div>
                          {serviceDetailsPageForm.hero_image_url && (
                            <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-200 aspect-[16/9] w-full max-w-xs bg-slate-50 shadow-sm">
                              <img
                                src={serviceDetailsPageForm.hero_image_url}
                                alt="Hero Image Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Hero Subtitle</Label>
                        <Textarea value={serviceDetailsPageForm.hero_subtitle} onChange={(e) => setServiceDetailsPageForm(prev => ({ ...prev, hero_subtitle: e.target.value }))} rows={3} />
                      </div>
                    </div>

                    {/* Section 1 */}
                    <div className="space-y-4 border-b border-slate-100 pb-6">
                      <h3 className="text-md font-bold text-slate-900">2. Main Content Section</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Section Title</Label>
                          <Input value={serviceDetailsPageForm.section1_title} onChange={(e) => setServiceDetailsPageForm(prev => ({ ...prev, section1_title: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Section Image URL</Label>
                          <div className="flex gap-2">
                            <Input value={serviceDetailsPageForm.section1_image_url} onChange={(e) => setServiceDetailsPageForm(prev => ({ ...prev, section1_image_url: e.target.value }))} className="flex-grow" />
                            <div className="relative flex-shrink-0">
                              <input
                                type="file"
                                id="service-section1-image-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleSection1ImageUpload}
                              />
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => document.getElementById("service-section1-image-upload")?.click()}
                                disabled={isUploadingSection1Image}
                                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 h-10 px-3 flex items-center gap-1.5 font-semibold text-xs"
                              >
                                {isUploadingSection1Image ? (
                                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Upload className="h-3.5 w-3.5" />
                                )}
                                {isUploadingSection1Image ? "Uploading..." : "Upload"}
                              </Button>
                            </div>
                          </div>
                          {serviceDetailsPageForm.section1_image_url && (
                            <div className="mt-2 relative rounded-lg overflow-hidden border border-slate-200 aspect-[16/9] w-full max-w-xs bg-slate-50 shadow-sm">
                              <img
                                src={serviceDetailsPageForm.section1_image_url}
                                alt="Section Image Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Section Content</Label>
                        <Textarea value={serviceDetailsPageForm.section1_content} onChange={(e) => setServiceDetailsPageForm(prev => ({ ...prev, section1_content: e.target.value }))} rows={5} />
                      </div>
                    </div>

                    {/* Features Section */}
                    <div className="space-y-4 border-b border-slate-100 pb-6">
                      <h3 className="text-md font-bold text-slate-900">3. Features Section</h3>
                      <div className="space-y-2">
                        <Label>Features Title</Label>
                        <Input value={serviceDetailsPageForm.features_title} onChange={(e) => setServiceDetailsPageForm(prev => ({ ...prev, features_title: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Features List (one per line)</Label>
                        <Textarea
                          value={Array.isArray(serviceDetailsPageForm.features_list) ? serviceDetailsPageForm.features_list.join('\n') : ''}
                          onChange={(e) => setServiceDetailsPageForm(prev => ({ ...prev, features_list: e.target.value.split('\n') }))}
                          rows={6}
                          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                        />
                      </div>
                    </div>

                    {/* CTA Section */}
                    <div className="space-y-4">
                      <h3 className="text-md font-bold text-slate-900">4. Call-to-Action Section</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>CTA Title</Label>
                          <Input value={serviceDetailsPageForm.cta_title} onChange={(e) => setServiceDetailsPageForm(prev => ({ ...prev, cta_title: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>CTA Button Text</Label>
                          <Input value={serviceDetailsPageForm.cta_button_text} onChange={(e) => setServiceDetailsPageForm(prev => ({ ...prev, cta_button_text: e.target.value }))} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>CTA Button Link</Label>
                        <Input value={serviceDetailsPageForm.cta_button_link} onChange={(e) => setServiceDetailsPageForm(prev => ({ ...prev, cta_button_link: e.target.value }))} />
                      </div>
                    </div>

                    <CardFooter className="px-0 pt-4 pb-0 flex justify-between items-center border-t border-slate-100 mt-6">
                      <div className="text-xs text-slate-500">
                        {serviceDetailsPageRecord?.updated_at ? (
                          <span>Last updated: {formatTimestamp(serviceDetailsPageRecord.updated_at)}</span>
                        ) : (
                          <span>No record found. Saving will create a new entry.</span>
                        )}
                      </div>
                      <Button disabled={updateServiceDetailsPageMutation.isPending} type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-sm">
                        {updateServiceDetailsPageMutation.isPending && (
                          <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        )}
                        <Save className="mr-2 h-4 w-4" />
                        Save Service Page
                      </Button>
                    </CardFooter>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        ) : activeView === "contact-page" ? (
          <div className="space-y-6">
            <header className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Contact Page</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Customize the title, subtitle, address, phone number, email and interactive map URL for the Contact page.
                </p>
              </div>
            </header>

            <Card className="border-slate-200 shadow-sm max-w-4xl">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5 text-amber-500" />
                  Contact Info: {countries.find(c => c.code === selectedCountry)?.name || selectedCountry}
                </CardTitle>
                <CardDescription>
                  Modify the contact information displayed to users in this region context.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateContactPageMutation.mutate(contactPageForm);
                  }}
                  className="space-y-6"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Page Title</Label>
                      <Input
                        value={contactPageForm.title}
                        onChange={(e) => setContactPageForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Get in Touch"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Primary Phone</Label>
                      <Input
                        value={contactPageForm.phone}
                        onChange={(e) => setContactPageForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="e.g. +65 69080838"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Recipient Email (Contact Form destination)</Label>
                      <Input
                        value={contactPageForm.email_recipient}
                        onChange={(e) => setContactPageForm(prev => ({ ...prev, email_recipient: e.target.value }))}
                        placeholder="e.g. june@ggl.sg"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle Description</Label>
                      <Input
                        value={contactPageForm.subtitle}
                        onChange={(e) => setContactPageForm(prev => ({ ...prev, subtitle: e.target.value }))}
                        placeholder="e.g. We're here to help..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Full Office Address</Label>
                    <Textarea
                      value={contactPageForm.address}
                      onChange={(e) => setContactPageForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter the complete mailing address..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Google Map Embed Link (iframe src)</Label>
                    <Textarea
                      value={contactPageForm.map_iframe_url}
                      onChange={(e) => setContactPageForm(prev => ({ ...prev, map_iframe_url: e.target.value }))}
                      placeholder="Paste the Google Maps share/embed link..."
                      rows={3}
                      required
                    />
                  </div>

                  <CardFooter className="px-0 pt-4 pb-0 flex justify-between items-center border-t border-slate-100 mt-6">
                    <div className="text-xs text-slate-500">
                      {contactPageRecord?.updated_at ? (
                        <span>Last updated: {formatTimestamp(contactPageRecord.updated_at)}</span>
                      ) : (
                        <span>No record found. Saving will create a new entry.</span>
                      )}
                    </div>
                    <Button disabled={updateContactPageMutation.isPending} type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold shadow-sm">
                      {updateContactPageMutation.isPending && (
                        <span className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      Save Contact Page Settings
                    </Button>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : activeView === "countries-manager" ? (
          <div className="space-y-6">
            <header className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manage Website Countries & Contexts</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Add new countries/regions, configure country flags, names, and edit contexts available for website content customization.
                </p>
              </div>
            </header>

            {/* Countries CRUD Card */}
            <Card className="border-slate-200 shadow-sm max-w-4xl">
              <CardHeader>
                <CardTitle className="text-lg">Register & Edit Countries</CardTitle>
                <CardDescription>
                  Adding a country dynamically expands the selectable target contexts throughout the GGL Admin Panel.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Form to Add / Edit Country */}
                <form
                  className="space-y-4 bg-slate-50 border border-slate-200/60 p-5 rounded-2xl"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingCountryId) {
                      updateCountryMutation.mutate({ id: editingCountryId, payload: countryForm });
                    } else {
                      createCountryMutation.mutate(countryForm);
                    }
                  }}
                >
                  <h3 className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{editingCountryId ? "✏️ Edit Country Details" : "➕ Register New Country Context"}</span>
                    {editingCountryId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCountryId(null);
                          setCountryForm({ code: "", name: "", flag: "🏳️", link_path: "" });
                        }}
                        className="text-xs font-semibold hover:bg-slate-200"
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Country Code (Uppercase)</Label>
                      <Input
                        value={countryForm.code}
                        onChange={(e) => setCountryForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="e.g. IN, AU, SG, UK"
                        required
                        disabled={!!editingCountryId}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country Name</Label>
                      <Input
                        value={countryForm.name}
                        onChange={(e) => setCountryForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. India, Australia"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Flag Emoji</Label>
                      <Input
                        value={countryForm.flag}
                        onChange={(e) => setCountryForm(prev => ({ ...prev, flag: e.target.value }))}
                        placeholder="e.g. 🇮🇳, 🇦🇺"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Frontend Link Path (optional)</Label>
                    <Input
                      value={countryForm.link_path || ""}
                      onChange={(e) => setCountryForm(prev => ({ ...prev, link_path: e.target.value }))}
                      placeholder="e.g. /india, /uk, /global-presence — overrides the auto-generated link"
                    />
                    <p className="text-xs text-slate-500">
                      Leave blank to use the default auto-generated link for this country's view.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      disabled={createCountryMutation.isPending || updateCountryMutation.isPending}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-sm"
                    >
                      {editingCountryId ? "Save Country Changes" : "Register Country"}
                    </Button>
                  </div>
                </form>

                {/* Country List Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white mt-4">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="p-3">Flag</th>
                        <th className="p-3">Country Code</th>
                        <th className="p-3">Country Name</th>
                        <th className="p-3">Link Path</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {countries.map((country) => (
                        <tr key={country.code} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 align-middle text-2xl">
                            {country.flag}
                          </td>
                          <td className="p-3 align-middle font-mono font-bold text-slate-900">
                            {country.code}
                          </td>
                          <td className="p-3 align-middle font-semibold text-slate-800">
                            {country.name}
                          </td>
                          <td className="p-3 align-middle font-mono text-xs text-slate-500">
                            {country.link_path || <span className="italic text-slate-400">auto</span>}
                          </td>
                          <td className="p-3 align-middle text-right space-x-1.5 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingCountryId(country.id || null);
                                setCountryForm({
                                  code: country.code,
                                  name: country.name,
                                  flag: country.flag,
                                  link_path: country.link_path || "",
                                });
                              }}
                              className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
                              disabled={country.code === "SG"}
                            >
                              ✏️
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${country.name}? All customized contents for this country code will be hidden.`)) {
                                  deleteCountryMutation.mutate(country.id!);
                                }
                              }}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              disabled={["SG", "BD", "MY", "PK", "UK"].includes(country.code)}
                            >
                              🗑️
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </main>
    </div>
  );
}
