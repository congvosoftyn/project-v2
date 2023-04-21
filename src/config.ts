export const SECRET = 'ver5afsdvEFsdvA#0963erfsdcaq23va#WE2342FAAS';
export const TWILIO_PHONE_NUMBER = '+17089147992';
export const TWILIO_ACCOUNT_SID = 'ACdfdb288599ee02dc9e66362e9ab7a41a';
export const TWILIO_AUTH_TOKEN = 'cf1c9a30a78b217eb6545018cc3bbe0f';
export const PUBLIC_DIR = '../public';
export const MAIN_URL = process.env.MAIN_URL || 'http://charmsta.softyn.com'
export const EXCLUDE_LIST_WORDS = ['for', 'sale', 'a', 'many', 'alot'];
export const EMAIL_SERVICE = 'gmail';
export const EMAIL_USER = 'softyn@softyn.com';
export const EMAIL_PASSWORD = 'Houston123!';
export const JWT_VERIFICATION_TOKEN_SECRET = '6Dfg#fd53SVBfse455epXmdaJfUrokkQ'
export const JWT_VERIFICATION_TOKEN_EXPIRATION_TIME = 21600;
export const EMAIL_CONFIRMATION_URL = MAIN_URL + '/email/confirm';
export const EMAIL_CONFIRMATION_URL_UNSUBSCRIBE = MAIN_URL + '/email/unsubscribe';
export const FACEBOOK_SECRET_KEY = '985743092054645';
export const PRODUCTION = process.env.PRODUCTION;
export const enum TYPE_STORAGE {
    AWS = 'AWS',
    FTP = 'FTP',
    LOCAL = 'LOCAL',
}

export const REDIS_HOST = "localhost";
export const REDIS_PORT = 6379;
export const REDIS_TTL = 86400;

export const STRIPE_SECRET = 'bgfh65343rwefewt2342142bgffcxvnnb3' || '';
export const LIFE_SECRET = 'bgfh65343rwefewt2342142bgffcxvnnb3';
export const TOKEN_LIFE_EXPIRES = 86400;
export const REFRESH_TOKEN_SECRET = 'cxf5rgsasdvzsGFsS4sSBXD4534SFXff';
export const REFRESH_TOKEN_LIFE_EXPIRES = 86400;
export const HOST = 'https://pisi.us';
export const FCM = {
    "type": "service_account",
    "project_id": "uzmos-business",
    "private_key_id": "84837eb245aaedde47ff86af96c4e0e3dcc15f97",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDHIyLI8UtA19N\nr8NMpkSyItatcvBXhs+tm94m4FPhEd7xOCP2Hd0bts70m1bIefW7q5EgDEDduSSk\niz8MivUdP5LzvPC45bbInSQln5V3tu05taOcRZID+Fuk6O7fV7mf1hke87YAchxr\nQzY/IJ4Nyr1ufLckMtyQXAfktr4vQWV4LcYlEXoAOZiWyk6GOAgq5VZMXsL76HV6\n8lzaaLPPKm8scyIVD5GMYGpa3anEEIJIu/WUsvfL+5QuHiVSbqMZyyGTFIqBYD8M\nrAN4d0al5GPG7lpxkbxTQKmhjc/wEojr8O3gXirjMP1dYq0qOF5TfI+NH8R7XcMo\n9nwCa/nRAgMBAAECggEAErngu1H5kLJsKTafVfH3UemKFSec7amgsRbuoWiSZF2k\nuh4bRXnkSM6o2k02bRNXhGWZDixe5WjpnWlH6dpEYERDxGTz7asOef6rA3lnjQ/f\ngNRwGYWL2Bm0IgXBN2piBHc1/gSCCVTqaVkQEcr9oHE+8SXDJhRDmw9aKpdndX10\naC5eslPBUHFcp6CdqZvKpfkNdBQZo8fK0WK9hyXHRv5GWUI0bmawZsedFHyuGd4Q\nacZ0rHZSDUHqbBCmLKkd1Mm3Rcv+2X72OtU+akprzna9jbAiPUF5J2VV4tEFarm7\n9Q8O/pZXBWOJIIbH1wrFXKcV5NJ1x3YErArS5OpviQKBgQDkwbm69cYg99JqZgGg\nEaoVh2PBhjBbTVe8NXFw6JxZNGVdz7iUwze2wYiLP5A/3GibD6rQ2aLpdkWJOxh8\nUTCe2BLB28XOlBs9oFvoyzblkitfkGXN+YIMeU6I2AYYTggt6GMLU6z5E2FO8zD1\nbKsvjWOWQvWYLhZEHOHaBaKiHwKBgQDaWQ6VspKWJ8up4HkFTIdDO7wMjClzfVeO\npt/1ZDEwpxRLvow/o+3hkfHX8H8LDX/sw7xOsfypf6IIGeMjIar9bE9ys6ykbFdU\n3Y92mGEZALwHC2eVxfjMD7sM1pk1Z6FnhF4Z/yqTlUM/OKA+IzGsejcmjSRJsKz+\n11rCuHBGDwKBgGG4T/sJ2qViuEQzZyZV5W5k87xL8oROOdhwjBFLjN6ef17fyV3j\nNv2fFxFFCf39zcHPo4ysK+fHWlURJZiVpkt0yi5+D7X7ltdwlVKQ3Nac5mJgcNzY\nZTGm8GGMxq3DR8M0rnq8N/v+x2bOhG+TCF277HrYB8oGhgR6whA8sAjJAoGAbIyb\nsJY/Q8DzAjgjUhwSnr0ipsZDkTO+BKA3dOJjhgF6GJHZXYYcq+iHZ8gbEJ6ce1Nv\n2Vuo9YcLQaXFAuEpBaYD9U0XxgJKhFlFijsFAo4X7BSiYZYzMxea8S36qs8jMbhf\no+L0ArzQ2qxHFb0fY9S6eELwyGW6C1N6vpU808cCgYEA3wbE+Joa0AO6uAiJnjh3\nExxCxjE/nu2O6buRxkl7KfuYYpiDH6lN/IDCmMxpcWrCm9ttY0sj/irX1+PLnhiH\nk0DI7HHT+naYbs7qyHLAELoh67w7cDsPcjKx8RpSqzn9XvzUWkOlhEI/wQC12CSx\njDduav0CJevgSbnuGCudYIo=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-b1xfd@uzmos-business.iam.gserviceaccount.com",
    "client_id": "106649052442252468267",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-b1xfd%40uzmos-business.iam.gserviceaccount.com"
}

