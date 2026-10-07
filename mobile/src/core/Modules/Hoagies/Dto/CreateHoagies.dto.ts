import {Creator} from './Hoagies.dto';

export interface CreateHoagieIngredient {
  name: string;
  quantity: string;
}

export interface CreateHoagieRequest {
  name: string;
  ingredients: CreateHoagieIngredient[];
  pictureUrl?: string;
}

export interface CreateHoagieResponse {
  _id: string;
  name: string;
  ingredients: {
    name: string;
    quantity: string;
    _id: string;
  }[];
  pictureUrl?: string;
  creator: Creator;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
