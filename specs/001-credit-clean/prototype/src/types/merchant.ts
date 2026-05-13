export interface PerformanceAndCommercialHealth {
  quality_score: number | null;
  customer_rating: number | null;
  total_reviews: number | null;
  cancellation_rate_pct: number;
  avg_delivery_time_min: number;
  price_positioning: string;
  min_order_value: number | null;
  chain_locations: number;
  dominant_daypart: string;
  avg_daily_orders?: number | null;
  avg_daily_orders_dinner?: number | null;
  avg_daily_orders_lunch?: number | null;
}

export interface CustomerConversionFunnel {
  catalog_visits_4w: number | null;
  viewed_items_pct: number | null;
  added_to_cart_pct: number | null;
  checkout_pct: number | null;
  purchase_pct: number | null;
}

export interface DeliveryAndFulfillment {
  ifood_delivered_pct: number | null;
  merchant_delivered_pct: number | null;
  takeout_pct: number | null;
  avg_gross_delivery_fee: number | null;
  late_delivery_pct: number | null;
  avg_delay_min: number | null;
}

export interface LcmProfile {
  executive_merchant_summary: string;
  core_identity_and_culinary_positioning: string;
  performance_and_commercial_health: PerformanceAndCommercialHealth;
  customer_conversion_funnel: CustomerConversionFunnel;
  delivery_and_fulfillment: DeliveryAndFulfillment;
  top_popular_items: string[];
  top_trending_items: string[];
}

export type PerformanceClassification = 'CONTA ESTRATEGICA' | 'LONG TAIL' | null;

export interface Merchant {
  frn_id: number;
  merchant_id: string | null;
  trading_name: string;
  city: string;
  state: string;
  neighborhood: string;
  cuisine: string;
  merchant_category: string;
  average_ticket: number | null;
  performance_classification: PerformanceClassification;
  lcm_generation_date: string;
  lcm_profile: LcmProfile;
}
