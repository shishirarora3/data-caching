//Observer Pattern

//Observable
//[key]: {data, fetcher}
import {useEffect} from "react";

export const Cache = {

};
const observers = {}; //reactive state observers
export const setData = (key, newData, observeKeys) =>{
    const nextData = Cache[key].data = { ...Cache[key].data,...newData };
    //structural sharing
    observers[key].forEach((observer) => {
        observer(nextData);
    });
}
export const useCache = (key, fetcher, {enable, onError, observeKeys}) =>{
    //can observe only interested keys
    Cache[key] = Cache[key] || {
        fetcher
    };
    useEffect(()=>{
        enable && Cache[key].fetcher().then(
            (response)=>setData(key, response, observeKeys)).catch(onError);
    }, [key, enable, onError]);
    return [
        Cache[key]?.data,
        Cache[key]?.fetcher
    ];
}