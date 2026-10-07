import {useState, useCallback, useRef} from 'react';
import {Alert} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Hoagie} from '../core/Modules/Hoagies/Dto/Hoagies.dto';
import {hoagieActions} from '../actions/HoagiesAction/Hoagies.action';

export const useHoagieListPresenter = () => {
  const [hoagies, setHoagies] = useState<Hoagie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoadingRef = useRef(false);
  const retryAttempts = useRef(0);
  const MAX_RETRY_ATTEMPTS = 3;

  const fetchHoagies = async (pageNum = 1, isRefreshing = false) => {
    if (isLoadingRef.current) {
      return;
    }

    if (
      pageNum === 1 &&
      !isRefreshing &&
      retryAttempts.current >= MAX_RETRY_ATTEMPTS
    ) {
      setError(
        'Máximo número de intentos alcanzado. Por favor, intente más tarde.',
      );
      setLoading(false);
      return;
    }

    try {
      isLoadingRef.current = true;

      if (isRefreshing) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      const response = await hoagieActions.fetchHoagies({
        page: pageNum,
        limit: 10,
      });

      const {data, meta} = response;

      if (pageNum === 1) {
        setHoagies(data);
      } else {
        setHoagies(prev => [...prev, ...data]);
      }

      setTotalCount(meta.total);
      setHasMore(pageNum < meta.pages);

      retryAttempts.current = 0;
    } catch (err) {
      if (pageNum === 1 && !isRefreshing) {
        retryAttempts.current += 1;
      }

      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );

      if (!isRefreshing && pageNum === 1) {
        Alert.alert('Error', 'Failed to load hoagies. Please try again later.');
      }
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = useCallback(() => {
    setPage(1);
    fetchHoagies(1, true);
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore && !isLoadingRef.current) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchHoagies(nextPage);
    }
  }, [hasMore, loadingMore, page]);

  useFocusEffect(
    useCallback(() => {
      if (
        hoagies.length === 0 ||
        (error && retryAttempts.current < MAX_RETRY_ATTEMPTS)
      ) {
        fetchHoagies(1);
      }
    }, [error, hoagies.length]),
  );

  const retry = useCallback(() => {
    retryAttempts.current = 0;
    fetchHoagies(1);
  }, []);

  return {
    state: {
      hoagies,
      loading,
      refreshing,
      hasMore,
      totalCount,
      loadingMore,
      error,
    },
    actions: {
      fetchHoagies,
      onRefresh,
      loadMore,
      retry,
    },
  };
};
