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

describe('should test Prisma client and PgBouncer', () => {
  afterAll(async () => {
    await client.$disconnect()
    return
  })

  it('should fail with docker pgbouncer without the pgbouncer query string param', async () => {
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
      expect(1).toEqual(0) // The code should never reach here
    } catch (e) {
      expect(e.toString()).toMatchSnapshot()
    }
  })
})
