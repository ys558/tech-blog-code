import { serve } from 'https://deno.land/std/http/server.ts'

const s = serve({ port: 8000 })
console.log('http://localhost:8000')
for await (const req of s) {
    console.log(req)
    req.respond({ body: 'hello world\n' })
}