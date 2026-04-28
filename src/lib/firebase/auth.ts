import { auth, db } from "./config";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/**
 * Admin girişi yapar ve Firestore'da admin yetkisi kontrol eder.
 * Yetkisiz kullanıcılar otomatik olarak çıkış yaptırılır.
 */
export const loginAdmin = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Firestore'da admins koleksiyonunda UID var mı kontrol et
  const adminDoc = await getDoc(doc(db, "admins", user.uid));

  if (!adminDoc.exists()) {
    await signOut(auth);
    throw new Error("Bu hesabın yönetici yetkisi bulunmuyor.");
  }

  return user;
};

export const logoutAdmin = async () => {
  await signOut(auth);
};
