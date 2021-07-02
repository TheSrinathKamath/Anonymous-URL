var DateDiff = {

    inSeconds: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / 1000);
    },


    inMinutes: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / 60000);
    },

    inHours: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / 3600000);
    },

    inDays: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000));
    },

    inWeeks: function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
    },

    inMonths: function (d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
    },

    inYears: function (d1, d2) {
        return d2.getFullYear() - d1.getFullYear();
    }
}

module.exports = DateDiff;
/* For testing DateDiff */
const testFunction = () => {
    var dString = "2021-07-02 11:38:02"; //will also get (Y-m-d H:i:s)

    var d1 = new Date(dString);
    var d2 = new Date();

    var timeLaps = DateDiff.inSeconds(d1, d2);
    var dateOutput = "";


    if (timeLaps < 60) {
        dateOutput = timeLaps + " seconds";
    }
    else {
        timeLaps = DateDiff.inMinutes(d1, d2);
        if (timeLaps < 60) {
            dateOutput = timeLaps + " minutes";
        }
        else {
            timeLaps = DateDiff.inHours(d1, d2);
            if (timeLaps < 24) {
                dateOutput = timeLaps + " hours";
            }
            else {
                timeLaps = DateDiff.inDays(d1, d2);
                if (timeLaps < 7) {
                    dateOutput = timeLaps + " days";
                }
                else {
                    timeLaps = DateDiff.inWeeks(d1, d2);
                    if (timeLaps < 4) {
                        dateOutput = timeLaps + " weeks";
                    }
                    else {
                        timeLaps = DateDiff.inMonths(d1, d2);
                        if (timeLaps < 12) {
                            dateOutput = timeLaps + " months";
                        }
                        else {
                            timeLaps = DateDiff.inYears(d1, d2);
                            dateOutput = timeLaps + " years";
                        }
                    }
                }
            }
        }
    }
}
