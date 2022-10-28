import { useEffect } from 'react';

export default function useKeyPress(key, action, data) {
    useEffect(() => {
        function onKeyup(e) {
            if (e.code === key) action(data)
        }
        window.addEventListener('keyup', onKeyup);
        return () => window.removeEventListener('keyup', onKeyup);
    }, [data]);
}