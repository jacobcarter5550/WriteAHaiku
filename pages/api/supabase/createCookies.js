import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = 'https://uggaaclminvwwfpuraji.supabase.co'
const supabaseKey = process.env.SUPA_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


export default async function createCookies ( req, res ) {
    const id = req.body.id

    let { data, error } = await supabase.from('Cookies').select('*, Users(*),').match({id:id})

    if(data == (null || '')) {
        await supabase .from('Cookies').insert([{
            id:id, 
            haikus : []
        }])
        res.status(200)
    } else {
        res.status(200)
    }

    res.status(200)
    
}