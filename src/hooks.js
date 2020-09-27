import {useCallback, useEffect, useRef, useState} from 'react';
import {db} from "./firebase";
import {getWeekScores} from "./fantasy";

export function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        callback();
    }, []);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export const useTimeout = (callback, timeout) => {
    const timeoutIdRef = useRef();
    const cancel = useCallback(
        () => {
            const timeoutId = timeoutIdRef.current;
            if (timeoutId) {
                timeoutIdRef.current = undefined;
                clearTimeout(timeoutId);
            }
        },
        [timeoutIdRef],
    );

    useEffect(
        () => {
            timeoutIdRef.current = setTimeout(callback, timeout);
            return cancel;
        },
        [callback, timeout, cancel],
    );

    return cancel;
}

export function useReloadOnVersionChange() {
    const version = useRef();

    const onVersionUpdate = (doc) => {
        const newVersion = doc.data().version;
        if(version.current && version.current !== newVersion){
            window.location.reload();
        } else {
            version.current = doc.data().version;
        }
    };

    useEffect(() => {
        db.collection('admin').doc("control-data").onSnapshot(onVersionUpdate);
    }, [])
}

export function useConfig() {
    const initialConfig = {
        refreshInterval: 10000
    }
    const [config, setConfig] = useState(initialConfig);

    useEffect(() => {
        db.collection('admin').doc("control-data").onSnapshot((doc) => {
            setConfig({
                ...doc.data()
            })
        });
    }, [])

    return config;
}

export function useUpdatingScores() {
    const [games, setGames] = useState([]);
    const config = useConfig();

    useEffect(() => async () => {
        const newGames = await getWeekScores(games);
        newGames.forEach(game => {
            if(game.home.change !== 0 || game.away.change !== 0){
                console.log('Change Detected: ')
                console.log(game);
            }
        })
    }, []);

    useInterval(async () => {
        const newGames = await getWeekScores(games);
        setTimeout(() => {
            setGames(newGames);
        }, 1000 * config.throttlingOffset);
    }, config.refreshInterval);

    return games
}