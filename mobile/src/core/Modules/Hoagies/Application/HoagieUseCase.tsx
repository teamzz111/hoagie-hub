import {Comment, CommentListResponse} from '../../Comments/Dto/Comment.dto';
import {
  CreateHoagieRequest,
  CreateHoagieResponse,
} from '../Dto/CreateHoagies.dto';
import {Hoagie, HoagieListResponse, PaginationParams} from '../Dto/Hoagies.dto';
import {hoagieRepository} from '../Repository/Hoagies.repository';

export class GetHoagiesUseCase {
  async execute(params: PaginationParams): Promise<HoagieListResponse> {
    try {
      return await hoagieRepository.getHoagies(params);
    } catch (error) {
      console.error('Error in GetHoagiesUseCase:', error);
      throw error;
    }
  }

  async getDetail(id: string): Promise<Hoagie> {
    try {
      return await hoagieRepository.getHoagieById(id);
    } catch (error) {
      console.error('Error in GetHoagieDetailUseCase:', error);
      throw error;
    }
  }

  async getHoagieComments(
    hoagieId: string,
    params?: PaginationParams,
  ): Promise<CommentListResponse> {
    try {
      return await hoagieRepository.getHoagieComments(hoagieId, params);
    } catch (error) {
      console.error('Error in GetHoagieCommentsUseCase:', error);
      throw error;
    }
  }

  async addHoagieComment(hoagieId: string, text: string): Promise<Comment> {
    try {
      if (!text.trim()) {
        throw new Error('Comment text cannot be empty');
      }

      return await hoagieRepository.addComment(hoagieId, text);
    } catch (error) {
      console.error('Error in AddCommentUseCase:', error);
      throw error;
    }
  }
  async addHoagie(data: CreateHoagieRequest): Promise<CreateHoagieResponse> {
    try {
      return await hoagieRepository.createHoagie(data);
    } catch (error) {
      console.error('Error in CreateHoagieUseCase:', error);
      throw error;
    }
  }
}

export const getHoagiesUseCase = new GetHoagiesUseCase();
