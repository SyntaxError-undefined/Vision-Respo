import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { UserProfile } from '../types/index';

const PROFILE_KEY = 'vr_user_profile';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY)
      .then((data) => {
        if (data) {
          setProfile(JSON.parse(data));
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const saveProfile = async (data: UserProfile) => {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(data));
      setProfile(data);
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  };

  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem(PROFILE_KEY);
      setProfile(null);
    } catch (e) {
      console.error('Failed to clear profile', e);
    }
  };

  return { profile, saveProfile, clearProfile, isLoading };
}
