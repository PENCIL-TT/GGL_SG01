import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchSeoRecordByPath } from "./lib/seo";

interface MetaConfig {
  title?: string;
  description?: string;
  keywords?: string;
  extraMeta?: Record<string, string> | null;
}

export const META_CONFIG: Record<string, MetaConfig> = {
  "/": {
    title: "GGL Singapore – End-to-End B2B Logistics & Supply Chain Solutions",
    description:
      "GGL Singapore delivers end-to-end B2B logistics solutions—including warehousing, ocean & air freight, transportation, and LCL consolidation—with a robust global network.",
    keywords:
      "B2B logistics Singapore, end-to-end logistics, supply chain solutions, warehousing, ocean freight, air freight, transportation, LCL consolidation, global network",
    extraMeta: {
      "google-site-verification": "K-upJ1PqAKdxJNqymN1SeK6Tj9mH8Wv00zLJ46gYOqY",
    },
  },
  "/about": {
    title: "GGL Singapore | Trusted B2B Supply Chain & Logistics Partner",
    description:
      "Trusted since 2000, GGL Singapore provides B2B logistics and supply chain services—air & ocean freight, warehousing, transportation—for seamless operations.",
    keywords:
      "B2B logistics Singapore, supply chain expertise, freight forwarding, air freight, ocean freight, warehousing division, transportation solutions, end-to-end logistics",
  },
  "/careers": {
    title: "GGL Singapore Careers | Join a Premier B2B Logistics Team",
    description:
      "Explore rewarding careers at GGL Singapore—one of Singapore’s leading B2B logistics companies. Apply now for roles in freight forwarding, warehousing, transportation and customer service.",
    keywords:
      "GGL Singapore careers, logistics jobs Singapore, freight forwarding careers, warehousing jobs, transportation careers, customer service logistics, B2B logistics jobs",
  },
  "/services": {
    title: "GGL Singapore | Comprehensive B2B Logistics Services",
    description:
      "GGL Singapore delivers comprehensive B2B logistics services—warehousing with WMS, dedicated transport, air freight, ocean forwarding, and LCL consolidation through a global partner network.",
    keywords:
      "B2B logistics services, warehousing solutions, WMS logistics, transportation & distribution, air freight services, ocean freight, LCL consolidation, Singapore logistics provider",
  },
  "/services/air-freight": {
    title: "GGL Singapore | B2B Air Freight – Fast, Reliable & Cost-Efficient",
    description:
      "GGL Singapore provides B2B air freight solutions—import, export, express—on a convenient door-to-door basis. Benefit from competitive rates, reliable operations, and expert support.",
    keywords:
      "B2B air freight Singapore, air import export, express air freight, door-to-door shipping, competitive air freight rates, reliable air logistics, professional air freight services",
  },
  "/services/ocean-freight": {
    title: "GGL Singapore | B2B Ocean Freight – FCL & LCL, Door-to-Door",
    description:
      "GGL Singapore offers professional B2B ocean freight solutions—FCL & LCL—through a trusted partner network. Benefit from tailored pricing, customs clearance, and selective milestone notifications.",
    keywords:
      "B2B ocean freight Singapore, FCL ocean freight, LCL shipping, door-to-door sea freight, ocean freight pricing solutions, customs clearance, milestone notifications, global ocean freight",
  },
  "/services/transportation": {
    title: "GGL Singapore | B2B Transportation & Distribution Excellence",
    description:
      "GGL Singapore delivers B2B transportation and distribution—via a dedicated fleet—ensuring fast, frequent, and reliable domestic deliveries supported by a highly efficient logistics network.",
    keywords:
      "B2B transportation Singapore, domestic distribution logistics, dedicated fleet delivery, reliable transport services, high productivity logistics, frequent delivery service",
  },
  "/services/warehousing": {
    title:
      "GGL Singapore | B2B Warehousing & Distribution with WMS Visibility",
    description:
      "GGL Singapore offers B2B warehousing and distribution with WMS-powered visibility—covering consolidation, pick & pack, inventory and PO management, backed by skilled specialists.",
    keywords:
      "B2B warehousing Singapore, WMS logistics services, consolidation deconsolidation, pick and pack, inventory management, purchase order management, distribution services, supply chain visibility",
  },
  "/services/lcl-consolidation": {
    title:
      "GGL Singapore | Global B2B LCL Consolidation with Shipment Visibility",
    description:
      "GGL Singapore offers global B2B LCL consolidation from key cargo hubs. Enjoy efficient, competitively-priced groupage with weekly sailings and complete shipment visibility via an advanced software platform.",
    keywords:
      "B2B LCL consolidation Singapore, global LCL groupage, competitive LCL pricing, shipment visibility platform, weekly LCL sailings, transshipment hubs, LCL services Asia",
  },
  "/services/project-cargo": {
    title: "GGL Singapore | B2B Project Cargo & Heavy-Lift Logistics",
    description:
      "GGL Singapore delivers B2B project cargo solutions—heavy-lift, oversized and break-bulk shipments—through trusted global partners. Expect precise planning, customs clearance, and reliable multi-modal transport.",
    keywords:
      "B2B project cargo, heavy-lift logistics Singapore, oversized cargo shipping, break-bulk transport, multi-modal project cargo, customs clearance project cargo, global project logistics",
  },
  "/global-presence": {
    title: "GGL Singapore | Global B2B Logistics Network & Regional Offices",
    description:
      "Explore GGL Singapore’s global B2B presence, featuring regional offices across Asia, the USA, Middle East, and Europe—supported by a trusted partner network delivering seamless supply chain logistics.",
    keywords:
      "GGL global presence, regional logistics offices, international supply chain network, B2B logistics global offices, GGL worldwide logistics locations",
  },
  "/contact": {
    title: "GGL Singapore | Global B2B Logistics Offices & Contact",
    description:
      "Contact GGL Singapore’s global B2B logistics network. Reach our offices across Asia, the USA, Europe & the Middle East for expert support in freight forwarding, warehousing, and transport.",
    keywords:
      "GGL contact, global logistics offices, B2B logistics support, Singapore freight forwarding contact, regional GGL offices",
  },
  "/privacy-policy": {
    title:
      "GGL Singapore | Privacy Policy – Data Protection and Compliance",
    description:
      "Review GGL Singapore’s Privacy Policy to understand how we collect, use, disclose, and safeguard information—demonstrating our commitment to responsible data practices and secure B2B engagement.",
    keywords:
      "GGL privacy policy, data protection, personal data handling, privacy compliance, secure logistics partner, B2B privacy policy",
  },
  "/terms-and-conditions": {
    title:
      "GGL Singapore | Website Terms & Conditions – Usage Policy",
    description:
      "Read GGL Singapore’s Website Terms & Conditions to understand our usage policy, user responsibilities, and legal terms governing access to our B2B logistics site.",
    keywords:
      "GGL terms and conditions, website usage policy, GGL website terms, user responsibilities, B2B logistics site policy",
  },
};

