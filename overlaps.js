const arr = [
    { start: '10:30', end: '12:40' },
    { start: '08:00', end: '10:15' },
    { start: '09:15', end: '13:10' },
    { start: '10:15', end: '11:00' },
    { start: '07:30', end: '09:00' },
    { start: '12:10', end: '15:00' },
    { start: '12:00', end: '15:00' },
];

const overlapping = (a, b) => {
    const getMinutes = s => {
        const p = s.split(':').map(Number);
        return p[0] * 60 + p[1];
    };
    return getMinutes(a.end) > getMinutes(b.start) && getMinutes(b.end) > getMinutes(a.start);
};

let timeOverlaps = [];

(isOverlapping = () => {
    let time = { start: "10:00", end: "12:00" };
    for (const element of arr) {
        if (overlapping(time, element)) {
            timeOverlaps.push(element);
        }
    }
})();


console.log("check", timeOverlaps)


// console.log(isOverlapping(arr));