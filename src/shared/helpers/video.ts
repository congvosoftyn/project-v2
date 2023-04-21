import * as FFmpeg from "fluent-ffmpeg";
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg')

export function resizingFFmpeg(video: string, width: number, height: number, tempFile: string, autoPad?: boolean, padColor?: string): Promise<string> {

    return new Promise((res, rej) => {
        FFmpeg.setFfmpegPath(ffmpegInstaller.path)

        let ff = FFmpeg(video).videoCodec('libx264').size(`${width}x${height}`).format('mp4');
        autoPad ? (ff = ff.autoPad(autoPad, padColor)) : null;
        ff.on("start", function (commandLine) {
            console.log("Spawned FFmpeg with command: " + commandLine);
            console.log("Start resizingFFmpeg:", video);
        })
            // .on("progress", function(progress) {
            //   console.log(progress);
            // })
            .on("error", function (err) {
                console.log("Problem performing ffmpeg function");
                rej(err);
            })
            .on("end", function () {
                console.log("End resizingFFmpeg:", tempFile);
                res(tempFile);
            })
            .output(tempFile).run()
    });
}

export function videoCropCenterFFmpeg(video: string, w: number, h: number, tempFile: string): Promise<string> {
    return new Promise((res, rej) => {
        FFmpeg.setFfmpegPath(ffmpegInstaller.path)
        FFmpeg()
            .input(video)
            .videoFilters([{ filter: "crop", options: { w, h, }, },])
            .videoCodec('libx264').format('mp4')
            .on("start", function (commandLine) {
                console.log("Spawned FFmpeg with command: " + commandLine);
                console.log("Start videoCropCenterFFmpeg:", video);
            })
            // .on("progress", function(progress) {
            //   console.log(progress);
            // })
            .on("error", function (err) {
                console.log("Problem performing ffmpeg function");
                rej(err);
            })
            .on("end", function () {
                console.log("End videoCropCenterFFmpeg:", tempFile);
                res(tempFile);
            })
            .output(tempFile).run()
    });
}

export function getDimentions(media: string) {
    console.log("Getting Dimentions from:", media);
    try {
        return new Promise<{ width: number; height: number }>((res, rej) => {
            FFmpeg.setFfmpegPath(ffmpegInstaller.path)

            FFmpeg.ffprobe(media, async function (err, metadata) {
                if (err) {
                    console.log("Error occured while getting dimensions of:", media);
                    rej(err);
                }
                res({
                    width: metadata.streams[0].width,
                    height: metadata.streams[0].height,
                });
            });
        });
    } catch (err) {
        console.log(err)
    }

}

export async function videoScale(video: string, newWidth: number, newHeight: number, output: string) {
    //  const output = "scaledOutput.mp4";
    const { width, height } = await getDimentions(video);
    if ((width / height).toFixed(2) > (newWidth / newHeight).toFixed(2)) {
        // y=0 case
        // landscape to potrait case
        const x = width - (newWidth / newHeight) * height;
        console.log(`New Intrim Res: ${width - x}x${height}`);
        const cropping = "tempCropped-" + output;
        let cropped = await videoCropCenterFFmpeg(
            video,
            width - x,
            height,
            cropping
        );
        let resized = await resizingFFmpeg(cropped, newWidth, newHeight, output);
        // unlink temp cropping file
        // fs.unlink(cropping, (err) => {
        //   if (err) console.log(err);
        //   console.log(`Temp file ${cropping} deleted Successfuly...`);
        // });
        return resized;
    } else if ((width / height).toFixed(2) < (newWidth / newHeight).toFixed(2)) {
        // x=0 case
        // potrait to landscape case
        // calculate crop or resize with padding or blur sides
        // or just return with black bars on the side
        return await resizingFFmpeg(video, newWidth, newHeight, output, true);
    } else {
        console.log("Same Aspect Ratio forward for resizing");
        return await resizingFFmpeg(video, newWidth, newHeight, output);
    }
}

export async function videoThumbnail(path: string, thumbWidth: number, thumbHeight: number, output: string, outputName: string) {
    try {
        const { width, height } = await getDimentions(path);
        let size = `${thumbWidth}x${thumbHeight}}`;
        let ff = FFmpeg().input(path)
        // if ((width / height).toFixed(2) > (thumbWidth / thumbHeight).toFixed(2)) {
        //     // y=0 case
        //     // landscape to potrait case
        //     const x = width - (thumbWidth / thumbHeight) * height;
        //     size = `${width - x}x${height}}`;

        // } else if ((width / height).toFixed(2) < (thumbWidth / thumbHeight).toFixed(2)) {
        //     size = `${thumbWidth}x${thumbHeight}}`;
        //     ff = ff.autoPad(true, '#000000')
        // } else {
        //     console.log("Same Aspect Ratio forward for resizing");
        //     size = `${thumbWidth}x${thumbHeight}}`;
        // }
        ff.screenshots({
            timemarks: ['00:00:01.000'],
            filename: outputName,
            folder: output,
            count: 1,
            size: size,
        });
    } catch (err) {
        console.log(err)
    }


}
