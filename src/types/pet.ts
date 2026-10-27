export type Species = "Dog" | "Cat" | "Rabbit" | "Other";
export type PetSize = "Small" | "Medium" | "Large" | "Extra Large";
export type PetStatus =
  "available" | "pending" | "fostered" | "adopted" | "hold";

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  age_months: number;
  gender: "Male" | "Female" | "Unknown";
  size: PetSize;
  good_with_kids: boolean;
  good_with_pets: boolean;
  status: PetStatus;
  primary_image_url: string | null;
  shelter: { id: string; name: string; city: string; state: string };
  display_status?: string;
  bio?: string;
  housing?: "Apartment" | "House" | "Condo" | "Other";
  activity_level?: "Low" | "Moderate" | "High";
  has_special_care?: boolean;
  is_spayed_neutered?: boolean;
  is_vaccinated?: boolean;
}

export interface PetSearchParams {
  species?: Species;
  breed?: string;
  min_age_months?: number;
  max_age_months?: number;
  size?: PetSize;
  good_with_kids?: boolean;
  good_with_pets?: boolean;
  shelter_id?: string;
  status?: PetStatus;
  page?: number;
  limit?: number;
}

export interface PetSearchResponse {
  data: Pet[];
  pagination: {
    current_page: number;
    per_page: number;
    total_records: number;
    total_pages: number;
  };
}

export interface LifestyleMatchParams {
  housing_type: "House" | "Apartment" | "Condo";
  owns_or_rents: "Own" | "Rent";
  has_yard: boolean;
  has_children: boolean;
  has_other_pets: boolean;
  activity_level: "low" | "moderate" | "high";
  preferred_species: Species[];
  preferred_sizes?: PetSize[];
  min_age_months?: number;
  max_age_months?: number;
  open_to_special_care?: boolean;
  limit?: number;
}

export interface MatchedPet {
  match_score: number;
  match_reasons: string[];
  pet: Pet;
}
export interface PetMatchResponse {
  matches: MatchedPet[];
}
