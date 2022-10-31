import styles from '../styles/sass/SignUp.module.scss'
import {Magic} from 'magic-sdk'
import { OAuthExtension } from '@magic-ext/oauth';
import { magic } from '../lib/magic'
import EmailForm from './MagicEmail'
import { useEffect } from 'react';

function SignUp() {

    useEffect(() => {
        const magic = new Magic('pk_live_62358854AD91AD07', {
            extensions: [new OAuthExtension()],
        });
        // setFunction(magic)
    }, [])

    async function handleLoginWithEmail(email) {
        let didToken = await magic.auth.loginWithMagicLink({
            email,
        });

        const res = await fetch('/api/magic/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + didToken,
            },
        });
        if (res.status == 200) {
            initUser(setUser,userCookie, m, r, setUC, getUser)
            setLoading(!loading)
        }
    }

  return (
    <div className={styles.signup}>
        <div>
            <EmailForm onEmailSubmit={handleLoginWithEmail}/>
        </div>
    </div>
  )
}

export default SignUp