export const STOREFCM = {
    "type": "service_account",
    "project_id": "uzmos-store",
    "private_key_id": "73c28c0d104b810ed1580e9540787112602621f2",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDbbCMd9uGK6EwZ\no/luONgGyBgZaQesHzt9GYfHx1/8ahWrKAQLnz78QxTr0sxnHCrDop2IdlE1NFgM\nUPydQXY69yXpfli1TyR9sIbyYSd8PLjMrnpKXLnZ2N00NC9L+LBKuSDvAAQKw6YI\neOx+UcHiBzcFaigpNZJ1B1fVxxcSHO8sBdZxWdWlOqnEYFXYYroIrW60udV030WI\n+9QEa8EagwMqVs7t7tv3hzibQhHecishGSrX8HbZL1qAxS03+EqIGaHBrsv5KDGJ\nYUML/lNthY7SpklRuiQcun7GcUtNEfkl07m9WDk1mk7ZzvVmAjwJDuiEm4G5Jyjt\nryZp30qbAgMBAAECggEALTgR3KD+RiQtWrNiOgbY7jzaSpJMlHozRkq2osNB0sEC\nCi3K96Iv1sj0TM06dp1lar/eezr27WIGKzOde8L73JcGZyI0odjXileQ1+6RtpbE\n9tmWNjD51B1PKO0AOkXb/uo8EUUNkDJVyzUwd6/dpvkZq7H+6M8ziY6j2ViYNpEC\nDJKZpjULQu9ZxIChX+gNEjwOwWa3Ds+1L8yE+4ktGHi63Ap2BXOeu1BWQORj0wZb\n7AL5tm0PbyBwID+OJ00eEKq/eKLQ+O4UbogsJqHrcczYuolb9f5sL5ltZtwoZzqh\nGx0ik1iT1AzVobsWyRdkLervzrmWCMEZ0m2I4yQh0QKBgQD85uSHNd+vfiqf+dDE\nkPunrCvhtlOAVGHbMhy1qqjPGSAdEYjY+PVFbGz9KfFvS+SLKrsdioQBjsIuIiwY\ndwq2avCHQdkCuzWlzAjzulDEkB7xbBTe2lr7uKuO8/dPkgswiQx9KoGfwQhaZtr3\noEOOaksjmud4Ai1J54r9pKfD3QKBgQDeHEB3cEV3Kija+fCKjw/JV9JkXY/CKZLV\nhIUIIoZkf1yK8uiIqq4R2Ami34rZjT4S25YpocG35LgFHuD8qkWw94BeGljYX10B\ns3omUvctEJKUUG1uRPu4ByaJAd8GZQd1rBbGl2dGsBzcGcb7woTrKOJd9VCgPshj\nkCR5uzo81wKBgQDXRwhjXGWzsldAZFvk53GAsluMQDLmO24tM4Qi1EnsOHwQont2\nDr5iQUCpZEnDrru2B0LOi7mAxe/fa3FTxgmVbISg7ll3LLsnDf7U0dWs7O2aHqHJ\nbeAjBHjtMBlmX3As+YxrA4Lh5WRh58ofHgpDsZGSlmrQyjGZBoNXFBFG9QKBgQDQ\nuFfUZYrByrqN3KYwbvP0zzSE4G9BlHPJdjjVRixosE60vEPMeigN2KhliBAhFFuq\nuPNJuBokxygul6/xf8jx3gOharzmx+bMvG4jKX/ht1snSNUs9GJfs0iBI2MDzVjP\nOaJFiO2iPclBBHA7EbZ6jfb7OJZFn/oLpd7BDjJSDQKBgG6T2fEdxNbbOUFLbXxI\npJV/mov36mCbSstoOlFKvHaTX9Xs7Y2rHBiaRE8gApC9VL8X34L67V+Znp7GFj4U\n17S/K88EIuxlhMY0iNUjH7x1pNaoqSbzdIfHsX0/1Rnc6xpgKPmS3AfpYViM5ItQ\n0CkGQf1Cp+I7jy+5848f8rpU\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-i81z2@uzmos-store.iam.gserviceaccount.com",
    "client_id": "106094249904019761844",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-i81z2%40uzmos-store.iam.gserviceaccount.com"
};

