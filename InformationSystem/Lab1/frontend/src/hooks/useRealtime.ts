import { useEffect } from 'react'


// Простое автообновление  каждые N секунд
export function useRealtime(cb: () => void, intervalMs = 5000) {
    useEffect(() => {
        const id = setInterval(() => cb(), intervalMs)
        return () => clearInterval(id)
    }, [cb, intervalMs])
}