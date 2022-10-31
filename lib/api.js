import axios from "axios"



export const nlpApi = async(arg) =>{
    const res = axios.post('/api/goog/nlp', arg)
    return res.data
}


export const createCookies = async(arg) =>{
    const res = axios.post('/api/supabase/createCookies', arg)
    return res.data
}

export const updateCookies = async(arg) =>{
    const res = axios.post('/api/supabase/updateCookies', arg)
    return res.data
}

