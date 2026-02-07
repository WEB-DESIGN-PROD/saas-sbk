# Guide d'utilisation des Helpers

Votre projet inclut des helpers prêts à l'emploi pour faciliter l'intégration des services.

## 📧 Email Helpers

### Configuration

Les emails sont automatiquement configurés selon votre choix (Resend ou SMTP).

### Envoyer un email simple

```typescript
import { sendEmail } from "@/lib/email/client"

await sendEmail({
  to: "user@example.com",
  subject: "Bienvenue !",
  html: "<h1>Bonjour !</h1><p>Merci de vous être inscrit.</p>",
})
```

### Utiliser les templates pré-configurés

#### Email de bienvenue

```typescript
import { sendWelcomeEmail } from "@/lib/email/templates"

await sendWelcomeEmail(
  "user@example.com",
  "Jean Dupont",
  "Mon SaaS"
)
```

#### Email de vérification

```typescript
import { sendVerificationEmail } from "@/lib/email/templates"

const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=...`

await sendVerificationEmail(
  "user@example.com",
  "Jean Dupont",
  verificationUrl,
  "Mon SaaS"
)
```

#### Email de réinitialisation de mot de passe

```typescript
import { sendResetPasswordEmail } from "@/lib/email/templates"

const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=...`

await sendResetPasswordEmail(
  "user@example.com",
  "Jean Dupont",
  resetUrl,
  "Mon SaaS"
)
```

#### Email Magic Link

```typescript
import { sendMagicLinkEmail } from "@/lib/email/templates"

const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/magic?token=...`

await sendMagicLinkEmail(
  "user@example.com",
  "Jean Dupont",
  magicLinkUrl,
  "Mon SaaS"
)
```

### Créer vos propres templates

Modifiez `lib/email/templates.ts` pour ajouter de nouveaux templates :

```typescript
export const emailTemplates = {
  // ... templates existants

  customTemplate: (name: string, data: any) => `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Bonjour ${name}</h1>
        <p>${data.message}</p>
      </body>
    </html>
  `,
}
```

---

## 📁 Storage Helpers

### Configuration

Le stockage est configuré automatiquement (MinIO local ou AWS S3).

### Upload un fichier

```typescript
import { uploadFile } from "@/lib/storage/client"

// Depuis un formulaire
const formData = new FormData()
const file = formData.get("file") as File
const buffer = Buffer.from(await file.arrayBuffer())

const url = await uploadFile(
  `uploads/${Date.now()}-${file.name}`,
  buffer,
  file.type
)

console.log("File uploaded:", url)
```

### Download un fichier

```typescript
import { downloadFile } from "@/lib/storage/client"

const buffer = await downloadFile("uploads/mon-fichier.pdf")

// Envoyer au client
return new Response(buffer, {
  headers: {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="mon-fichier.pdf"',
  },
})
```

### Supprimer un fichier

```typescript
import { deleteFile } from "@/lib/storage/client"

await deleteFile("uploads/ancien-fichier.pdf")
```

### Obtenir une URL signée temporaire

```typescript
import { getFileUrl } from "@/lib/storage/client"

// URL valide 1 heure (3600 secondes)
const url = await getFileUrl("uploads/private-file.pdf", 3600)

console.log("Temporary URL:", url)
```

### Exemple complet : Route API Upload

```typescript
// app/api/upload/route.ts
import { uploadFile } from "@/lib/storage/client"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Valider le type de fichier
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: "Invalid file type" },
        { status: 400 }
      )
    }

    // Valider la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "File too large" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const key = `uploads/${Date.now()}-${file.name}`

    const url = await uploadFile(key, buffer, file.type)

    return Response.json({ url, key })
  } catch (error) {
    console.error("Upload error:", error)
    return Response.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}
```

---

## 🤖 AI Helpers

### Configuration

L'IA est configurée automatiquement selon votre choix (Claude, OpenAI, ou Gemini).

### Question simple

```typescript
import { ask } from "@/lib/ai/client"

