//Observer Pattern

//Observable
//[key]: {data, fetcher}
import {useEffect, useState} from "react";

export const Cache = new Map();
const observers = {}; //reactive state observers [key]->[observer]

export const setData = (seriralizedKey, newData, observeKeys) =>{ //key can be ["mails", id]
    const oldCacheEntry = Cache.get(seriralizedKey); //serialized key
    const nextData = oldCacheEntry.data = newData; //structural sharing
    observers[seriralizedKey].forEach((observer) => {
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
    const setState = useState(initialData?.())[1]; //listener component
    const seriralizedKey = JSON.stringify(key);
    //can observe only interested keys
    const oldEntry = Cache.get(seriralizedKey);
    if(!oldEntry ){
        Cache.set(seriralizedKey, {
            fetcher,
            data: initialData
        });
    }
    if(!observers[seriralizedKey]){
        observers[seriralizedKey] = [];
    }
    let observersOfKey =observers[seriralizedKey];
    observersOfKey?.push(setState);

    useEffect(()=>{
        enable && Cache.get(seriralizedKey)?.fetcher()?.then(
            (response)=>{
                setData(seriralizedKey, response, observeKeys);
                onSuccess(response);
            }).catch(onError);
    }, [key, enable, onError, observeKeys, onSuccess, seriralizedKey]);
    useEffect(()=> {
        observers[seriralizedKey] = observersOfKey?.filter(listener=>listener !== setState)
    }, [observersOfKey, seriralizedKey, setState]);
    return [
        Cache.get(seriralizedKey)?.data,
        Cache.get(seriralizedKey)?.fetcher
    ];
}