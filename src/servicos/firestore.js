import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export async function salvarPost(data) {
  try {
    const result = await addDoc(collection(db, "posts"), data);
    return result.id;
  } catch (error) {
    return "erro";
  }
}

export async function pegarPosts() {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    let posts = [];
    querySnapshot.forEach((doc) => {
      let post = { id: doc.id, ...doc.data() };
      posts.push(post);
    });
    return posts;
  } catch (error) {
    return [];
  }
}

export async function pegarPostsTempoReal(setposts) {
  const ref = query(collection(db, "posts"));
  onSnapshot(ref, (querySnapshot) => {
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    setposts(posts);
  });
}

export async function atualizarPost(postID, data) {
  try {
    const postRef = doc(db, "posts", postID);
    await updateDoc(postRef, data);
    return "ok";
  } catch (error) {
    return "error";
  }
}

export async function deletarPost(postID) {
  try {
    const postRef = doc(db, "posts", postID);
    await deleteDoc(postRef);
    return "ok";
  } catch (error) {
    return "error";
  }
}
