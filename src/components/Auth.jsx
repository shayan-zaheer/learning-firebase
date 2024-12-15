import { useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

function Auth() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    console.log(auth?.currentUser?.email);

    async function signIn() {
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
        } catch (err) {
            console.error(err);
        }
    }

    async function signInWithGoogle() {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error(err);
        }
    }

    async function logout(){
        try{
            await signOut(auth);
        } catch(err){
            console.error(err);
        }
    }

    return (
        <div>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter email"
            />
            <input
                type="password"
                onChange={(e) => setPass(e.target.value)}
                value={pass}
                placeholder="Enter password"
            />
            <button onClick={signIn}>Sign In</button>
            <button onClick={signInWithGoogle}>Sign In with Google</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default Auth;
