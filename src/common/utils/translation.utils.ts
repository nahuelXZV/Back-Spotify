import { TranslationServiceClient } from '@google-cloud/translate';


export class GoogleTranslationService {
    static async translateText(text: string, targetLanguageCode: string, sourceLanguageCode: string = 'en') {
        const translationClient = new TranslationServiceClient({
            keyFilename: 'src/common/credentials/credenciales.json',
        });
        const projectId = 'eastern-kit-406914';
        const location = 'global';
        const request = {
            parent: `projects/${projectId}/locations/${location}`,
            contents: [text],
            mimeType: 'text/plain', // mime types: text/plain, text/html
            sourceLanguageCode: sourceLanguageCode,
            targetLanguageCode: targetLanguageCode,
        };

        try {
            // Run request
            const [response] = await translationClient.translateText(request);

            let responseTraduction: string = "";
            for (const translation of response.translations) {
                console.log(`Translation: ${translation.translatedText}`);
                responseTraduction = translation.translatedText;
            }
            return responseTraduction;
        } catch (error) {
            console.error(error.details);
        }
    }
}


/* 
key=API_KEY
AIzaSyDDLB7eDdiKP0b6WVDZeRo5MMFw2HVkpsY
*/