import {useState} from 'react'

export const useAsyncAction = <T>(fn: ()=> Promise<any>)=> {
    const [error, setError] = useState<Error>();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<T>()

    let execute: () => void;


    execute = () => {
        setIsLoading(true);
        fn().then(result => {
            setIsLoading(false)
            setData(result)
        })
        .catch((err) => {
            setError(err);
            setIsLoading(false);
        })
    }





    return {error, loading: isLoading, execute, data}
}