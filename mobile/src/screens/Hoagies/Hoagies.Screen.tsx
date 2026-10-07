import React, {useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Swipeable} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigation';
import {useHoagieListPresenter} from '../../presenters/Hoagies.Presenter';
import {Hoagie} from '../../core/Modules/Hoagies/Dto/Hoagies.dto';
import {styles} from './styles';

type HoagieListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Main'
>;

const HoagieListScreen: React.FC = () => {
  const navigation = useNavigation<HoagieListScreenNavigationProp>();
  const {state, actions} = useHoagieListPresenter();

  const headerAnimation = useSharedValue(0);

  React.useEffect(() => {
    headerAnimation.value = withTiming(1, {duration: 600});
  }, [headerAnimation]);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerAnimation.value,
      transform: [
        {translateY: interpolate(headerAnimation.value, [0, 1], [20, 0])},
      ],
    };
  });

  const renderHoagieItem = useCallback(
    ({item, index}: {item: Hoagie; index: number}) => {
      return (
        <Swipeable>
          <Animated.View
            style={styles.hoagieCard}
            entering={FadeIn.delay(index * 100).springify()}
            exiting={FadeOut}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('HoagieDetail', {
                  id: item._id,
                  name: item.name,
                })
              }
              activeOpacity={0.7}>
              <View style={styles.cardContent}>
                {item.pictureUrl ? (
                  <Image
                    source={{uri: item.pictureUrl}}
                    style={styles.hoagieImage}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Icon name="fast-food" size={40} color="#ccc" />
                  </View>
                )}
                <View style={styles.hoagieInfo}>
                  <Text style={styles.hoagieName}>{item.name}</Text>
                  <Text style={styles.hoagieIngredients}>
                    {item.ingredients
                      .map(ing => ing.name)
                      .slice(0, 3)
                      .join(', ')}
                    {item.ingredients.length > 3 ? '...' : ''}
                  </Text>
                  <View style={styles.metaContainer}>
                    <View style={styles.creatorContainer}>
                      <Icon name="person" size={16} color="#666" />
                      <Text style={styles.creatorName}>
                        {item.creator.name}
                      </Text>
                    </View>
                    <View style={styles.commentContainer}>
                      <Icon name="chatbubble-outline" size={16} color="#666" />
                      <Text style={styles.commentCount}>
                        {item.commentCount}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Swipeable>
      );
    },
    [navigation],
  );

  if (state.loading) {
    return (
      <View style={styles.centeredContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={styles.centeredContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
        <Icon name="alert-circle-outline" size={60} color="#ff6b6b" />
        <Text style={styles.errorText}>{state.error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={actions.retry}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
        <Text style={styles.headerTitle}>Hoagie App</Text>
        <Text style={styles.totalCount}>{state.totalCount} Hoagies</Text>
      </Animated.View>

      <FlatList
        data={state.hoagies}
        keyExtractor={item => item._id}
        renderItem={renderHoagieItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={actions.onRefresh}
            colors={['#ff6b6b']}
          />
        }
        onEndReached={actions.loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          state.loadingMore ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator size="small" color="#ff6b6b" />
              <Text style={styles.footerText}>Loading more hoagies...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="fast-food-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No hoagies found</Text>
            <Text style={styles.emptySubText}>Create the first one!</Text>
          </View>
        }
      />
    </View>
  );
};

export default HoagieListScreen;
