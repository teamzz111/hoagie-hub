import {StyleSheet} from 'react-native';
import {SECONDARY_COLOR} from '../../utils/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SECONDARY_COLOR,
  },
  totalCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 12,
    paddingBottom: 80,
  },
  hoagieCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  hoagieImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hoagieInfo: {
    flex: 1,
    marginLeft: 12,
  },
  hoagieName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  hoagieIngredients: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  creatorName: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  deleteButtonContainer: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoading: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  footerText: {
    marginLeft: 8,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 40,
  },
  retryButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
