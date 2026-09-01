import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push } from 'firebase/database'
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBSu8VnabpYsRcnn9mNdxNRp8JWjLjxbYM',
  authDomain: 'react-32680.firebaseapp.com',
  databaseURL: 'https://react-32680-default-rtdb.firebaseio.com',
  projectId: 'react-32680',
  storageBucket: 'react-32680.firebasestorage.app',
  messagingSenderId: '229931222936',
  appId: '1:229931222936:web:50ef977bd362258ce04ded',
  measurementId: 'G-7ZWK6E5RYJ',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const rtdb = getDatabase(app)
const firestore = getFirestore(app)

export { auth, rtdb, firestore }

export function logSearch({ city, checkIn, checkOut, guests }) {
  push(ref(rtdb, 'searches'), {
    city: city || null,
    checkIn: checkIn || null,
    checkOut: checkOut || null,
    guests: guests || null,
    createdAt: new Date().toISOString(),
  }).catch(() => {})
}

export function logBooking({ reference, hotelId, roomId, checkIn, checkOut, guests, guestName, guestEmail, totalPrice }) {
  push(ref(rtdb, 'bookings'), {
    reference: reference || null,
    hotelId: hotelId || null,
    roomId: roomId || null,
    checkIn: checkIn || null,
    checkOut: checkOut || null,
    guests: guests || null,
    guestName: guestName || null,
    guestEmail: guestEmail || null,
    totalPrice: totalPrice || null,
    createdAt: new Date().toISOString(),
  }).catch(() => {})
}

export async function saveHotelToFirestore(hotel) {
  await addDoc(collection(firestore, 'hotels'), hotel)
}

export async function getHotelsFromFirestore() {
  const snapshot = await getDocs(collection(firestore, 'hotels'))
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export function signUp(email, password, name) {
  return createUserWithEmailAndPassword(auth, email, password).then((cred) => ({
    user: { uid: cred.user.uid, email: cred.user.email, name: name || '' },
  }))
}

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password).then((cred) => ({
    user: { uid: cred.user.uid, email: cred.user.email, name: cred.user.displayName || email.split('@')[0] },
  }))
}

export function signOutUser() {
  return signOut(auth)
}

export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      })
    } else {
      callback(null)
    }
  })
}

export default app