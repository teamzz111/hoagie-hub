import {Creator} from '../../Hoagies/Dto/Hoagies.dto';

export interface Comment {
  _id: string;
  text: string;
  user: Creator;
  hoagie: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentListResponse {
  data: Comment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface AddCommentRequest {
  text: string;
}
