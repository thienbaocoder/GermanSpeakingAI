import { supabase } from './supabaseClient';

/**
 * Quick test to verify Supabase connection
 * Run this in a test screen or console during development
 */
export const testSupabaseConnection = async () => {
  try {
    console.log('🧪 Testing Supabase connection...');

    // Test 1: Can we connect?
    const { data, error } = await supabase.from('users').select('count()');
    if (error) throw error;
    console.log('✅ Connected to Supabase');

    // Test 2: Can we sign up?
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (signUpError) throw signUpError;
    console.log('✅ Sign up works');

    // Test 3: Can we insert into users table?
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: signUpData.user?.id,
        email: testEmail,
        name: 'Test User',
      },
    ]);

    if (insertError && !insertError.message.includes('duplicate')) {
      throw insertError;
    }
    console.log('✅ User insertion works');

    // Test 4: Can we read the data?
    const { data: userData, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single();

    if (selectError) throw selectError;
    console.log('✅ User selection works');
    console.log('   User data:', userData);

    // Test 5: Can we update?
    const { error: updateError } = await supabase
      .from('users')
      .update({ name: 'Updated Test User' })
      .eq('email', testEmail);

    if (updateError) throw updateError;
    console.log('✅ User update works');

    // Cleanup: Delete test user
    await supabase.auth.admin.deleteUser(signUpData.user?.id);
    console.log('✅ Cleanup complete');

    console.log('\n🎉 All Supabase tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Supabase test failed:', error.message);
    return false;
  }
};

/**
 * Check which tables exist in the database
 */
export const checkDatabaseTables = async () => {
  try {
    console.log('📊 Checking database tables...');

    const tables = ['users', 'writing_history', 'mistakes'];

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ Table "${table}" not found or error:`, error.message);
      } else {
        console.log(`✅ Table "${table}" exists (${count} records)`);
      }
    }
  } catch (error) {
    console.error('Error checking tables:', error.message);
  }
};

/**
 * Check current authenticated user
 */
export const checkCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) throw error;

    if (session?.user) {
      console.log('✅ Authenticated user:', session.user.email);
      return session.user;
    } else {
      console.log('⚠️ No authenticated user');
      return null;
    }
  } catch (error) {
    console.error('Error checking user:', error.message);
    return null;
  }
};

/**
 * View environment variables (for debugging)
 */
export const checkEnvironmentVariables = () => {
  console.log('🔐 Checking environment variables...');

  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    console.error('❌ EXPO_PUBLIC_SUPABASE_URL not set');
  } else {
    console.log('✅ EXPO_PUBLIC_SUPABASE_URL set:', url.substring(0, 20) + '...');
  }

  if (!key) {
    console.error('❌ EXPO_PUBLIC_SUPABASE_ANON_KEY not set');
  } else {
    console.log('✅ EXPO_PUBLIC_SUPABASE_ANON_KEY set:', key.substring(0, 20) + '...');
  }

  return !!(url && key);
};

/**
 * Run all diagnostic tests
 */
export const runAllDiagnostics = async () => {
  console.log('🚀 Running Supabase diagnostics...\n');

  // 1. Check env vars
  checkEnvironmentVariables();
  console.log();

  // 2. Test connection
  await testSupabaseConnection();
  console.log();

  // 3. Check tables
  await checkDatabaseTables();
  console.log();

  // 4. Check current user
  await checkCurrentUser();
};
