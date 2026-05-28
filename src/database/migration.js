import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabaseClient';

/**
 * Migrates data from AsyncStorage to Supabase
 * Run this once when transitioning to Supabase
 */
export const migrateFromAsyncStorageToSupabase = async () => {
  try {
    console.log('Starting migration from AsyncStorage to Supabase...');

    // Get all data from AsyncStorage
    const usersDB = JSON.parse(
      (await AsyncStorage.getItem('@users_db')) || '[]'
    );
    const writingHistory = JSON.parse(
      (await AsyncStorage.getItem('@writing_history')) || '[]'
    );
    const mistakesDB = JSON.parse(
      (await AsyncStorage.getItem('@mistakes_db')) || '[]'
    );

    // Migrate users
    if (usersDB.length > 0) {
      console.log(`Migrating ${usersDB.length} users...`);
      for (const user of usersDB) {
        try {
          // Sign up user with Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signUp(
            {
              email: user.email,
              password: user.password,
            }
          );

          if (authError) {
            console.warn(`Could not auth user ${user.email}:`, authError.message);
            continue;
          }

          // Insert into users table
          const { error: userError } = await supabase.from('users').insert([
            {
              id: authData.user?.id || user.id,
              email: user.email,
              name: user.name || '',
              created_at: user.createdAt || new Date().toISOString(),
            },
          ]);

          if (userError) {
            console.warn(`Could not migrate user ${user.email}:`, userError.message);
          }
        } catch (error) {
          console.error(`Error migrating user ${user.email}:`, error);
        }
      }
    }

    // Migrate writing history
    if (writingHistory.length > 0) {
      console.log(`Migrating ${writingHistory.length} writing history records...`);
      for (const record of writingHistory) {
        try {
          // Find user by email or skip
          const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('id', record.userId)
            .single();

          if (!user) {
            console.warn(
              `Could not find user for writing history record ${record.id}`
            );
            continue;
          }

          await supabase.from('writing_history').insert([
            {
              id: record.id,
              user_id: user.id,
              topic: record.topic || 'General',
              content: record.content || '',
              score: record.score || 0,
              created_at: record.date || record.createdAt || new Date().toISOString(),
            },
          ]);
        } catch (error) {
          console.error(`Error migrating writing history ${record.id}:`, error);
        }
      }
    }

    // Migrate mistakes
    if (mistakesDB.length > 0) {
      console.log(`Migrating ${mistakesDB.length} mistake records...`);
      for (const mistake of mistakesDB) {
        try {
          // Find user
          const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('id', mistake.userId)
            .single();

          if (!user) {
            console.warn(`Could not find user for mistake record ${mistake.id}`);
            continue;
          }

          await supabase.from('mistakes').insert([
            {
              id: mistake.id,
              user_id: user.id,
              topic: mistake.topic || 'General',
              type: mistake.type,
              incorrect_phrase: mistake.incorrectPhrase || '',
              corrected_phrase: mistake.correctedPhrase || '',
              explanation: mistake.explanation || '',
              frequency: mistake.frequency || 1,
              last_reviewed_at: mistake.lastReviewedAt || new Date().toISOString(),
              created_at: mistake.createdAt || new Date().toISOString(),
            },
          ]);
        } catch (error) {
          console.error(`Error migrating mistake ${mistake.id}:`, error);
        }
      }
    }

    console.log('Migration complete!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};

/**
 * Backup data to AsyncStorage before migration
 */
export const backupAsyncStorageData = async () => {
  try {
    console.log('Backing up AsyncStorage data...');
    const keys = await AsyncStorage.getAllKeys();
    const backup = {};

    for (const key of keys) {
      backup[key] = await AsyncStorage.getItem(key);
    }

    const backupJson = JSON.stringify(backup);
    console.log('Backup size:', (backupJson.length / 1024).toFixed(2), 'KB');
    return backup;
  } catch (error) {
    console.error('Backup failed:', error);
    return null;
  }
};
