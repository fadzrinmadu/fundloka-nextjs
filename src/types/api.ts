export interface ApiResponse<T> {
  meta: {
    message: string;
    code: number;
    status: string;
  };
  data: T;
}

export interface User {
  id: number;
  name: string;
  occupation: string;
  email: string;
  token?: string;
  image_url: string;
}

export interface Campaign {
  id: number;
  user_id: number;
  name: string;
  short_description: string;
  image_url: string;
  goal_amount: number;
  current_amount: number;
  slug: string;
}

export interface CampaignImage {
  image_url: string;
  is_primary: boolean;
}

export interface CampaignUser {
  name: string;
  image_url: string;
}

export interface CampaignDetail {
  id: number;
  name: string;
  short_description: string;
  description: string;
  image_url: string;
  goal_amount: number;
  current_amount: number;
  backer_count: number;
  user_id: number;
  slug: string;
  perks: string[];
  user: CampaignUser;
  images: CampaignImage[];
}

export interface CampaignTransaction {
  id: number;
  name: string;
  amount: number;
  created_at: string;
}

export interface UserTransaction {
  id: number;
  amount: number;
  status: string;
  created_at: string;
  campaign: {
    name: string;
    image_url: string;
  };
}

export interface CreatedTransaction {
  id: number;
  campaign_id: number;
  user_id: number;
  amount: number;
  status: string;
  code: string | null;
  payment_url: string | null;
}
