import React, {useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import {Controller} from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import {useCreateHoagiePresenter} from '../../presenters/CreateHoagiesPresenter/CreateHoagies.Presenter';
import styles from './style';
import {SECONDARY_COLOR} from '../../utils/colors';

type FieldArrayItem = {
  id: string;
  name: string;
  quantity: string;
};

const CreateHoagieScreen: React.FC = () => {
  const {state, control, actions} = useCreateHoagiePresenter();
  const scrollViewRef = useRef<ScrollView>(null);

  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(20);
  const buttonScale = useSharedValue(1);

  React.useEffect(() => {
    formOpacity.value = withTiming(1, {duration: 800});
    formTranslateY.value = withTiming(0, {duration: 800});
  }, [formOpacity, formTranslateY]);

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{translateY: formTranslateY.value}],
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: buttonScale.value}],
    };
  });

  const handleCreateHoagie = async () => {
    buttonScale.value = withSequence(
      withTiming(0.95, {duration: 100}),
      withTiming(1, {duration: 100}),
    );

    await actions.onSubmit();
  };

  const renderIngredientItem = (field: FieldArrayItem, index: number) => {
    return (
      <Animated.View
        key={field.id}
        style={styles.ingredientContainer}
        entering={FadeIn.delay(index * 100)}
        exiting={FadeOut}>
        <View style={styles.ingredientFields}>
          <View style={styles.ingredientNameContainer}>
            <Controller
              control={control}
              name={`ingredients.${index}.name`}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.ingredientNameInput,
                    state.errors?.ingredients?.[index]?.name &&
                      styles.inputError,
                  ]}
                  placeholder="Ingredient name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {state.errors?.ingredients?.[index]?.name && (
              <Text style={styles.fieldErrorText}>
                {state.errors.ingredients[index]?.name?.message}
              </Text>
            )}
          </View>
          <View style={styles.ingredientQuantityContainer}>
            <Controller
              control={control}
              name={`ingredients.${index}.quantity`}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.ingredientQuantityInput}
                  placeholder="Quantity"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeIngredientButton}
          onPress={() => actions.removeIngredient(index)}>
          <Icon name="close-circle" size={24} color={SECONDARY_COLOR} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          <Text style={styles.title}>Create New Hoagie</Text>

          {state.error && (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={20} color="#ff6b6b" />
              <Text style={styles.errorText}>{state.error}</Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hoagie name *</Text>
            <Controller
              control={control}
              name="name"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[styles.input, state.errors.name && styles.inputError]}
                  placeholder="Ex: Hoagie"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {state.errors.name && (
              <Text style={styles.fieldErrorText}>
                {state.errors.name.message}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image URL (optional)</Text>
            <Controller
              control={control}
              name="pictureUrl"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    state.errors.pictureUrl && styles.inputError,
                  ]}
                  placeholder="Ex. https://example.com/image.jpg"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {state.errors.pictureUrl && (
              <Text style={styles.fieldErrorText}>
                {state.errors.pictureUrl.message}
              </Text>
            )}
          </View>

          <View style={styles.ingredientsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ingredients *</Text>
              <TouchableOpacity
                style={styles.addIngredientButton}
                onPress={() => {
                  actions.addIngredient();
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({animated: true});
                  }, 100);
                }}>
                <Icon name="add-circle" size={24} color={SECONDARY_COLOR} />
                <Text style={styles.addIngredientText}>Add</Text>
              </TouchableOpacity>
            </View>

            {state.errors.ingredients &&
              !Array.isArray(state.errors.ingredients) && (
                <Text style={styles.fieldErrorText}>
                  {state.errors.ingredients.message}
                </Text>
              )}

            <View style={styles.ingredientsList}>
              {state.fields.map(renderIngredientItem)}
            </View>
          </View>

          <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
            <TouchableOpacity
              style={[
                styles.createButton,
                state.isSubmitting && styles.disabledButton,
              ]}
              onPress={handleCreateHoagie}
              disabled={state.isSubmitting}>
              {state.isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Icon name="add-circle-outline" size={20} color="white" />
                  <Text style={styles.createButtonText}>Create Hoagie</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateHoagieScreen;
