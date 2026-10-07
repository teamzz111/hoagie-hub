import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

import {Controller} from 'react-hook-form';
import {styles} from './styles';
import useLoginPresenter from '../../presenters/LoginPresenter/Login.Presenter';
import {SECONDARY_COLOR} from '../../utils/colors';
import {SafeAreaView} from 'react-native-safe-area-context';

const LoginScreen: React.FC = () => {
  const presenter = useLoginPresenter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.contentContainer}>
          <Animated.View
            style={[styles.logoContainer, presenter.logoAnimatedStyle]}>
            <Icon name="fast-food" size={80} color={SECONDARY_COLOR} />
            <Text style={styles.appName}>Hoagie Hub</Text>
            <Text style={styles.tagline}>Hoagie collaborative platform</Text>
          </Animated.View>

          <Animated.View
            style={[styles.formContainer, presenter.formAnimatedStyle]}>
            <View style={styles.inputContainer}>
              <Icon
                name="mail"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <Controller
                control={presenter.control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                )}
                name="email"
              />
            </View>
            {presenter.errors.email && (
              <Text style={styles.errorText}>
                {presenter.errors.email.message}
              </Text>
            )}

            <View style={styles.inputContainer}>
              <Icon
                name="lock-closed"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <Controller
                control={presenter.control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                  />
                )}
                name="password"
              />
            </View>
            {presenter.errors.password && (
              <Text style={styles.errorText}>
                {presenter.errors.password.message}
              </Text>
            )}

            <Animated.View style={[presenter.buttonAnimatedStyle]}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={presenter.handleLogin}
                disabled={presenter.isLoading}>
                {presenter.isLoading ? (
                  <Text style={styles.loginButtonText}>Loading...</Text>
                ) : (
                  <Text style={styles.loginButtonText}>Log In</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={styles.signupLink}
              onPress={() => presenter.navigation.navigate('Signup')}>
              <Text style={styles.signupLinkText}>
                Without account? <Text style={styles.signupText}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
