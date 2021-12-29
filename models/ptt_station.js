module.exports = {
    name: 'ptt_station',
    mainUrl: 'https://pttstation.com/',
    requestIntercepts: [],
    responseIntercepts: [
        {
            name: 'm_stations',
            urlFilter(url) {
                return url.includes("/list_station")
            },
            mapResponse(res) {
                return res.data;
            }
        }
    ]
}