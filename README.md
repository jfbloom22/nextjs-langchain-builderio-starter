This is a starter for Next.js, Tailwind, LangChain, Clerk, Neon, Prisma, and maybe Builder.io

## Prisma
`npx prisma generate` - this will generate the Prisma client
`npx prisma db push` - this effectively runs migrations on the Neon serverless postgres database
`npx prisma format` - this will help define foreign keys and enforce best practices
`prisma migrate dev --name {name}` - this will create a migration file in the migrations folder.  You can use this to create a migration file.  The name is the name of the migration file.  The name should be in snake-case.
`prisma migrate deploy` - this will run the migrations

### How to use Prisma Studio
`npx prisma studio` - this will open the Prisma Studio in your browser.  You can use this to visually see the database schema and relationships.

# Default Next.js Readme

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## GPT Auth
Use the Actions GPT to help define the action
https://chat.openai.com/g/g-TYEliDU6A-actionsgpt




### Create Farm
```
{
  "openapi": "3.1.0",
  "info": {
    "title": "Create Farm",
    "description": "Create and name a new farm",
    "version": "v1.0.0"
  },
  "servers": [
    {
      "url": "https://nextjs-langchain-builderio-starter.vercel.app"
    }
  ],
  "paths": {
    "/api/store": {
      "post": {
        "summary": "Create a new farm",
        "operationId": "createFarm",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "Name of the farm"
                  }
                },
                "required": ["name"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success"
          },
          "400": {
            "description": "Invalid input"
          }
        },
        "security": [
          {
            "Oauth2": ["name", "email"]
          }
        ]
      }
    }
  },
  "components": {
    "schemas": {},
    "securitySchemes": {
      "Oauth2": {
        "type": "oauth2",
        "flows": {
          "authorizationCode": {
            "authorizationUrl": "https://singular-guppy-88.clerk.accounts.dev/oauth/authorize",
            "tokenUrl": "https://singular-guppy-88.clerk.accounts.dev/oauth/token",
            "scopes": {
              "name": "Access to name",
              "email": "Access to email"
            }
          }
        }
      }
    }
  }
}
```