/**
 * constants.js
 * Central place for all app-wide constants.
 * Keeping these here makes it easy to update values in one place.
 */

/**
 * Supported currencies.
 * `symbol` is used in form field labels (e.g. "Price per Litre (GH₵)").
 * `code`   is the ISO 4217 code passed to Intl.NumberFormat.
 * `locale` controls number-formatting conventions (decimal / thousands separator).
 */
export const CURRENCIES = [
  { code: 'GHS', locale: 'en-GH',  symbol: 'GH₵', name: 'Ghana Cedi' },
  { code: 'USD', locale: 'en-US',  symbol: '$',   name: 'US Dollar' },
  { code: 'EUR', locale: 'en-IE',  symbol: '€',   name: 'Euro' },
  { code: 'GBP', locale: 'en-GB',  symbol: '£',   name: 'British Pound' },
  { code: 'NGN', locale: 'en-NG',  symbol: '₦',   name: 'Nigerian Naira' },
  { code: 'KES', locale: 'en-KE',  symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'ZAR', locale: 'en-ZA',  symbol: 'R',   name: 'South African Rand' },
  { code: 'EGP', locale: 'ar-EG',  symbol: 'E£',  name: 'Egyptian Pound' },
  { code: 'ETB', locale: 'am-ET',  symbol: 'Br',  name: 'Ethiopian Birr' },
  { code: 'TZS', locale: 'sw-TZ',  symbol: 'TSh', name: 'Tanzanian Shilling' },
  { code: 'UGX', locale: 'en-UG',  symbol: 'USh', name: 'Ugandan Shilling' },
  { code: 'RWF', locale: 'rw-RW',  symbol: 'RF',  name: 'Rwandan Franc' },
  { code: 'XOF', locale: 'fr-SN',  symbol: 'CFA', name: 'West African CFA Franc' },
  { code: 'XAF', locale: 'fr-CM',  symbol: 'FCFA',name: 'Central African CFA Franc' },
  { code: 'MAD', locale: 'ar-MA',  symbol: 'MAD', name: 'Moroccan Dirham' },
  { code: 'INR', locale: 'en-IN',  symbol: '₹',   name: 'Indian Rupee' },
  { code: 'PKR', locale: 'ur-PK',  symbol: '₨',   name: 'Pakistani Rupee' },
  { code: 'BDT', locale: 'bn-BD',  symbol: '৳',   name: 'Bangladeshi Taka' },
  { code: 'LKR', locale: 'si-LK',  symbol: 'Rs',  name: 'Sri Lankan Rupee' },
  { code: 'NPR', locale: 'ne-NP',  symbol: 'रू',  name: 'Nepalese Rupee' },
  { code: 'AED', locale: 'ar-AE',  symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', locale: 'ar-SA',  symbol: '﷼',   name: 'Saudi Riyal' },
  { code: 'QAR', locale: 'ar-QA',  symbol: 'QR',  name: 'Qatari Riyal' },
  { code: 'KWD', locale: 'ar-KW',  symbol: 'KD',  name: 'Kuwaiti Dinar' },
  { code: 'OMR', locale: 'ar-OM',  symbol: 'OMR', name: 'Omani Rial' },
  { code: 'JPY', locale: 'ja-JP',  symbol: '¥',   name: 'Japanese Yen' },
  { code: 'CNY', locale: 'zh-CN',  symbol: '¥',   name: 'Chinese Yuan' },
  { code: 'KRW', locale: 'ko-KR',  symbol: '₩',   name: 'South Korean Won' },
  { code: 'SGD', locale: 'en-SG',  symbol: 'S$',  name: 'Singapore Dollar' },
  { code: 'MYR', locale: 'ms-MY',  symbol: 'RM',  name: 'Malaysian Ringgit' },
  { code: 'THB', locale: 'th-TH',  symbol: '฿',   name: 'Thai Baht' },
  { code: 'PHP', locale: 'en-PH',  symbol: '₱',   name: 'Philippine Peso' },
  { code: 'IDR', locale: 'id-ID',  symbol: 'Rp',  name: 'Indonesian Rupiah' },
  { code: 'VND', locale: 'vi-VN',  symbol: '₫',   name: 'Vietnamese Dong' },
  { code: 'HKD', locale: 'zh-HK',  symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'TWD', locale: 'zh-TW',  symbol: 'NT$', name: 'New Taiwan Dollar' },
  { code: 'CAD', locale: 'en-CA',  symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', locale: 'en-AU',  symbol: 'A$',  name: 'Australian Dollar' },
  { code: 'NZD', locale: 'en-NZ',  symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'BRL', locale: 'pt-BR',  symbol: 'R$',  name: 'Brazilian Real' },
  { code: 'MXN', locale: 'es-MX',  symbol: 'MX$', name: 'Mexican Peso' },
  { code: 'ARS', locale: 'es-AR',  symbol: '$',   name: 'Argentine Peso' },
  { code: 'COP', locale: 'es-CO',  symbol: '$',   name: 'Colombian Peso' },
  { code: 'CLP', locale: 'es-CL',  symbol: '$',   name: 'Chilean Peso' },
  { code: 'PEN', locale: 'es-PE',  symbol: 'S/',  name: 'Peruvian Sol' },
  { code: 'CHF', locale: 'de-CH',  symbol: 'Fr',  name: 'Swiss Franc' },
  { code: 'SEK', locale: 'sv-SE',  symbol: 'kr',  name: 'Swedish Krona' },
  { code: 'NOK', locale: 'nb-NO',  symbol: 'kr',  name: 'Norwegian Krone' },
  { code: 'DKK', locale: 'da-DK',  symbol: 'kr',  name: 'Danish Krone' },
  { code: 'PLN', locale: 'pl-PL',  symbol: 'zł',  name: 'Polish Zloty' },
  { code: 'CZK', locale: 'cs-CZ',  symbol: 'Kč',  name: 'Czech Koruna' },
  { code: 'HUF', locale: 'hu-HU',  symbol: 'Ft',  name: 'Hungarian Forint' },
  { code: 'RON', locale: 'ro-RO',  symbol: 'lei', name: 'Romanian Leu' },
  { code: 'RUB', locale: 'ru-RU',  symbol: '₽',   name: 'Russian Ruble' },
  { code: 'TRY', locale: 'tr-TR',  symbol: '₺',   name: 'Turkish Lira' },
  { code: 'UAH', locale: 'uk-UA',  symbol: '₴',   name: 'Ukrainian Hryvnia' },
];

/** Default currency — Ghana Cedi */
export const DEFAULT_CURRENCY = CURRENCIES[0];

// Fuel types available when logging a fill-up
export const FUEL_TYPES = [
  'Petrol (Regular)',
  'Petrol (Premium)',
  'Diesel',
  'E10',
  'E85',
  'LPG',
  'Electric',
];

// Maintenance record types with mileage-based service intervals (in km)
export const MAINTENANCE_TYPES = [
  { label: 'Oil Change', value: 'oil_change', intervalKm: 5000 },
  { label: 'Air Filter Replacement', value: 'air_filter', intervalKm: 15000 },
  { label: 'Tire Rotation', value: 'tire_rotation', intervalKm: 10000 },
  { label: 'Battery Replacement', value: 'battery', intervalKm: 60000 },
  { label: 'Brake Service', value: 'brake_service', intervalKm: 30000 },
  { label: 'Coolant Flush', value: 'coolant', intervalKm: 40000 },
  { label: 'Transmission Service', value: 'transmission', intervalKm: 50000 },
  { label: 'Spark Plugs', value: 'spark_plugs', intervalKm: 30000 },
  { label: 'Wiper Blades', value: 'wiper_blades', intervalKm: 12000 },
  { label: 'Cabin Air Filter', value: 'cabin_filter', intervalKm: 20000 },
  { label: 'General Inspection', value: 'inspection', intervalKm: 10000 },
  { label: 'Other', value: 'other', intervalKm: 0 },
];

// LocalStorage keys — centralised so they never get out of sync
export const STORAGE_KEYS = {
  FUEL_LOGS: 'fuelwise_fuel_logs',
  MAINTENANCE: 'fuelwise_maintenance',
  VEHICLE: 'fuelwise_vehicle',
  DARK_MODE: 'fuelwise_dark_mode',
  CURRENCY: 'fuelwise_currency',
};

// Default vehicle profile loaded on first visit
export const DEFAULT_VEHICLE = {
  name: 'My Vehicle',
  make: '',
  model: '',
  year: new Date().getFullYear(),
  licensePlate: '',
  tankCapacity: 50, // litres
};

// Chart colour palette aligned with our design system
export const CHART_COLORS = {
  primary: '#6366f1',   // indigo-500
  secondary: '#22d3ee', // cyan-400
  accent: '#f59e0b',    // amber-500
  success: '#10b981',   // emerald-500
  danger: '#ef4444',    // red-500
  purple: '#a855f7',    // purple-500
};
