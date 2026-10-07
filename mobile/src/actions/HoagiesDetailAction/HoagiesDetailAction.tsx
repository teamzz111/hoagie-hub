import {
  Comment,
  CommentListResponse,
} from '../../core/Modules/Comments/Dto/Comment.dto';
import {getHoagiesUseCase} from '../../core/Modules/Hoagies/Application/HoagieUseCase';
import {Hoagie} from '../../core/Modules/Hoagies/Dto/Hoagies.dto';

export class HoagieDetailActions {
  async fetchHoagieDetail(id: string): Promise<Hoagie> {
    try {
      return await getHoagiesUseCase.getDetail(id);
    } catch (error) {
      console.error('Error in fetchHoagieDetail action:', error);
      throw new Error(
        'Failed to fetch hoagie details. Please try again later.',
      );
    }
  }

  async fetchHoagieComments(
    hoagieId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<CommentListResponse> {
    try {
      return await getHoagiesUseCase.getHoagieComments(hoagieId, {
        page,
        limit,
      });
    } catch (error) {
      console.error('Error in fetchHoagieComments action:', error);
      throw new Error('Failed to fetch comments. Please try again later.');
    }
  }

  async addComment(hoagieId: string, text: string): Promise<Comment> {
    try {
      return await getHoagiesUseCase.addHoagieComment(hoagieId, text);
    } catch (error) {
      throw new Error('Failed to add comment. Please try again later.');
    }
  }
}

export const hoagieDetailActions = new HoagieDetailActions();
