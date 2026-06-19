import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, getDoc, doc,
  deleteDoc, updateDoc, onSnapshot
} from "firebase/firestore";

export function useInvitations() {
  const [invitations, setInvitations] = useState([]);
  const colRef = collection(db, "invitations");

  useEffect(() => {
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setInvitations(data);
    });
    return () => unsubscribe();
  }, []);

  const addInvitation = async (guests, extra = {}) => {
    const docRef = await addDoc(colRef, {
      guests,
      ...extra,                      // ← guarda side: 'groom' | 'bride'
      createdAt: new Date().toISOString(),
      opened: false,
      rsvpStatus: 'pending',
      rsvp: [],
      confirmedCount: 0,
    });
    return { id: docRef.id, guests };
  };

  const getInvitation = async (id) => {
    const snap = await getDoc(doc(db, "invitations", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  };

  const deleteInvitation = async (id) => {
    await deleteDoc(doc(db, "invitations", id));
  };

  const markOpened = async (id) => {
    await updateDoc(doc(db, "invitations", id), { opened: true });
  };

  const updateRsvp = async (id, { status, confirmedNames }) => {
    await updateDoc(doc(db, "invitations", id), {
      rsvpStatus: status,
      rsvp: confirmedNames || [],
      confirmedCount: confirmedNames?.length || 0,
      respondedAt: new Date().toISOString(),
    });
  };

  return {
    invitations,
    addInvitation,
    deleteInvitation,
    markOpened,
    getInvitation,
    updateRsvp,
  };
}