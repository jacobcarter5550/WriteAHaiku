import { useState, useRef } from 'react';
import styles from '../styles/sass/Login.module.scss'

const EmailForm = ({ onEmailSubmit, disabled, }) => {
    const [ email, setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        onEmailSubmit(email);
    };

    function load () {
        // setLoading(!loading)
    }

    return (<>
        <div className={styles.loginForm}>
            <img src='/wh.svg'/>
            <form  onSubmit={handleSubmit}>
                <div >
                    <input
                        placeholder='Enter your email'
                        size='sm'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <hr></hr>
                <div>
                    <button  className='button2'
                        disabled={disabled}
                        onClick={(e)=>{load(), handleSubmit(e)}}>
                        Login with Email
                    </button>
                </div>
            </form>
        </div>
    </>);
};

export default EmailForm;