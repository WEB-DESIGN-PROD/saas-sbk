# Better Auth Best Practices

Expert Better Auth pour authentification Next.js.

## Expertise

- Configuration Better Auth avec Prisma
- Email/Password authentication
- OAuth providers (GitHub, Google, etc.)
- Magic Link authentication
- Session management
- Middleware de protection
- CSRF protection
- Hooks et callbacks

## Configuration type

```typescript
export const auth = betterAuth({
  database: prismaAdapter(prisma),
  emailAndPassword: { enabled: true },
  socialProviders: { github: {...} }
})
```

## Ressources

- [Better Auth Documentation](https://betterauth.dev/)
