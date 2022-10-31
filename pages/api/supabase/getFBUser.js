
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = 'https://kxbbsrhjudgafnkyawbw.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function getUserFB (req, res) {
    const graph = 'https://graph.facebook.com/me?fields=id,name,first_name,middle_name,last_name,email,address,link,picture'
    const magic = req.body.magic,
        oauth = req.body.oauth,
        email = magic.userMetadata.email,
        id =  magic.userMetadata.publicAddress,
        accessToken = oauth.accessToken,
        idToke = magic.idToken,
        userHandle = oauth.userHandle,
        name = oauth.userInfo.name,
        pic = oauth.userInfo.sources[graph].picture.data.url,
        uuid = uuidv4()

    let { data, error } = await supabase.from('users').select('*, questionID(*),fbData(*)').match({id:id})

    if(data == (null || '')) {

        await supabase .from('questions').insert([{
            id:uuid
        }]).then(async()=> await supabase.from('facebookUserData').insert([{
            id : idToke, 
            email : email, 
            accessToken : accessToken,
            userHandle : userHandle,
            pictureURL : pic,
            name : name
        }])).then(async()=> await supabase.from('users').insert([{
            id : id, email : email, issuer: 'fb', questionID:uuid, isFB :true, fbData : idToke, name : name,
        }]))

        const {data: resp, error} = await supabase.from('users').select('*, questionID(*), fbData(*)').match({id:id})

        if (resp) {
            res.json(resp[0])
        } else if(error ) {
            console.log(error)
            res.status(500)
        }
    } else {
        res.json(data[0])
    }

    res.status(200)
}