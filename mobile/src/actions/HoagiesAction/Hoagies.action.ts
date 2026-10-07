import {getHoagiesUseCase} from '../../core/Modules/Hoagies/Application/HoagieUseCase';
import {
  Hoagie,
  PaginationParams,
} from '../../core/Modules/Hoagies/Dto/Hoagies.dto';

export class HoagieActions {
  async fetchHoagies(params: PaginationParams): Promise<{
    data: Hoagie[];
    meta: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  }> {
    try {
      const response = await getHoagiesUseCase.execute(params);
      return {
        data: response.data,
        meta: response.meta,
      };
    } catch (error) {
      console.error('Error in fetchHoagies action:', error);

      throw new Error('Failed to fetch hoagies. Please try again later.');
    }
  }
}

export const hoagieActions = new HoagieActions();
