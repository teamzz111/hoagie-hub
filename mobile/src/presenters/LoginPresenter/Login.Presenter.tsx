import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Alert} from 'react-native';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {loginSchema} from './form';
import {yupResolver} from '@hookform/resolvers/yup';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigation';
import axios from '../../utils/axios';
import {setAccessToken} from '../../utils/session';

type HoagieListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

const useLoginPresenter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<HoagieListScreenNavigationProp>();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(-50);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withDelay(
      300,
      withTiming(1, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    );

    logoTranslateY.value = withDelay(
      300,
      withSpring(0, {damping: 15, stiffness: 100}),
    );

    formOpacity.value = withDelay(
      800,
      withTiming(1, {
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    );

    formTranslateY.value = withDelay(
      800,
      withSpring(0, {damping: 15, stiffness: 100}),
    );
  }, [formOpacity, formTranslateY, logoOpacity, logoTranslateY]);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{translateY: logoTranslateY.value}],
    };
  });

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

  const handleLogin = handleSubmit(async ({email, password}) => {
    setIsLoading(true);

    buttonScale.value = withSequence(
      withTiming(0.95, {duration: 100}),
      withTiming(1, {duration: 100}),
    );

    try {
      const {data} = await axios.post<{access_token: string}>('/auth/login', {
        email,
        password,
      });
      setAccessToken(data.access_token);
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  });

  return {
    control,
    handleLogin,
    errors,
    logoAnimatedStyle,
    formAnimatedStyle,
    buttonAnimatedStyle,
    isLoading,
    navigation,
  };
};

export default useLoginPresenter;
