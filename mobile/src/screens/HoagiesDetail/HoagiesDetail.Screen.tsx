import React, {useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import {RootStackParamList} from '../../types/navigation';
import {Comment} from '../../core/Modules/Comments/Dto/Comment.dto';
import {useHoagieDetailPresenter} from '../../presenters/HoagiesDetail.presenter';
import {SECONDARY_COLOR} from '../../utils/colors';
import {styles} from './styles';

type HoagieDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'HoagieDetail'
>;

const HoagieDetailScreen: React.FC = () => {
  const route = useRoute<HoagieDetailScreenRouteProp>();
  const {id} = route.params;

  const {state, actions} = useHoagieDetailPresenter(id);

  const headerOpacity = useSharedValue(0);
  const imageScale = useSharedValue(0.9);

  React.useEffect(() => {
    headerOpacity.value = withTiming(1, {duration: 800});
    imageScale.value = withTiming(1, {duration: 800});
  }, [headerOpacity, imageScale]);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: imageScale.value}],
    };
  });

  const renderCommentItem = useCallback(
    ({item, index}: {item: Comment; index: number}) => {
      return (
        <Animated.View
          key={index}
          style={styles.commentItem}
          entering={FadeIn.delay(index * 100)}>
          <View style={styles.commentHeader}>
            <View style={styles.commentUser}>
              <Icon name="person-circle-outline" size={24} color="#666" />
              <Text style={styles.userName}>{item.user.name}</Text>
            </View>
            <Text style={styles.commentDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <Text style={styles.commentText}>{item.text}</Text>
        </Animated.View>
      );
    },
    [],
  );

  if (state.loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#ff6b6b" />
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#ff6b6b" />
        <Icon name="alert-circle-outline" size={60} color="#ff6b6b" />
        <Text style={styles.errorText}>{state.error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={actions.retry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!state.hoagie) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={actions.onRefresh}
            colors={['#ff6b6b']}
          />
        }>
        <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
          {state.hoagie.pictureUrl ? (
            <Image
              source={{uri: state.hoagie.pictureUrl}}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="fast-food" size={80} color="#ccc" />
            </View>
          )}
        </Animated.View>

        <Animated.View style={[styles.infoContainer, headerAnimatedStyle]}>
          <Text style={styles.title}>{state.hoagie.name}</Text>

          <View style={styles.creatorContainer}>
            <Icon name="person" size={16} color="#666" />
            <Text style={styles.creatorName}>
              Created by {state.hoagie.creator.name}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Ingredients</Text>
          <View style={styles.ingredientsList}>
            {state.hoagie.ingredients.map(ingredient => (
              <View key={ingredient._id} style={styles.ingredientItem}>
                <Icon
                  name="checkmark-circle"
                  size={18}
                  color={SECONDARY_COLOR}
                />
                <Text style={styles.ingredientText}>
                  {ingredient.name}{' '}
                  {ingredient.quantity ? `(${ingredient.quantity})` : ''}
                </Text>
              </View>
            ))}
          </View>

          {state.hoagie.collaborators &&
            state.hoagie.collaborators.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Collaborators</Text>
                <View style={styles.collaboratorsList}>
                  {state.hoagie.collaborators.map(
                    (collaborator: {name: string}, index: number) => (
                      <View key={index} style={styles.collaboratorItem}>
                        <Icon name="person-circle" size={18} color="#ff6b6b" />
                        <Text style={styles.collaboratorText}>
                          {collaborator.name}
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              </>
            )}

          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>
              Comments ({state.hoagie.commentCount})
            </Text>

            <View style={styles.addCommentContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                value={state.newComment}
                onChangeText={actions.updateCommentText}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!state.newComment.trim() || state.isSubmitting) &&
                    styles.disabledButton,
                ]}
                onPress={actions.submitComment}
                disabled={!state.newComment.trim() || state.isSubmitting}>
                {state.isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Icon name="send" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>

            {state.commentsLoading ? (
              <View style={styles.commentsLoading}>
                <ActivityIndicator size="small" color="#ff6b6b" />
                <Text style={styles.loadingText}>Loading comments...</Text>
              </View>
            ) : state.comments.length === 0 ? (
              <View style={styles.noComments}>
                <Icon name="chatbubble-outline" size={40} color="#ccc" />
                <Text style={styles.noCommentsText}>No comments yet</Text>
                <Text style={styles.noCommentsSubtext}>Be the first</Text>
              </View>
            ) : (
              <View style={styles.commentsList}>
                {state.comments.map((comment, index) =>
                  renderCommentItem({item: comment, index}),
                )}

                {state.hasMoreComments && (
                  <TouchableOpacity
                    style={styles.loadMoreButton}
                    onPress={actions.loadMoreComments}
                    disabled={state.loadingMoreComments}>
                    {state.loadingMoreComments ? (
                      <ActivityIndicator size="small" color="#ff6b6b" />
                    ) : (
                      <Text style={styles.loadMoreText}>
                        Loading more comments
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HoagieDetailScreen;
