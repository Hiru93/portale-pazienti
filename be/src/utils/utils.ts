import * as bcrypt from 'bcrypt';
import moment from 'moment';

export const saltGen = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const compareHash = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const result = await bcrypt.compare(password, hash);
  return result;
};

export const sanitizeNumber = (
  num: string | number,
  isPhone?: boolean,
): string | number => {
  const str = String(num);
  return isPhone ? '+'.concat(str.replace(/\D/g, '')) : str.replace(/\D/g, '');
};

export const sanitizeString = (str: string): string => {
  return str.replace(/[^a-zA-Z0-9]/g, '');
};

export const sanitizeDate = (date: string): string => {
  return moment(date).format('YYYY-MM-DD');
};

export const sanitizeEmail = (email: string): string => {
  return email.replace(/[^a-zA-Z0-9@.]/g, '').toLowerCase();
};

export const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

// Computes a rectangular bounding box around a center point (lat, lng) given a radius in km.
// Used as a cheap pre-filter for DB queries: candidates outside the box are excluded via indexed
// WHERE clauses before applying the more expensive Haversine check.
// deltaLat is constant (~111.32 km/°), while deltaLng shrinks toward the poles (scaled by cos(lat)).
export const dbBoundingBox = ({
  lat,
  lng,
  radius,
}: {
  lat: number;
  lng: number;
  radius: number;
}) => {
  const deltaLat = radius / 111.32; // Approximate conversion from km to degrees latitude
  const deltaLng = radius / (111.32 * Math.cos((lat * Math.PI) / 180)); // Approximate conversion from km to degrees longitude

  return {
    minLat: lat - deltaLat,
    maxLat: lat + deltaLat,
    minLng: lng - deltaLng,
    maxLng: lng + deltaLng,
  };
};

// Computes the great-circle distance in km between two points on Earth using the Haversine formula.
// Applied after the bounding box pre-filter to discard candidates that fall inside the rectangle
// but outside the actual circular radius (corners of the box can be up to ~41% farther than the radius).
export const haversineDistance = ({
  lat1,
  lng1,
  lat2,
  lng2,
}: {
  lat1: number;
  lng1: number;
  lat2: number;
  lng2: number;
}): number => {
  const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

  const R = 6371; // Earth radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};