export const SECRET_KEY_FIREBASE = 'AAAAJdLiQW0:APA91bFMUEdMpVI3SXTTWXfgJNxdBoBh2rsX8mo2TEsZS7TGrbjFUIo99MSekYRq6C73kH-PXJDds2TZrYRb_SK8apnlZIYlsPOmUIDd6DyIzmXpFpcM5BQ-p5Tnpr0Y8aHpoWY5X7Fn'
export const URL_FIREBASE = 'https://fcm.googleapis.com/fcm'
export const PROJECT_ID_FIREBASE = '162451833197'

export const TYPE_STORAGE_IMAGE = process.env.TYPE_STORAGE;

export const ALLOW_AVATAR_FILE: string[] = ['image/png', 'image/jpeg', 'image/jpg'];

export const VALIDATE_FILE_VIDEO: string[] = ['video/webm', 'video/mp4'];

export const AWS_STORAGE = {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'AKIAQ5ZGODFUMR2JALDS',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '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',
    AWS_ENDPOINT: process.env.AWS_ENDPOINT || 'https://vietcenter-1.s3.us-east-1.amazonaws.com/',
    AWS_BUCKET: process.env.AWS_BUCKET || 'vietcenter-1',
    AWS_ACL: process.env.AWS_ACL,
    AWS_S3_FORCE_PATH_STYLE: JSON.parse(process.env.AWS_S3_FORCE_PATH_STYLE || 'false'),
    AWS_S3_BUCKET_ENDPOINT: JSON.parse(process.env.AWS_S3_BUCKET_ENDPOINT || 'false'),
}

export const FTP_STORAGE = {
    basepath: process.env.FTP_STORAGE_BASE_PATH || '/',
    ftp: {
        host: process.env.FTP_STORAGE_HOST || 'softyn.com',
        secure: process.env.FTP_STORAGE_SECURE,
        user: process.env.FTP_STORAGE_USER || 'vietcenter',
        password: process.env.FTP_STORAGE_PASSWORD || '1ax4Q?6s',
    },
};

export const NO_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJVc2VybmFtZSI6InZvdGhlY29uZyIsImV4cCI6MzI1MjQ2MTIxMjQsImlhdCI6MTY2MTkyNzMyNH0.39PLuU0UK2r-7kRp1UJGHZ8BwG189tqUisi_N_6kL_8'

export const BusinessType = [
    { key: "HAIR_SALON", value: 'Hari Salon', },
    { key: "NAIL_SALON", value: 'Nail Salon' },
    { key: "BARBERSHOP", value: 'Barbershop' },
    { key: "BEAUTY_SALON", value: 'Beauty Salon' },
    { key: "AESTHETICS", value: 'Aesthetics' },
    { key: "SPA", value: 'Spa' },
    { key: "MASSAGE", value: 'Massage' },
    { key: "WAXING_SALON", value: 'Waxing Salon' },
    { key: "TANNING_STUDIO", value: 'Tanning Studio' },
    { key: "EYEBROWS_LASHES", value: 'Eyebrows & Lashes' },
    { key: "TATTOO_PIERCING", value: 'Tattoo & Piercing' },
    { key: "THERAPY_CENTER", value: 'Therapy Cennter' },
    { key: "WEIGHT_LOSS", value: 'Weight Loss' },
    { key: "PERSONAL_TRAINER", value: 'Personal Trainer' },
    { key: "GYM_FITNESS", value: 'Gym Fitness' }
]

export enum BUSINESS_TYPE {
    HAIR_SALON = 'Hari Salon',
    NAIL_SALON = 'Nail Salon',
    BARBERSHOP = 'Barbershop',
    BEAUTY_SALON = 'Beauty Salon',
    AESTHETICS = 'Aesthetics',
    SPA = 'Spa',
    MASSAGE = 'Massage',
    WAXING_SALON = 'Waxing Salon',
    TANNING_STUDIO = 'Tanning Studio',
    EYEBROWS_LASHES = 'Eyebrows & Lashes',
    TATTOO_PIERCING = 'Tattoo & Piercing',
    THERAPY_CENTER = 'Therapy Cennter',
    WEIGHT_LOSS = 'Weight Loss',
    PERSONAL_TRAINER = 'Personal Trainer',
    GYM_FITNESS = 'Gym Fitness'
}


