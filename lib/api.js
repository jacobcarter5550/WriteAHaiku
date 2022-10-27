import axios from "axios"



export const nlpApi = async(arg) =>{
    const res = axios.post('/api/goog/nlp', arg)
    return res.data
}