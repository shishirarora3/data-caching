//Observer Pattern

//Observable
//[key]: {data, fetcher}
import {useEffect, useState} from "react";

export const Cache = new Map();
const observers = {}; //reactive state observers [key]->[observer]

export const setData = (key, newData, observeKeys) =>{ //key can be ["mails", id]
    const oldCacheEntry = Cache.get[JSON.stringify(key)]; //serialized key
    const nextData = oldCacheEntry.data = newData; //structural sharing
    observers[key].forEach((observer) => {
        observer(nextData);
    });
}
export const clearCache = ({keyIncludes}) =>{
    //iterate cache and remove keys starting with given key
}
/**
 *
 * @param args : [[key, fetcher]]
 */
export const usePrefetch = (args) =>{
    //all same except do not add listeners
};
export const useCache = (
    key, fetcher,//cached part
    {enable, onError, observeKeys, onSuccess, initialData} //non cached part
) =>{
    const setState = useState(initialData)[1]; //listener component

    const seriralizedKey = JSON.stringify(key);
    //can observe only interested keys
    Cache[key] = Cache.get(seriralizedKey) || {
        fetcher,
        data: initialData
    };
    let observersOfKey =observers[seriralizedKey];
    observersOfKey.push(setState);

    useEffect(()=>{
        enable && Cache[key].fetcher().then(
            (response)=>{
                setData(key, response, observeKeys);
                onSuccess(response);
            }).catch(onError);
    }, [key, enable, onError, observeKeys, onSuccess]);
    useEffect(()=> {
        observers[seriralizedKey] = observersOfKey.filter(listener=>listener !== setState)
    }, [observersOfKey, seriralizedKey, setState]);
    return [
        Cache[key]?.data,
        Cache[key]?.fetcher
    ];
}