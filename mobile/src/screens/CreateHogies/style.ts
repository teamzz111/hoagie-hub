import {Platform, StatusBar, StyleSheet} from 'react-native';
import {PRIMARY_COLOR, SECONDARY_COLOR} from '../../utils/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop:
      Platform.OS === 'android' ? StatusBar.currentHeight || 0 + 20 : 20,
    paddingBottom: 40,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  fieldErrorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  ingredientsSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addIngredientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addIngredientText: {
    fontSize: 14,
    color: SECONDARY_COLOR,
    fontWeight: '500',
    marginLeft: 4,
  },
  ingredientsList: {
    marginTop: 8,
  },
  ingredientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: SECONDARY_COLOR,
    padding: 8,
  },
  ingredientFields: {
    flex: 1,
    flexDirection: 'row',
  },
  ingredientNameContainer: {
    flex: 3,
    marginRight: 8,
  },
  ingredientNameInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
  },
  ingredientQuantityContainer: {
    flex: 1,
  },
  ingredientQuantityInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
  },
  removeIngredientButton: {
    marginLeft: 8,
    padding: 4,
  },
  buttonContainer: {
    marginTop: 8,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: SECONDARY_COLOR,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
  },
});

export default styles;
