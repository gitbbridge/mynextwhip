import { BodyStyle, DrivetrainType, TransmissionType, Vehicle } from '../types';

export interface DecodedVinResult {
  valid: boolean;
  error?: string;
  source: 'NHTSA_API' | 'LOCAL_REGISTRY' | 'ESTIMATED';
  data?: Partial<Vehicle>;
}

// Famous known enthusiast & budget test VINs for rapid testing
const KNOWN_VIN_DATABASE: Record<string, Partial<Vehicle>> = {
  '5TFRX44N88Z482910': {
    vin: '5TFRX44N88Z482910',
    year: 2008,
    make: 'Toyota',
    model: 'Tacoma',
    trim: 'SR5 Access Cab 4WD',
    engine: '4.0L V6 DOHC 24V (236 hp)',
    transmission: 'Automatic',
    drivetrain: '4WD',
    bodyStyle: 'Truck',
    fuelType: 'Gasoline',
    exteriorColor: 'Silver Streak Mica',
    interiorColor: 'Graphite Cloth',
    titleStatus: 'Clean',
    mileage: 184221,
  },
  '1HGES16544L029482': {
    vin: '1HGES16544L029482',
    year: 2004,
    make: 'Honda',
    model: 'Civic',
    trim: 'EX Sedan',
    engine: '1.7L I4 VTEC (127 hp)',
    transmission: 'Manual',
    drivetrain: 'FWD',
    bodyStyle: 'Sedan',
    fuelType: 'Gasoline',
    exteriorColor: 'Fiji Blue Pearl',
    interiorColor: 'Grey Cloth',
    titleStatus: 'Clean',
    mileage: 218500,
  },
  '1J4FF68S9XL582910': {
    vin: '1J4FF68S9XL582910',
    year: 1999,
    make: 'Jeep',
    model: 'Cherokee',
    trim: 'Sport 4.0 4x4 (XJ)',
    engine: '4.0L AMC Inline-6 (190 hp)',
    transmission: 'Automatic',
    drivetrain: '4WD',
    bodyStyle: 'SUV',
    fuelType: 'Gasoline',
    exteriorColor: 'Forest Green Pearl',
    interiorColor: 'Agate Gray',
    titleStatus: 'Clean',
    mileage: 231400,
  },
  'JM1NA3512P1104829': {
    vin: 'JM1NA3512P1104829',
    year: 1993,
    make: 'Mazda',
    model: 'Miata',
    trim: 'Base (NA6 Pop-ups)',
    engine: '1.6L DOHC 16V (116 hp)',
    transmission: 'Manual',
    drivetrain: 'RWD',
    bodyStyle: 'Convertible',
    fuelType: 'Gasoline',
    exteriorColor: 'Classic Red',
    interiorColor: 'Black Cloth',
    titleStatus: 'Clean',
    mileage: 147800,
  },
  '1FTNW21F62EB89102': {
    vin: '1FTNW21F62EB89102',
    year: 2002,
    make: 'Ford',
    model: 'F-250 Super Duty',
    trim: 'XLT 7.3 Powerstroke Diesel',
    engine: '7.3L Turbocharged V8 Diesel (250 hp / 505 lb-ft)',
    transmission: 'Automatic',
    drivetrain: '4WD',
    bodyStyle: 'Truck',
    fuelType: 'Diesel',
    exteriorColor: 'Oxford White',
    interiorColor: 'Medium Flint',
    titleStatus: 'Clean',
    mileage: 289300,
  },
  '2FABP71V7BX192847': {
    vin: '2FABP71V7BX192847',
    year: 2011,
    make: 'Ford',
    model: 'Crown Victoria',
    trim: 'Police Interceptor (P71)',
    engine: '4.6L Modular V8 (250 hp)',
    transmission: 'Automatic',
    drivetrain: 'RWD',
    bodyStyle: 'Sedan',
    fuelType: 'Gasoline',
    exteriorColor: 'Vibrant White',
    interiorColor: 'Dark Charcoal Heavy Duty',
    titleStatus: 'Clean',
    mileage: 162400,
  },
  'JF1SG63676H721948': {
    vin: 'JF1SG63676H721948',
    year: 2006,
    make: 'Subaru',
    model: 'Forester',
    trim: '2.5 XT Turbo Limited',
    engine: '2.5L Turbocharged Boxer-4 (230 hp)',
    transmission: 'Manual',
    drivetrain: 'AWD',
    bodyStyle: 'SUV',
    fuelType: 'Gasoline',
    exteriorColor: 'World Rally Blue',
    interiorColor: 'Black Leather',
    titleStatus: 'Rebuilt',
    mileage: 176500,
  },
  '1GNDM19W75B109283': {
    vin: '1GNDM19W75B109283',
    year: 2005,
    make: 'Chevrolet',
    model: 'Astro',
    trim: 'Cargo Van AWD',
    engine: '4.3L Vortec V6 (190 hp)',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    bodyStyle: 'Van',
    fuelType: 'Gasoline',
    exteriorColor: 'Summit White',
    interiorColor: 'Neutral Vinyl',
    titleStatus: 'Clean',
    mileage: 198000,
  }
};

