export interface MainPageFilter {
  minPrice?: number;
  maxPrice?: number;
  isHighRating?: boolean;
  subcategories?: string[];
  details?: string[];
  name?: string;
  categoryNames?: string;
  adName?: string;
  category?: string;
  limit?: number;
  offset?: number;
}
