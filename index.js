const { PrismaClient } = require('@prisma/client')

const client = new PrismaClient({
  errorFormat: 'colorless',
  datasources: {
    db: {
      url: 'postgresql://postgres:postgres@127.0.0.1:6433/blog?schema=public',
    },
  },
})

async function clientWithoutQueryStringParamCall() {
  const data = await client.user.findMany()
  return data
}
async function main() {
  try {
    await clientWithoutQueryStringParamCall()

    /*
     * Query engine instance names prepared statements serially s0, s1 and so on. Without the `pgbouncer=true` flag,
     * prepared statements are not cleaned up in PgBouncer. By doing disconnect/reconnect, we get a
     * new instance of query engine that starts again at s0. And we expect the next client call to throw
     * "prepared statement s0 already exists"
     */
    await client.$disconnect()
    await client.$connect()

    await clientWithoutQueryStringParamCall()
  } catch (e) {
    console.log(e)
  }
}

main()
