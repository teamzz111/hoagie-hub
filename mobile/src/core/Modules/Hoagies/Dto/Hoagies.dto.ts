export interface Ingredient {
  _id: string;
  name: string;
  quantity: string;
}

export interface Creator {
  _id: string;
  name: string;
  email: string;
}

export interface Hoagie {
  _id: string;
  name: string;
  ingredients: Ingredient[];
  pictureUrl?: string;
  creator: Creator;
  collaborators: {name: string}[];
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface HoagieListResponse {
  data: Hoagie[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}
