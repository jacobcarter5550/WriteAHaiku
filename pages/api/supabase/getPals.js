import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = 'https://kxbbsrhjudgafnkyawbw.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)



export default async function getPals (req, res) {

    let { data, error } = await supabase.from('users').select('*, questionID(*),fbData(*)')

    res.json({data:data})
    res.status(200).end()
}