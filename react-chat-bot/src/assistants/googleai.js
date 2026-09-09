import { GoogleGenerativeAI } from "@google/generative-ai";

const googleai = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
  
  

export class Assistant {
    #chat;

    constructor(model= "gemini-2.5-flash") {
        const gemini = googleai.getGenerativeModel({model});
        this.#chat = gemini.startChat({history:[]});
    }

    async chat(content){
        // eslint-disable-next-line no-useless-catch
        try {
             const result = await this.#chat.sendMessage(content);
             return result.response.text()
        } catch (error) {
            throw error
        }
    }

    async *chatStream(content){
        // eslint-disable-next-line no-useless-catch
        try {
            const result = await this.#chat.sendMessageStream(content);

            for await (const chunk of result.stream){
                yield chunk.text();
            }
        } catch (error) {
            throw error;
        }
    }

}