import React, {useEffect, useRef, useState} from 'react';
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

export function useReloadOnVersionChange() {
    const version = useRef();

    const onVersionUpdate = (doc) => {
        const newVersion = doc.data().version;
        if(version.current && version.current !== newVersion){
            // eslint-disable-next-line no-restricted-globals
            location.reload();
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
        const games = await getWeekScores(games);
        setGames(games);
    }, []);

    useInterval(async () => {
        const games = await getWeekScores();
        setGames(games);
    }, config.refreshInterval);

    return games
}