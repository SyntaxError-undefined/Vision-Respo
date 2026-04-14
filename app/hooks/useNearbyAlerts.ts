import { useEffect, useState } from 'react';
import { NearbyAlert } from '../types/index';

// TODO: Replace stub with real Firestore onSnapshot when Firebase is configured
export function useNearbyAlerts(venueId: string | null) {
  const [alerts, setAlerts] = useState<NearbyAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!venueId) {
      setLoading(false);
      return;
    }

    // STUB: Simulate no active alerts for now
    // When Firebase is ready, replace this block with:
    // const q = query(collection(db, 'incidents'),
    //   where('venueId', '==', venueId),
    //   where('status', '==', 'active'));
    // return onSnapshot(q, snapshot => {
    //   const data = snapshot.docs.map(doc => doc.data() as NearbyAlert);
    //   setAlerts(data);
    //   setLoading(false);
    // });

    setAlerts([]);
    setLoading(false);
  }, [venueId]);

  const confirmAlert = async (incidentId: string, userId: string) => {
    // TODO: Firestore arrayUnion('confirmations', userId)
    // and increment confirmationCount
    console.log('Confirmed:', incidentId, userId);
  };

  const denyAlert = async (incidentId: string) => {
    // TODO: Log denial for analytics
    console.log('Denied:', incidentId);
  };

  return { alerts, loading, confirmAlert, denyAlert };
}
