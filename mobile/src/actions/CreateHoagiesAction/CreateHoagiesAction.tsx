import {getHoagiesUseCase} from '../../core/Modules/Hoagies/Application/HoagieUseCase';
import {
  CreateHoagieRequest,
  CreateHoagieResponse,
} from '../../core/Modules/Hoagies/Dto/CreateHoagies.dto';

export class CreateHoagieActions {
  async createHoagie(data: CreateHoagieRequest): Promise<CreateHoagieResponse> {
    try {
      return await getHoagiesUseCase.addHoagie(data);
    } catch (error) {
      console.error('Error in createHoagie action:', error);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Something went wrong');
    }
  }
}

export const createHoagieActions = new CreateHoagieActions();
