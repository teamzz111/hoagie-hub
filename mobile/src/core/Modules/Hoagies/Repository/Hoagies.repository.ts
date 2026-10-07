import axios from '../../../../utils/axios';
import {
  CreateHoagieRequest,
  CreateHoagieResponse,
} from '../Dto/CreateHoagies.dto';
import {Hoagie, HoagieListResponse, PaginationParams} from '../Dto/Hoagies.dto';

export class HoagieRepository {
  async getHoagies(params: PaginationParams): Promise<HoagieListResponse> {
    try {
      const response = await axios.get<HoagieListResponse>('/hoagies', {
        params: {
          page: params.page,
          limit: params.limit,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching hoagies:', error);
      throw error;
    }
  }

  async getHoagieById(id: string): Promise<Hoagie> {
    try {
      const response = await axios.get<Hoagie>(`/hoagies/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching hoagie with id ${id}:`, error);
      throw error;
    }
  }

  async getHoagieComments(hoagieId: string, params?: PaginationParams) {
    try {
      const response = await axios.get(`/comments/hoagie/${hoagieId}`, {
        params: params,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for hoagie ${hoagieId}:`, error);
      throw error;
    }
  }

  async addComment(hoagieId: string, text: string) {
    try {
      const response = await axios.post('/comments', {
        hoagie: hoagieId,
        text,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error(`Error adding comment to hoagie ${hoagieId}:`, error);
      throw error;
    }
  }

  async createHoagie(data: CreateHoagieRequest): Promise<CreateHoagieResponse> {
    try {
      const response = await axios.post<CreateHoagieResponse>('/hoagies', data);
      return response.data;
    } catch (error) {
      console.error('Error creating hoagie:', error);
      throw error;
    }
  }
}

export const hoagieRepository = new HoagieRepository();
