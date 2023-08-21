import { copy } from 'fs-extra'
export async function buildUploadPage(){
    await copy('./public', './dist/news/html/public')
}
