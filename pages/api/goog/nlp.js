const NLP = require('google-nlp')
const language = require('@google-cloud/language');

export default async function nlp(req, res) {

    // const client = new language.LanguageServiceClient()
    // client.
    const data = req.body
    console.log(data,55)

    const apiKey = 'AIzaSyBEiDyhsAYPZEMYKHTWZzSKmUoGq16e0QA'

    let nlp = new NLP( apiKey )

    nlp.analyzeSentiment(data.val).then((item)=>{
        console.log(item,111)
    })

    nlp.analyzeEntities(data.val)
        .then(function( entities ) {
            console.log( 'Entities:', entities );
            res.json(entities)
            res.end()
        })
        .catch(function( error ) {
            // 	Error received, output the error
            console.log( 'Error:', error.message );
        })

    res.status(200)
}