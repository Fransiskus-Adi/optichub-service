export default () => ({
    appPort: process.env.APP_PORT,
    database: {
        typeorm: {
            port: Number(process.env.TYPEORM_PORT),
            host: process.env.TYPEORM_HOST,
            database: process.env.TYPEORM_DATABASE,
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
        },
    },
})