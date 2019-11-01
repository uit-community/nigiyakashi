import { firestore } from 'firebase'

export interface UserInfo {
  userRef: firestore.DocumentReference | null
}