/**
 * Validates basic 17-character VIN rules (letters I, O, Q are not allowed in standard VINs)
 */
export function validateVinFormat(rawVin: string): { isValid: boolean; normalized: string; error?: string } {
  const normalized = rawVin.trim().toUpperCase();

  if (normalized.length !== 17) {
    return {
      isValid: false,
      normalized,
      error: `VIN must be exactly 17 characters (currently ${normalized.length}).`,
    };
  }

  if (/[IOQ]/.test(normalized)) {
    return {
      isValid: false,
      normalized,
      error: 'VIN cannot contain the letters I, O, or Q.',
    };
  }

  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(normalized)) {
    return {
      isValid: false,
      normalized,
      error: 'VIN contains invalid characters. Only alphanumeric (excluding I, O, Q) are valid.',
    };
  }

  return { isValid: true, normalized };
}

/**
 * Decodes VIN with NHTSA vPIC API first, falling back to local database or intelligent parser.
 */
export async function decodeVin(rawVin: string): Promise<DecodedVinResult> {
  const formatCheck = validateVinFormat(rawVin);
  if (!formatCheck.isValid) {
    return {
      valid: false,
      error: formatCheck.error,
      source: 'LOCAL_REGISTRY',
    };
  }

  const vin = formatCheck.normalized;

  // 1. Check local fast dictionary for known enthusiast whips
  if (KNOWN_VIN_DATABASE[vin]) {
    return {
      valid: true,
      source: 'LOCAL_REGISTRY',
      data: { ...KNOWN_VIN_DATABASE[vin] },
    };
  }

  // 2. Query real NHTSA vPIC Public API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${encodeURIComponent(vin)}?format=json`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const json = await response.json();
      const result = json?.Results?.[0];

      if (result && result.Make) {
        const year = parseInt(result.ModelYear, 10) || 2005;
        const make = result.Make || 'Unknown Make';
        const model = result.Model || 'Unknown Model';
        const trim = result.Trim || result.Series || '';

        // Map Body Class
        let bodyStyle: BodyStyle = 'Sedan';
        const rawBody = (result.BodyClass || '').toLowerCase();
        if (rawBody.includes('truck') || rawBody.includes('pickup')) bodyStyle = 'Truck';
        else if (rawBody.includes('sport utility') || rawBody.includes('suv')) bodyStyle = 'SUV';
        else if (rawBody.includes('van') || rawBody.includes('minivan')) bodyStyle = 'Van';
        else if (rawBody.includes('hatchback')) bodyStyle = 'Hatchback';
        else if (rawBody.includes('wagon')) bodyStyle = 'Wagon';
        else if (rawBody.includes('coupe')) bodyStyle = 'Coupe';
        else if (rawBody.includes('convertible') || rawBody.includes('cabriolet')) bodyStyle = 'Convertible';

        // Map Drive Type
        let drivetrain: DrivetrainType = 'FWD';
        const rawDrive = (result.DriveType || '').toLowerCase();
        if (rawDrive.includes('4wd') || rawDrive.includes('four') || rawDrive.includes('4x4')) drivetrain = '4WD';
        else if (rawDrive.includes('awd') || rawDrive.includes('all')) drivetrain = 'AWD';
        else if (rawDrive.includes('rwd') || rawDrive.includes('rear')) drivetrain = 'RWD';

        // Map Transmission
        let transmission: TransmissionType = 'Automatic';
        const rawTrans = (result.TransmissionStyle || '').toLowerCase();
        if (rawTrans.includes('manual')) transmission = 'Manual';

        // Engine description
        const displacement = result.DisplacementL ? `${parseFloat(result.DisplacementL).toFixed(1)}L` : '';
        const cylinders = result.EngineCylinders ? `V${result.EngineCylinders}` : '';
        const engine = [displacement, cylinders, result.EngineConfiguration].filter(Boolean).join(' ') || 'Gas Engine';

        return {
          valid: true,
          source: 'NHTSA_API',
          data: {
            vin,
            year,
            make: make.charAt(0) + make.slice(1).toLowerCase(),
            model,
            trim,
            bodyStyle,
            drivetrain,
            transmission,
            engine: engine || 'Standard Engine',
            fuelType: result.FuelTypePrimary || 'Gasoline',
            titleStatus: 'Clean',
          },
        };
      }
    }
  } catch (err) {
    console.warn('NHTSA API lookup fell back to offline decoder:', err);
  }

  // 3. Fallback: Intelligent synthetic estimation from VIN 10th character (Model Year) and WMI
  const yearChar = vin.charAt(9);
  const yearMap: Record<string, number> = {
    '1': 2001, '2': 2002, '3': 2003, '4': 2004, '5': 2005, '6': 2006, '7': 2007,
    '8': 2008, '9': 2009, 'A': 2010, 'B': 2011, 'C': 2012, 'D': 2013, 'E': 2014,
    'F': 2015, 'G': 2016, 'H': 2017, 'J': 2018, 'K': 2019, 'L': 2020,
    'M': 1991, 'N': 1992, 'P': 1993, 'R': 1994, 'S': 1995, 'T': 1996, 'V': 1997,
    'W': 1998, 'X': 1999, 'Y': 2000,
  };
  const estimatedYear = yearMap[yearChar] || 2006;

  // WMI (World Manufacturer Identifier) sample
  const wmi = vin.substring(0, 3);
  let make = 'Domestic';
  let bodyStyle: BodyStyle = 'Sedan';
  if (wmi.startsWith('1F') || wmi.startsWith('2F') || wmi.startsWith('3F')) {
    make = 'Ford';
    bodyStyle = 'Truck';
  } else if (wmi.startsWith('1G') || wmi.startsWith('2G') || wmi.startsWith('3G')) {
    make = 'Chevrolet';
    bodyStyle = 'Truck';
  } else if (wmi.startsWith('1H') || wmi.startsWith('2H') || wmi.startsWith('JHM')) {
    make = 'Honda';
    bodyStyle = 'Sedan';
  } else if (wmi.startsWith('4T') || wmi.startsWith('5T') || wmi.startsWith('JT')) {
    make = 'Toyota';
    bodyStyle = 'Sedan';
  } else if (wmi.startsWith('JM1')) {
    make = 'Mazda';
    bodyStyle = 'Coupe';
  } else if (wmi.startsWith('1J')) {
    make = 'Jeep';
    bodyStyle = 'SUV';
  } else if (wmi.startsWith('JF')) {
    make = 'Subaru';
    bodyStyle = 'SUV';
  }

  return {
    valid: true,
    source: 'ESTIMATED',
    data: {
      vin,
      year: estimatedYear,
      make,
      model: 'Custom Vehicle',
      bodyStyle,
      drivetrain: 'FWD',
      transmission: 'Automatic',
      engine: '4-Cylinder Gas',
      fuelType: 'Gasoline',
      titleStatus: 'Clean',
    },
  };
}

export const SAMPLE_TEST_VINS = [
  { label: '2008 Toyota Tacoma SR5 4x4 (Reliable Beater Truck)', vin: '5TFRX44N88Z482910' },
  { label: '2004 Honda Civic EX 5-Speed (Daily Driver 35 MPG)', vin: '1HGES16544L029482' },
  { label: '1999 Jeep Cherokee XJ 4.0L (Trail Project / 4x4)', vin: '1J4FF68S9XL582910' },
  { label: '1993 Mazda Miata Pop-up (Cheap & Fun Autocross)', vin: 'JM1NA3512P1104829' },
  { label: '2002 Ford F-250 7.3L Diesel (Heavy Duty Hauler)', vin: '1FTNW21F62EB89102' },
  { label: '2011 Crown Victoria P71 (Indestructible Cruiser)', vin: '2FABP71V7BX192847' },
  { label: '2006 Subaru Forester XT Turbo (Mechanic Special)', vin: 'JF1SG63676H721948' },
  { label: '2005 Chevy Astro Cargo AWD (Work Van / Moto Camper)', vin: '1GNDM19W75B109283' },
];
