async function headers() {
    return [
        {
            // matching all API routes
            source: "/api/:path*",
            headers: [
                { key: "Access-Control-Allow-Credentials", value: "true" },
                { key: "Access-Control-Allow-Origin", value: "*" },
                { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
                { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                { key: "Cache-Control", value: "public,max-age=259200"}
            ]
        },
        {
            source: "/api/pdfs/:fileName",
            headers: [
                {
                    key: "Cache-Control",
                    value: "public,max-age=259200"
                },
                {
                    key: "Content-Type",
                    value: "application/pdf"
                },
                {
                    key: "x-debug-info-next-config",
                    value: "next.config.js is effected."
                }
            ]
        }
    ]
}



module.exports = {
    headers
}
