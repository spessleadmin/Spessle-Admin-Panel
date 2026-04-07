import { useState, useEffect } from 'react';
import api from '../utils/api';
import { API_BASE_URL } from "../config";

const useFeatureFlags = () => {
  const [featureFlags, setFeatureFlags] = useState({});

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      try {
        const response = await api(`${API_BASE_URL}/feature-flags`);
        const data = await response.json();
        setFeatureFlags(data);
      } catch (error) {
        console.error('Error fetching feature flags:', error);
      }
    };

    fetchFeatureFlags();
  }, []);

  return featureFlags;
};

export default useFeatureFlags;
