import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';


const magic = new Magic('pk_live_62358854AD91AD07', {
    extensions: [new OAuthExtension()],
});

export default async function logOut () {
    await magic.user.logout()
}