function applyMeta(config?: MetaConfig) {
  if (!config) return;
  if (config.title) {
    document.title = config.title;
  }

  const setMeta = (name: string, content: string) => {
    let element = document.querySelector(`meta[name='${name}']`) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("name", name);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };

  if (config.description) {
    setMeta("description", config.description);
  }

  if (config.keywords) {
    setMeta("keywords", config.keywords);
  }

  if (config.extraMeta) {
    Object.entries(config.extraMeta).forEach(([name, content]) => {
      if (typeof content === "string") {
        setMeta(name, content);
      }
    });
  }
}

export function useSEO() {
  const location = useLocation();

  useEffect(() => {
    let isActive = true;
    const path = location.pathname;
    const fallbackConfig = META_CONFIG[path];
    applyMeta(fallbackConfig);

    const loadDynamicMeta = async () => {
      try {
        const record = await fetchSeoRecordByPath(path);
        if (!isActive || !record) {
          return;
        }

        const mergedExtraMeta = {
          ...(fallbackConfig?.extraMeta ?? {}),
          ...(record.extra_meta ?? {}),
        } as Record<string, string> | undefined;

        applyMeta({
          title: record.title ?? fallbackConfig?.title,
          description: record.description ?? fallbackConfig?.description,
          keywords: record.keywords ?? fallbackConfig?.keywords,
          extraMeta: mergedExtraMeta ?? null,
        });
      } catch (error) {
        console.error("Failed to load dynamic SEO metadata", error);
      }
    };

    loadDynamicMeta();

    return () => {
      isActive = false;
    };
  }, [location.pathname]);
}
