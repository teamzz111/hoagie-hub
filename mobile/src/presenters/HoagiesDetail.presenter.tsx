import {useState, useCallback, useRef} from 'react';
import {Alert} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {Hoagie} from '../core/Modules/Hoagies/Dto/Hoagies.dto';
import {Comment} from '../core/Modules/Comments/Dto/Comment.dto';
import {hoagieDetailActions} from '../actions/HoagiesDetailAction/HoagiesDetailAction';

export const useHoagieDetailPresenter = (hoagieId: string) => {
  const [hoagie, setHoagie] = useState<Hoagie | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoadingRef = useRef(false);
  const retryAttempts = useRef(0);
  const commentsRetryAttempts = useRef(0);
  const MAX_RETRY_ATTEMPTS = 3;

  const fetchHoagieDetail = useCallback(
    async (isRefreshing = false) => {
      if (isLoadingRef.current) {
        return;
      }

      if (!isRefreshing && retryAttempts.current >= MAX_RETRY_ATTEMPTS) {
        setError('Maximum retry attempts reached. Please try again later.');
        setLoading(false);
        return;
      }

      try {
        isLoadingRef.current = true;

        if (isRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const data = await hoagieDetailActions.fetchHoagieDetail(hoagieId);
        setHoagie(data);

        retryAttempts.current = 0;
      } catch (err) {
        if (!isRefreshing) {
          retryAttempts.current += 1;
        }

        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );

        if (!isRefreshing) {
          Alert.alert(
            'Error',
            'Failed to load hoagie details. Please try again later.',
          );
        }
      } finally {
        isLoadingRef.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [hoagieId],
  );

  const fetchComments = useCallback(
    async (page = 1, isRefreshing = false) => {
      if (
        page === 1 &&
        !isRefreshing &&
        commentsRetryAttempts.current >= MAX_RETRY_ATTEMPTS
      ) {
        setCommentError(
          'Máximo número de intentos alcanzado para cargar comentarios.',
        );
        setCommentsLoading(false);
        return;
      }

      try {
        if (isRefreshing) {
          setRefreshing(true);
        } else if (page === 1) {
          setCommentsLoading(true);
        } else {
          setLoadingMoreComments(true);
        }

        setCommentError(null);

        const response = await hoagieDetailActions.fetchHoagieComments(
          hoagieId,
          page,
        );

        if (page === 1) {
          setComments(response.data);
        } else {
          setComments(prev => [...prev, ...response.data]);
        }

        setHasMoreComments(page < response.meta.pages);

        commentsRetryAttempts.current = 0;
      } catch (err) {
        if (page === 1 && !isRefreshing) {
          commentsRetryAttempts.current += 1;
        }

        setCommentError(
          err instanceof Error ? err.message : 'Failed to load comments',
        );

        if (commentsRetryAttempts.current === 1) {
          Alert.alert(
            'Error',
            'No se pudieron cargar los comentarios. Intente nuevamente más tarde.',
          );
        }
      } finally {
        setCommentsLoading(false);
        setRefreshing(false);
        setLoadingMoreComments(false);
      }
    },
    [hoagieId],
  );

  const onRefresh = useCallback(() => {
    setCommentPage(1);
    fetchHoagieDetail(true);
    fetchComments(1, true);
  }, [fetchHoagieDetail, fetchComments]);

  const loadMoreComments = useCallback(() => {
    if (hasMoreComments && !loadingMoreComments) {
      const nextPage = commentPage + 1;
      setCommentPage(nextPage);
      fetchComments(nextPage);
    }
  }, [hasMoreComments, loadingMoreComments, commentPage, fetchComments]);

  const submitComment = useCallback(async () => {
    if (!newComment.trim() || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const addedComment = await hoagieDetailActions.addComment(
        hoagieId,
        newComment,
      );

      setComments(prev => [addedComment, ...prev]);

      if (hoagie) {
        setHoagie({
          ...hoagie,
          commentCount: hoagie.commentCount + 1,
        });
      }

      setNewComment('');
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to add comment',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [newComment, isSubmitting, hoagieId, hoagie]);

  const updateCommentText = useCallback((text: string) => {
    setNewComment(text);
  }, []);

  const retry = useCallback(() => {
    retryAttempts.current = 0;
    commentsRetryAttempts.current = 0;

    fetchHoagieDetail();
    fetchComments(1);
  }, [fetchHoagieDetail, fetchComments]);

  useFocusEffect(
    useCallback(() => {
      if ((!hoagie || error) && retryAttempts.current < MAX_RETRY_ATTEMPTS) {
        fetchHoagieDetail();
      }

      if (
        (comments.length === 0 || commentError) &&
        commentsRetryAttempts.current < MAX_RETRY_ATTEMPTS
      ) {
        fetchComments(1);
      }

      return () => {};
    }, [
      error,
      commentError,
      hoagie,
      comments.length,
      fetchHoagieDetail,
      fetchComments,
    ]),
  );

  return {
    state: {
      hoagie,
      comments,
      loading,
      commentsLoading,
      refreshing,
      hasMoreComments,
      loadingMoreComments,
      error,
      commentError,
      newComment,
      isSubmitting,
    },
    actions: {
      fetchHoagieDetail,
      fetchComments,
      onRefresh,
      loadMoreComments,
      submitComment,
      updateCommentText,
      retry,
    },
  };
};
