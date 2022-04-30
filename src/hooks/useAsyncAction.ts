import {useState} from 'react'

export const useAsyncAction = <T>(fn: ()=> Promise<T>)=> {
    const [error, setError] = useState<Error>();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<T>()

    let execute: () => void;


    execute = () => {
        setIsLoading(true);
        try{
            fn().then(result => {
                setIsLoading(false)
                setData(result)
            })
            .catch((err) => {
                console.log("in Error: "+ JSON.stringify(err))
                setError(err);
                setIsLoading(false);
            })
        }catch(err: Error | any) {
            setError(err);
            setIsLoading(false);
        }
    }





    return {error, loading: isLoading, execute, data}
}