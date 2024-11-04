import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Clipboard,
  Platform,
  ScrollView,
  RefreshControl
} from 'react-native';
import { getAllPasswords, deletePassword } from '../../utils/secureStorage';
import { usePassword } from './PasswordContext';
import { Ionicons } from '@expo/vector-icons';

interface PasswordEntry {
  password: string;
  site: string;
  category: string;
  createdAt: string;
}

const ExploreScreen = () => {
  const { passwords, setPasswords } = usePassword();
  const [groupedPasswords, setGroupedPasswords] = useState<{ [key: string]: PasswordEntry[] }>({});
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPasswords();
  }, [setPasswords]);

  useEffect(() => {
    const grouped = passwords.reduce((acc: { [key: string]: PasswordEntry[] }, entry) => {
      if (!acc[entry.category]) {
        acc[entry.category] = [];
      }
      acc[entry.category].push(entry);
      return acc;
    }, {});
    setGroupedPasswords(grouped);
  }, [passwords]);

  const fetchPasswords = async () => {
    const storedPasswords = await getAllPasswords();
    setPasswords(storedPasswords);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchPasswords();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleCopyToClipboard = async (password: string, site: string) => {
    try {
      await Clipboard.setString(password);
      Alert.alert('Success', `Password for ${site} copied to clipboard!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy password to clipboard');
    }
  };

  const togglePasswordVisibility = (site: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [site]: !prev[site]
    }));
  };

  const handleDelete = async (site: string, category: string) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete the password for ${site}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePassword(site);
              const updatedPasswords = await getAllPasswords();
              setPasswords(updatedPasswords);
              Alert.alert('Success', 'Password deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete password');
            }
          }
        }
      ]
    );
  };

  const renderPasswordEntry = ({ item }: { item: PasswordEntry }) => (
    <View style={styles.passwordEntry}>
      <View style={styles.passwordInfo}>
        <Text style={styles.siteText}>{item.site}</Text>
        <Text style={styles.passwordText}>
          {visiblePasswords[item.site] ? item.password : '••••••••'}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => togglePasswordVisibility(item.site)}
          style={styles.actionButton}
        >
          <Ionicons
            name={visiblePasswords[item.site] ? "eye-off" : "eye"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleCopyToClipboard(item.password, item.site)}
          style={styles.actionButton}
        >
          <Ionicons
            name="copy-outline"
            size={24}
            color="#666"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete(item.site, item.category)}
          style={styles.actionButton}
        >
          <Ionicons
            name="trash-outline"
            size={24}
            color="#ff4444"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategory = (category: string) => (
    <View key={category} style={styles.categoryContainer}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <Text style={styles.itemCount}>
          {groupedPasswords[category].length} items
        </Text>
      </View>
      <FlatList
        data={groupedPasswords[category]}
        renderItem={renderPasswordEntry}
        keyExtractor={(item, index) => `${item.site}-${index}`}
        scrollEnabled={false}
        nestedScrollEnabled={true}
      />
    </View>
  );

  if (Object.keys(groupedPasswords).length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.emptyState}>
          <Ionicons name="lock-closed-outline" size={48} color="#666" />
          <Text style={styles.emptyStateText}>No passwords saved yet</Text>
          <Text style={styles.emptyStateSubText}>
            Your saved passwords will appear here
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Passwords</Text>
        <Text style={styles.headerSubtitle}>
          {passwords.length} passwords stored securely
        </Text>
      </View>
      {Object.keys(groupedPasswords).map(renderCategory)}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  passwordEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  passwordInfo: {
    flex: 1,
  },
  siteText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  passwordText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});

export default ExploreScreen;