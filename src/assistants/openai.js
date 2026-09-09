import OpenAI from "openai";


const openai = new OpenAI({
    apiKey : import.meta.env.VITE_OPEN_API_KEY,
    dangerouslyAllowBrowser: true,
});

export class Assistant {
  #model;

  constructor(model = "gpt-5") {
    this.#model = model;
  }

  async chat(content, history) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await openai.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
      });

      return result.choices[0].message.content;
    } catch (error) {
      throw error;
    }
  }

  async *chatStream(content, history) {
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await openai.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
        stream: true,
      });

      for await (const chunk of result) {
        yield chunk.choices[0]?.delta?.content || "";
      }
    } catch (error) {
      throw error;
    }
  }
}