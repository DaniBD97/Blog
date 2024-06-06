
import React from 'react'
import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess, signoutSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'


export default function OAuth() {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async () => {

        const provider = new GoogleAuthProvider()

        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                dispatch(signInSuccess(data))
                navigate('/')
            }

            setTimeout(async () => {
                try {
                    const res = await fetch('/api/auth/signout', {
                      method: 'POST',
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      console.log(data.message);
                    } else {
                      dispatch(signoutSuccess());
                    }
                  } catch (error) {
                    console.log(error.message);
                  }
            }, 18000000);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Button onClick={handleGoogleClick} type='button' gradientDuoTone={'pinkToOrange'} outline>

            <AiFillGoogleCircle className='w-9 h-9 mr-2' />Continue With Google


        </Button>
    )
}
