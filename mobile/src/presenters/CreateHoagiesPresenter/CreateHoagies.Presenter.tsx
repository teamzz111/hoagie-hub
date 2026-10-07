import {useState, useCallback} from 'react';
import {Alert} from 'react-native';
import {useForm, useFieldArray} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {createHoagieActions} from '../../actions/CreateHoagiesAction/CreateHoagiesAction';
import {createHoagieSchema, FormDataCreateHoagie} from './form';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigation';

type CreateHoagieScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreateHoagie'
>;

export const useCreateHoagiePresenter = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<CreateHoagieScreenNavigationProp>();

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      pictureUrl: '',
      ingredients: [{name: '', quantity: ''}],
    },
    resolver: yupResolver(createHoagieSchema),
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'ingredients',
  });

  const formValues = watch();

  const addIngredient = useCallback(() => {
    append({name: '', quantity: ''});
  }, [append]);

  const removeIngredient = useCallback(
    (index: number) => {
      if (fields.length <= 1) {
        Alert.alert('Error', 'Min 1 ingredient is required');
        return;
      }

      remove(index);
    },
    [fields.length, remove],
  );

  const createHoagie = useCallback(
    async (data: FormDataCreateHoagie) => {
      if (isSubmitting) {
        return null;
      }

      try {
        setIsSubmitting(true);
        setError(null);

        const validIngredients = data?.ingredients?.filter(
          ing => ing.name.trim() !== '',
        );

        if (validIngredients?.length === 0) {
          setError('Ingredient with name is required');
          return null;
        }

        const requestData = {
          name: data.name.trim(),
          ingredients: validIngredients ?? [],
          pictureUrl: data?.pictureUrl?.trim() || undefined,
        };

        const result = await createHoagieActions.createHoagie(requestData);

        Alert.alert(
          'Success',
          'Hoagie created successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.push('Main');
              },
            },
          ],
          {cancelable: false},
        );

        reset({
          name: '',
          pictureUrl: '',
          ingredients: [{name: '', quantity: ''}],
        });

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again later.';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, navigation, reset],
  );

  const onSubmit = handleSubmit(createHoagie);

  const resetForm = useCallback(() => {
    reset({
      name: '',
      pictureUrl: '',
      ingredients: [{name: '', quantity: ''}],
    });
    setError(null);
  }, [reset]);

  return {
    state: {
      formValues,
      isSubmitting,
      error,
      errors,
      fields,
    },
    control,
    actions: {
      addIngredient,
      removeIngredient,
      onSubmit,
      resetForm,
    },
  };
};
