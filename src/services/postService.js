import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { updateUserReputation } from './userService';

// Create a new post
export const createPost = async (postData) => {
  try {
    const post = {
      ...postData,
      likes: [],
      likeCount: 0,
      commentCount: 0,
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'posts'), post);
    
    // Award points to author
    await updateUserReputation(postData.authorId, 5);

    return { id: docRef.id, ...post };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get posts with real-time updates
export const subscribeToPosts = (callback, filters = {}) => {
  try {
    let q = collection(db, 'posts');
    const constraints = [orderBy('createdAt', 'desc')];

    if (filters.tag) {
      constraints.unshift(where('tags', 'array-contains', filters.tag));
    }

    if (filters.authorId) {
      constraints.unshift(where('authorId', '==', filters.authorId));
    }

    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    q = query(q, ...constraints);

    return onSnapshot(q, (snapshot) => {
      const posts = [];
      snapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      callback(posts);
    });
  } catch (error) {
    console.error('Error subscribing to posts:', error);
    return () => {};
  }
};

// Get single post
export const getPost = async (postId) => {
  try {
    const postDoc = await getDoc(doc(db, 'posts', postId));
    if (postDoc.exists()) {
      // Increment view count
      await updateDoc(doc(db, 'posts', postId), {
        views: increment(1)
      });
      return { id: postDoc.id, ...postDoc.data() };
    }
    return null;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Subscribe to single post updates
export const subscribeToPost = (postId, callback) => {
  return onSnapshot(doc(db, 'posts', postId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  });
};

// Like/Unlike post
export const toggleLike = async (postId, userId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }

    const post = postDoc.data();
    const likes = post.likes || [];
    const isLiked = likes.includes(userId);

    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
        likeCount: increment(-1),
        updatedAt: serverTimestamp()
      });
      // Remove points
      await updateUserReputation(post.authorId, -1);
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
        likeCount: increment(1),
        updatedAt: serverTimestamp()
      });
      // Award points
      await updateUserReputation(post.authorId, 1);
    }

    return !isLiked;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Add comment
export const addComment = async (postId, commentData) => {
  try {
    const comment = {
      ...commentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'posts', postId, 'comments'), comment);

    // Update comment count
    await updateDoc(doc(db, 'posts', postId), {
      commentCount: increment(1),
      updatedAt: serverTimestamp()
    });

    // Award points
    await updateUserReputation(commentData.authorId, 2);

    return { id: docRef.id, ...comment };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Subscribe to comments
export const subscribeToComments = (postId, callback) => {
  const q = query(
    collection(db, 'posts', postId, 'comments'),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const comments = [];
    snapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    callback(comments);
  });
};

// Search posts
export const searchPosts = async (searchTerm) => {
  try {
    const postsRef = collection(db, 'posts');
    const snapshot = await getDocs(postsRef);
    
    const posts = [];
    snapshot.forEach((doc) => {
      const post = { id: doc.id, ...doc.data() };
      const searchLower = searchTerm.toLowerCase();
      
      if (
        post.title?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      ) {
        posts.push(post);
      }
    });

    return posts.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get trending posts (most likes in last 7 days)
export const getTrendingPosts = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const q = query(
      collection(db, 'posts'),
      where('createdAt', '>=', sevenDaysAgo),
      orderBy('createdAt', 'desc'),
      orderBy('likeCount', 'desc'),
      limit(20)
    );

    const snapshot = await getDocs(q);
    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    return posts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
  } catch (error) {
    // Fallback if compound index not created
    const q = query(
      collection(db, 'posts'),
      orderBy('likeCount', 'desc'),
      limit(20)
    );

    const snapshot = await getDocs(q);
    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    return posts;
  }
};

// Bookmark post (stored in user's document)
export const toggleBookmark = async (userId, postId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const bookmarks = userDoc.data().bookmarks || [];
    const isBookmarked = bookmarks.includes(postId);

    if (isBookmarked) {
      await updateDoc(userRef, {
        bookmarks: arrayRemove(postId)
      });
    } else {
      await updateDoc(userRef, {
        bookmarks: arrayUnion(postId)
      });
    }

    return !isBookmarked;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get bookmarked posts
export const getBookmarkedPosts = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return [];
    }

    const bookmarks = userDoc.data().bookmarks || [];
    
    if (bookmarks.length === 0) {
      return [];
    }

    const posts = [];
    for (const postId of bookmarks) {
      const postDoc = await getDoc(doc(db, 'posts', postId));
      if (postDoc.exists()) {
        posts.push({ id: postDoc.id, ...postDoc.data() });
      }
    }

    return posts.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
  } catch (error) {
    throw new Error(error.message);
  }
};