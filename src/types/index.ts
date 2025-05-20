export interface User {
  id: number;
  email: string;
  name: string | null;
  created_at: string;
}

export interface Logo {
  id: number;
  user_id: number;
  business_name: string;
  niche: string;
  colors: string;
  image_url: string;
  created_at: string;
  edited: boolean;
}

export interface GenerateLogoParams {
  businessName: string;
  niche: string;
  colors: string;
}

export interface LogoEditOptions {
  logoId?: number;
  imageUrl: string;
  size?: string; // small, medium, large
  fontFamily?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

// NextAuth types extension
declare module "next-auth" {
  interface User {
    id: string;
    name?: string;
    email: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string;
      email: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}