// Client IA pour Claude, OpenAI, ou Gemini

type AIMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

type AIClient = {
  chat: (messages: AIMessage[]) => Promise<string>
  stream: (messages: AIMessage[]) => AsyncIterable<string>
}

// Client Claude (Anthropic)
async function createClaudeClient(): Promise<AIClient> {
  const Anthropic = await import('@anthropic-ai/sdk')
  const client = new Anthropic.default({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  return {
    chat: async (messages) => {
      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: messages.map((msg) => ({
          role: msg.role === 'system' ? 'user' : msg.role,
          content: msg.content,
        })),
      })

      return response.content[0].type === 'text' ? response.content[0].text : ''
    },

    stream: async function* (messages) {
      const stream = await client.messages.stream({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: messages.map((msg) => ({
          role: msg.role === 'system' ? 'user' : msg.role,
          content: msg.content,
        })),
      })

      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          yield event.delta.text
        }
      }
    },
  }
}

// Client OpenAI
async function createOpenAIClient(): Promise<AIClient> {
  const OpenAI = await import('openai')
  const client = new OpenAI.default({
    apiKey: process.env.OPENAI_API_KEY,
  })

  return {
    chat: async (messages) => {
      const response = await client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      })

      return response.choices[0]?.message?.content || ''
    },

    stream: async function* (messages) {
      const stream = await client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        stream: true,
      })

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          yield content
        }
      }
    },
  }
}

// Client Gemini (Google)
async function createGeminiClient(): Promise<AIClient> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  return {
    chat: async (messages) => {
      // Gemini n'a pas de concept de roles, on concatene les messages
      const prompt = messages.map((msg) => msg.content).join('\n\n')

      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    },

    stream: async function* (messages) {
      const prompt = messages.map((msg) => msg.content).join('\n\n')

      const result = await model.generateContentStream(prompt)

      for await (const chunk of result.stream) {
        const text = chunk.text()
        if (text) {
          yield text
        }
      }
    },
  }
}

// Factory pour créer le bon client
export async function getAIClient(): Promise<AIClient> {
  if (process.env.ANTHROPIC_API_KEY) {
    return createClaudeClient()
  } else if (process.env.OPENAI_API_KEY) {
    return createOpenAIClient()
  } else if (process.env.GOOGLE_API_KEY) {
    return createGeminiClient()
  } else {
    throw new Error('Aucune clé API AI configurée')
  }
}

// Helpers
export async function chat(messages: AIMessage[]): Promise<string> {
  const client = await getAIClient()
  return client.chat(messages)
}

export async function* streamChat(messages: AIMessage[]): AsyncIterable<string> {
  const client = await getAIClient()
  yield* client.stream(messages)
}

// Helper simplifié pour une question simple
export async function ask(prompt: string): Promise<string> {
  return chat([{ role: 'user', content: prompt }])
}

// Helper pour streamer une réponse simple
export async function* askStream(prompt: string): AsyncIterable<string> {
  yield* streamChat([{ role: 'user', content: prompt }])
}