const response = await ask("Quelle est la capitale de la France ?")
console.log(response) // "La capitale de la France est Paris."
```

### Conversation avec contexte

```typescript
import { chat } from "@/lib/ai/client"

const response = await chat([
  { role: "system", content: "Tu es un assistant de code." },
  { role: "user", content: "Comment créer une fonction async en TypeScript ?" },
])

console.log(response)
```

### Streaming (réponse en temps réel)

```typescript
import { streamChat } from "@/lib/ai/client"

const stream = streamChat([
  { role: "user", content: "Écris une histoire courte." },
])

for await (const chunk of stream) {
  process.stdout.write(chunk) // Affiche en temps réel
}
```

### Exemple : Route API Streaming

```typescript
// app/api/ai/chat/route.ts
import { streamChat } from "@/lib/ai/client"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamChat(messages)) {
          controller.enqueue(encoder.encode(chunk))
        }
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}
```

### Exemple : Composant Chat avec streaming

```typescript
"use client"

import { useState } from "react"

export function ChatComponent() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages([...messages, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantMessage += chunk

        // Mettre à jour en temps réel
        setMessages((prev) => {
          const newMessages = [...prev]
          if (newMessages[newMessages.length - 1]?.role === "assistant") {
            newMessages[newMessages.length - 1].content = assistantMessage
          } else {
            newMessages.push({ role: "assistant", content: assistantMessage })
          }
          return newMessages
        })
      }
    } catch (error) {
      console.error("Chat error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder="Votre message..."
        />
        <button type="submit" disabled={isLoading}>
          Envoyer
        </button>
      </form>
    </div>
  )
}
```

---

## 🔄 Combinaisons

### Exemple : Générer une image avec IA et la stocker

```typescript
import { ask } from "@/lib/ai/client"
import { uploadFile } from "@/lib/storage/client"

// 1. Générer du contenu avec l'IA
const imagePrompt = await ask("Décris une belle image de coucher de soleil")

// 2. Utiliser un service de génération d'image (ex: DALL-E)
// const imageBuffer = await generateImage(imagePrompt)

// 3. Stocker l'image
// const url = await uploadFile("generated/sunset.png", imageBuffer, "image/png")
```

### Exemple : Email personnalisé avec IA

```typescript
import { ask } from "@/lib/ai/client"
import { sendEmail } from "@/lib/email/client"

// Générer un email personnalisé
const emailContent = await ask(
  `Écris un email de bienvenue chaleureux pour Jean,
   qui vient de s'inscrire sur notre plateforme de SaaS.
   Retourne uniquement le HTML de l'email.`
)

// Envoyer l'email
await sendEmail({
  to: "jean@example.com",
  subject: "Bienvenue !",
  html: emailContent,
})
```

---

## 🛡️ Bonnes pratiques

### Gestion des erreurs

```typescript
try {
  await sendEmail({ ... })
} catch (error) {
  console.error("Email error:", error)
  // Gérer l'erreur (retry, log, notification, etc.)
}
```

### Rate limiting

Pour l'IA, implémentez un rate limiting :

```typescript
// Utiliser Upstash Rate Limit ou similaire
import { Ratelimit } from "@upstash/ratelimit"

const ratelimit = new Ratelimit({
  redis: ...,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
})

const { success } = await ratelimit.limit(userId)
if (!success) {
  return Response.json({ error: "Rate limit exceeded" }, { status: 429 })
}
```

### Validation des données

```typescript
import { z } from "zod"

const schema = z.object({
  to: z.string().email(),
  subject: z.string().min(1).max(100),
  html: z.string().min(1),
})

const validated = schema.parse(data)
```

---

## 📚 Ressources

- [Resend Docs](https://resend.com/docs)
- [AWS S3 Docs](https://docs.aws.amazon.com/s3/)
- [MinIO Docs](https://min.io/docs/)
- [Anthropic Docs](https://docs.anthropic.com/)
- [OpenAI Docs](https://platform.openai.com/docs)
- [Google AI Docs](https://ai.google.dev/docs)

---

Profitez de ces helpers pour accélérer votre développement ! 🚀
