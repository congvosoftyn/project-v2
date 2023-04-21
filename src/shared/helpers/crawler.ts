import * as https from 'https';
import { OpenHourEntity } from "src/entities/OpenHour.entity";
import { StoreEntity } from 'src/entities/Store.entity';
import { PictureEntity } from 'src/entities/Picture.entity';
const googleKey = 'AIzaSyAd0eybHw8DiwMxoGAMgMilp8B99uxysDA'

export class Crawler {

    static data = {};
    static logging: boolean = true;

    static async nearby(lat: number, long: number, searchRadius: number, keyword?: string) {
        try {
            if (this.logging === true) console.log("Searching new area...");
            this.data = {};
            let dataChunk = await this.httpsGetJson(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${keyword ?? ''}&location=${lat},${long}&radius=${searchRadius}&key=${googleKey}`);
            await this.collectData(dataChunk);
        } catch (err) {
            console.log(err)
        }


    }

    static async area(startLat, startLong, endLat, endLong, searchRadius) {
        let latIncrement = searchRadius * 0.00000904371733;
        let longIncrement = searchRadius * 0.00000898311175 / Math.cos(startLat * Math.PI / 180);

        for (let long = startLong; long <= endLong; long += longIncrement) {
            for (let lat = startLat; lat <= endLat; lat += latIncrement) {
                await this.nearby(lat, long, searchRadius);
            }
        }
    }
    ;
    static async placeNearbySearch(lat: number, long: number, searchRadius: number, keyword: string) {
        if (this.logging === true) {
            console.log(`\nUsing Google Maps API key: ${googleKey}`);
            console.log(`Searching for places within ${searchRadius} meters of (${lat},${long})...\n`);
        }
        await this.nearby(lat, long, searchRadius, keyword);
        return this.data;
    }

    static async searchArea(startLat: number, startLong: number, endLat: number, endLong: number, searchRadius: number) {
        if (this.logging === true) {
            console.log(`\nUsing Google Maps API key: ${googleKey}`);
            console.log(`Searching for places from (${startLat},${startLong}) to (${endLat},${endLong}) with search radius ${searchRadius} meters...\n`);
        }
        await this.area(startLat, startLong, endLat, endLong, searchRadius);
        return this.data;

    }

    static async collectData(dataChunk) {
        for (let eachPlace of dataChunk.results) {
            let placeID = eachPlace.place_id;

            // If this place doesn't already exist in DATA
            // Gets place details, given a Place ID, and adds to DATA
            if (!this.data[placeID]) {
                this.importPlace(placeID);
            }
        }

        if (dataChunk.next_page_token) return this.continueSearch(dataChunk.next_page_token);

    }

    static async importPlace(placeID: string, userId?: number) {
        let place: any = await Crawler.httpsGetJson(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}&key=${googleKey}`);
        // Don't collect data if place no longer exists
        // console.log(place)

        if (!place.permanently_closed) {

            let p = place.result;
            this.data[placeID] =
            {
                "placeID": placeID,
                "name": p.name,
                "address":
                {
                    "full": p.formatted_address,
                    "components": p.address_components
                },
                "website": p.website,
                "phone": p.formatted_phone_number,
                "internationalPhone": p.international_phone_number,
                "latitude": p.geometry.location.lat,
                "longitude": p.geometry.location.lng,
                "googlePage": p.url,
                "hours": p.opening_hours,
                "priceLevel": p.price_level,
                "rating": p.rating,
                "types": p.types,
                "utcOffset": p.utc_offset,
                "vicinity": p.vicinity,
            };


            const addressComponent = p.address_components;
            const subpremise = addressComponent.find(a => a.types.includes('subpremise'))?.short_name
            const addressNumber = addressComponent.find(a => a.types.includes('street_number'))?.short_name
            const addressRoute = addressComponent.find(a => a.types.includes('route'))?.short_name
            const addressRouteLong = addressComponent.find(a => a.types.includes('route'))?.long_name;
            const city = addressComponent.find(a => a.types.includes('locality'))?.short_name;
            const state = addressComponent.find(a => a.types.includes('administrative_area_level_1'))?.short_name;
            const zipCode = addressComponent.find(a => a.types.includes('postal_code'))?.short_name;
            const location = p.geometry.location;
            const storefind = await StoreEntity.findOne({
                where: {
                    name: p.name,
                    city,
                    state,
                    zipcode: zipCode,
                    phoneNumber: p.formatted_phone_number.replace(/\D/g, '')
                }
            })


            let store: StoreEntity = {
                name: p.name,
                address: [addressNumber, addressRoute].join(' '),
                address2: subpremise,
                city: city,
                state: state,
                zipcode: zipCode,
                phoneNumber: p.formatted_phone_number.replace(/\D/g, ''),
                website: p.website,
                timezone: this.getTimeZone(p.utc_offset),
                latitude: parseFloat(location.lat),
                longitude: parseFloat(location.lng),
                types: p.types,
            } as StoreEntity;

            if (storefind) {
                if (storefind.imported) return storefind;
                store = { ...storefind, ...store } as StoreEntity;
            }



            if (p.photos && p.photos.length) {
                let savePics = []
                for (let photo of p.photos) {
                    const html = await this.getPhoto(photo.photo_reference);
                    const regex = /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi
                    const pictures = html.match(regex)
                    if (pictures && pictures.length)
                        savePics = savePics.concat(await Promise.all(pictures.map(async (pic) => {
                            return await PictureEntity.save({ picture: pic, thumbnail: pic } as PictureEntity)
                        })))
                }
                store.pictures = savePics;
            }

            if (store.pictures && store.pictures.length) {
                store.image = store.pictures[0].picture
            }

            const result = await StoreEntity.save(store);
            for (let i = 0; i < 7; i++) {

                const find = p.opening_hours?.periods.find(p => p.open.day === i)

                let openHour: any = { storeId: result.id, day: i, }
                if (storefind) {
                    const op = await OpenHourEntity.findOne({ where: { storeId: storefind.id, day: i } });
                    if (op) {
                        openHour = op;
                    }
                }
                if (find) {
                    openHour = {
                        ...openHour,
                        open: true,
                        fromHour: find.open.time.substring(0, 2) + ":" + find.open.time.substring(2, find.open.time.length),
                        toHour: find.close.time.substring(0, 2) + ":" + find.open.time.substring(2, find.close.time.length),

                    } as OpenHourEntity
                    OpenHourEntity.save(openHour);
                } else {
                    openHour = <OpenHourEntity>{
                        ...openHour,
                        open: false,
                    };
                    OpenHourEntity.save(openHour);
                }

            }

            return result;
        } else {
            console.log(placeID);
        }
    }

    static getTimeZone(offset: number) {
        switch (offset) {

            case -240:
                return 'America/New_York'
            case -300:
                return 'America/Chicago'
            case -360:
                return 'America/Denver'
            case -420:
                return 'America/Los_Angeles'
            case -480:
                return 'America/Anchorage'
            case -600:
                return 'Pacific/Honolulu'
        }
    }

    static getPhoto(photo_reference: string): Promise<string> {
        const url = `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photo_reference}&maxwidth=800&key=${googleKey}`

        return new Promise((resolve, reject) => {
            https.get(url, (response) => {
                const dataBuffers = []
                response.on('data', data => dataBuffers.push(data.toString('utf8')))
                response.on('end', () => resolve(dataBuffers.join('')))
                //    // response.setEncoding('utf8');
                //     const random = Array(32)
                //     .fill(null)
                //     .map(() => Math.round(Math.random() * 16).toString(16))
                //     .join('');
                //     const destination = 'photos';
                //   //  const file = `${random}${extname(file.originalname)}`
                //     let rawData = '';
                //     let parsedData;
                // response.pipe(fs.createWriteStream(`./public/${destination}/${random}.jpg`));
                // response.on('data', (chunk) => { rawData += chunk; });
                // response.on('end', () => {
                //     try {
                //         parsedData = JSON.parse(rawData);
                //     } catch (e) {
                //         console.error(e.message);
                //     }
                //     console.log("parsedData", parsedData)
                //     res(parsedData);
                // });
            }).on('error', (error) => {
                console.log(error)
                reject(error);
            })
        })

    }

    static async continueSearch(pagetoken) {
        console.log("Found more than 20 places. Continuing search...");
        this.wait(1500);
        let dataChunk = await Crawler.httpsGetJson(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${googleKey}&pagetoken=${pagetoken}`);
        console.log(dataChunk)
        await this.collectData(dataChunk);
    }

    static getCategory(type: string[]) {
        if (type.includes('beauty_salon')) {
            return 9
        } else if (type.includes('restaurant')) {
            return 2
        } else {
            return 9;
        }
    }

    static httpsGetJson(url) {
        return new Promise(function (resolve, reject) {
            https.get(url, (response) => {
                response.setEncoding('utf8');
                let rawData = '';
                let parsedData;
                response.on('data', (chunk) => { rawData += chunk; });
                response.on('end', () => {
                    try {
                        //    console.log("rawData", rawData)
                        parsedData = JSON.parse(rawData);
                    } catch (e) {
                        console.error(e.message);
                    }
                    resolve(parsedData);
                });
            }).on('error', (error) => {
                reject(error);
            })
        })
    }

    static wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        })
    }
}

