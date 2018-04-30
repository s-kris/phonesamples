import firebase from 'firebase';
import 'firebase/firestore';

import { dataCollection, usersCollection } from './../config/Constants';

const db = firebase.firestore();

const deleteDocument = docId => {
  db
    .collection(dataCollection)
    .doc(docId)
    .delete()
    .then()
    .catch(error => {
      console.error('Error removing document: ', error);
    });
};

export const deleteFeed = feedId => {
  db
    .collection(dataCollection)
    .where('feedId', '==', feedId)
    .get()
    .then(querySnapshot => {
      querySnapshot.docs[0].ref.delete();
    });
};

const updateImageURLsObj = (docId, propertyId, imagesCount) => {
  db
    .collection(dataCollection)
    .doc(docId)
    .update({
      [`imageURLs.${propertyId}`]: firebase.firestore.FieldValue.delete(),
    })
    .then(() => {
      if (imagesCount - 1 === 0) deleteDocument(docId);
    })
    .catch(error => console.log(error));
};

export const addData = (data, callback) => {
  db
    .collection(dataCollection)
    .add(data)
    .then(() => callback())
    .catch(error => {
      console.error('Error adding document: ', error);
    });
};

export const getUserSamples = (userId, callback) => {
  db
    .collection(dataCollection)
    .where('addedBy', '==', userId)
    .get()
    .then(querySnapshot => {
      const dataArray = [];
      querySnapshot.forEach(doc => dataArray.push(doc.data()));
      callback(dataArray);
    })
    .catch(error => {
      console.log('Error getting documents: ', error);
    });
};

export const getAllData = callback => {
  db
    .collection(dataCollection)
    .get()
    .then(querySnapshot => {
      const dataArray = [];
      querySnapshot.forEach(doc => dataArray.push(doc.data()));
      callback(dataArray);
    })
    .catch(error => {
      console.log('Error getting documents: ', error);
    });
};

export const getModelData = (model, callback) => {
  db
    .collection(dataCollection)
    .where('phoneModel', '==', model)
    .get()
    .then(querySnapshot => {
      const dataArray = [];
      querySnapshot.forEach(doc => dataArray.push(doc.data()));
      callback(dataArray);
    })
    .catch(error => {
      console.log('Error getting documents: ', error);
    });
};

export const getUserDisplayName = (userId, callback) => {
  db
    .collection(usersCollection)
    .where('userId', '==', userId)
    .get()
    .then(querySnapshot => {
      callback(querySnapshot.docs[0].data().displayName);
    })
    .catch(error => {
      console.log('Error getting documents: ', error);
    });
};

export const getUserShortId = (userId, callback) => {
  db
    .collection(usersCollection)
    .where('userId', '==', userId)
    .get()
    .then(querySnapshot => {
      callback(querySnapshot.docs[0].data().username);
    })
    .catch(error => {
      console.log('Error getting documents: ', error);
    });
};

export const getUserId = (username, callback, errorCallback) => {
  db
    .collection(usersCollection)
    .where('username', '==', username)
    .get()
    .then(querySnapshot => {
      callback(querySnapshot.docs[0].data().userId);
    })
    .catch(error => {
      errorCallback();
      console.log('Error getting documents: ', error);
    });
};

export const getUserData = (userId, callback) => {
  db
    .collection(usersCollection)
    .where('userId', '==', userId)
    .get()
    .then(querySnapshot => {
      callback(querySnapshot.docs[0].data());
    })
    .catch(error => {
      console.log('Error getting documents: ', error);
    });
};

export const addUserProfile = (userId, data, callback) => {
  db
    .collection(usersCollection)
    .doc(userId)
    .set(data)
    .then(() => {
      callback();
    })
    .catch(error => {
      console.log(error);
    });
};

export const getFeedDocumentData = (feedId, callback, errorCallback) => {
  db
    .collection(dataCollection)
    .where('feedId', '==', feedId)
    .get()
    .then(querySnapshot => {
      callback(querySnapshot.docs[0].data());
    })
    .catch(error => {
      errorCallback();
      console.log('Error getting documents: ', error);
    });
};

export const getUsername = (userId, callback) => {
  db
    .collection(usersCollection)
    .doc(userId)
    .get()
    .then(doc => {
      if (doc.exists) {
        callback(doc.data().username);
      } else {
        callback(false);
      }
    })
    .catch(error => {
      console.log('Error getting documents: ', error);
    });
};

export const deleteImageFromFS = (propertyId, imageURL) => {
  db
    .collection(dataCollection)
    .where(`imageURLs.${propertyId}`, '==', imageURL)
    .get()
    .then(querySnapshot => {
      const doc = querySnapshot.docs[0];
      const imagesCount = Object.keys(doc.data().imageURLs).length;
      updateImageURLsObj(doc.id, propertyId, imagesCount);
    })
    .catch(error => console.log(error));
};

export const checkUsernameExists = (username, callback) => {
  db
    .collection(usersCollection)
    .where('username', '==', username)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.empty) {
        callback(false);
      } else {
        callback(true);
      }
    });
};

export const updateUsername = (userId, username, callback) => {
  db
    .collection(usersCollection)
    .doc(userId)
    .update({
      username,
    })
    .then(() => callback())
    .catch(error => console.log(error));
};

export const deleteUserProfile = (userId, callback) => {
  db
    .collection(usersCollection)
    .doc(userId)
    .delete()
    .then(() => callback())
    .catch(error => {
      console.error('Error removing document: ', error);
    });
};

export const deleteUserUploads = (userId, callback) => {
  db
    .collection(dataCollection)
    .where('addedBy', '==', userId)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        deleteDocument(doc.id);
      });
      callback();
    })
    .catch(err => console.log(err));
};
