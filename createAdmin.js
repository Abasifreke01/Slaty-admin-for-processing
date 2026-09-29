const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: 'AIzaSyAmYKjuVdz6Fzz3fxT9jztPsppZCt-3Lzc',
    authDomain: 'slaty-b383b.firebaseapp.com',
    projectId: 'slaty-b383b',
    storageBucket: 'slaty-b383b.appspot.com',
    messagingSenderId: '461836331622',
    appId: '1:461836331622:android:af1cc9b9474fdef3655ba7',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const email = 'abasifrekeeyo016@gmail.com';
const password = 'theriseofslaty';

async function createAdmin() {
    console.log(`Checking if admin user ${email} exists...`);
    let user;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        console.log('User already exists, signing in...');
    } catch (error) {
        console.log(`Sign in failed (${error.code}), attempting to create new user...`);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            user = userCredential.user;
            console.log('New user created successfully.');
        } catch (createError) {
            if (createError.code === 'auth/email-already-in-use') {
                console.error('Error: The email is already in use, but the password provided was incorrect for that account.');
            } else {
                console.error('Error creating user:', createError.message);
            }
            return;
        }
    }

    if (user) {
        console.log(`Setting admin role for user: ${user.uid}`);
        try {
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: email,
                role: 'admin',
                name: 'Slaty Admin',
                createdAt: serverTimestamp(),
            }, { merge: true });
            console.log('Success! The account is now an Admin.');
        } catch (dbError) {
            console.error('Error updating Firestore:', dbError.message);
        }
    }
}

createAdmin().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
