import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = 'https://uggaaclminvwwfpuraji.supabase.co'
const supabaseKey = process.env.SUPA_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


export default async function updateCookies ( req, res) {



}