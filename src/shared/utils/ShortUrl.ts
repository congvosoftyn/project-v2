import * as request from 'request-promise-native';

export class ShortUrl {

    async load(url) {
        // const googleUrl = new GoogleUrl( { key: process.env.GOOGLE_API_KEY });

        // return googleUrl.shorten(url, function( err, ShortUrl ) {
        // 	return ShortUrl;
        // });
        return await request.post({
            url: "https://www.googleapis.com/urlshortener/v1/url?key=" + process.env.GOOGLE_API_KEY,
            json: true,
            body: {
                longUrl: url
            },
        })
        // return await request.get({
        // 	url: "https://is.gd/create.php?format=simple&url="+url,
        // 	json: true
        // });
        // request({
        // 	url: "https://is.gd/create.php?format=simple&url="+url,
        // 	json: true
        // }, function (error, response, body) {
        // 	if (!error && response.statusCode == 200) {
        // 		callback(null, body);
        // 	}else {
        // 		this.emit('error', new Error('Bad status code'));
        // 	}
        // });
    }
    async short(url) {
        try {
            return await this.load(url);
        } catch (err) {
            console.log(err)
            return null;
        }

    }
}