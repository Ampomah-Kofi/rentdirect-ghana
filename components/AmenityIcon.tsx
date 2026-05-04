import {
  Droplets,
  Zap,
  Shield,
  Camera,
  Grid3X3,
  Wind,
  Thermometer,
  Home,
  TreePine,
  Car,
  UtensilsCrossed,
  Bath,
  MapPin,
  Sofa,
  Wifi,
  ShoppingCart,
  Cross,
  GraduationCap,
  Route,
  Check,
  type LucideProps,
} from "lucide-react";
import type { Amenity } from "@/lib/ghana-locations";

interface AmenityIconProps {
  amenity: string;
  size?: number;
}

type LucideIcon = React.ComponentType<LucideProps>;

const ICON_MAP: Record<string, { icon: LucideIcon; color: string }> = {
  "Water Tank": { icon: Droplets, color: "text-blue-500" },
  "Borehole": { icon: Droplets, color: "text-blue-500" },
  "Generator": { icon: Zap, color: "text-yellow-500" },
  "Prepaid Meter": { icon: Zap, color: "text-yellow-500" },
  "Security Guard": { icon: Shield, color: "text-green-600" },
  "Gated Community": { icon: Shield, color: "text-green-600" },
  "CCTV": { icon: Camera, color: "text-slate-500" },
  "Tiled Floor": { icon: Grid3X3, color: "text-gray-500" },
  "Ceiling Fan": { icon: Wind, color: "text-sky-500" },
  "Air Conditioning": { icon: Thermometer, color: "text-blue-500" },
  "Veranda": { icon: Home, color: "text-green-600" },
  "Compound": { icon: TreePine, color: "text-green-600" },
  "Parking": { icon: Car, color: "text-gray-500" },
  "Kitchen": { icon: UtensilsCrossed, color: "text-orange-500" },
  "Indoor Toilet": { icon: Bath, color: "text-blue-500" },
  "Bathroom": { icon: Bath, color: "text-blue-500" },
  "Outdoor Toilet": { icon: MapPin, color: "text-gray-500" },
  "Furnished": { icon: Sofa, color: "text-purple-500" },
  "Internet/WiFi": { icon: Wifi, color: "text-blue-500" },
  "Close to Market": { icon: ShoppingCart, color: "text-orange-500" },
  "Close to Hospital": { icon: Cross, color: "text-red-500" },
  "Close to School": { icon: GraduationCap, color: "text-blue-500" },
  "Main Road Access": { icon: Route, color: "text-gray-500" },
};

export function AmenityIcon({ amenity, size = 16 }: AmenityIconProps) {
  const config = ICON_MAP[amenity];
  if (!config) {
    return <Check className="text-gray-400" size={size} />;
  }
  const IconComponent = config.icon;
  return <IconComponent className={config.color} size={size} />;
}

export const AMENITY_CATEGORIES: { label: string; amenities: Amenity[] }[] = [
  {
    label: "Essentials",
    amenities: ["Water Tank", "Borehole", "Prepaid Meter", "Indoor Toilet", "Outdoor Toilet", "Bathroom", "Kitchen"],
  },
  {
    label: "Security",
    amenities: ["Security Guard", "CCTV", "Gated Community"],
  },
  {
    label: "Comfort",
    amenities: ["Ceiling Fan", "Air Conditioning", "Tiled Floor", "Furnished", "Internet/WiFi", "Veranda"],
  },
  {
    label: "Outdoor",
    amenities: ["Compound", "Parking", "Main Road Access", "Close to Market", "Close to Hospital", "Close to School"],
  },
];
