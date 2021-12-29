module.exports = {
    name: 'ptt_fit_auto',
    mainUrl: 'https://www.pttfitauto.com/th/branch',
    requestIntercepts: [],
    responseIntercepts: [
        {
            name: 'pttfitauto_list',
            urlFilter(url) {
                return url.includes("https://api.pttfitauto.com/applayout/list") && !url.includes('sortby')
            },
            mapResponse(res) {
                let results = ((res?.results ?? {})?.shoppening_list ?? []).map(r => ({
                    ...r,
                    category: r.category?.toString(),
                    image: r.image?.url
                }));

                return results;
            }
        }
    ]
}