const fs = require('fs')

const getNewId = (array) => {
    if (array.length > 0) {
        return array[array.length - 1].id + 1
    } else {
        return 1
    }
}

const newDate = () => new Date().toISOString()

// does the search on the passed array for a specific id
function mustBeInArray(array, id) {
    return new Promise((resolve, reject) => {
        const row = array.find(a => a.id == id)
        if (!row) {
            reject({
                message: 'ID was not found',
                status: 404
            })
        }
        resolve(row)
    })
}

// does the search on the passed array for a specific author_id
function mustBeInAuthors(array, id) {
    return new Promise((resolve, reject) => {
        var retList = [];
        array.forEach(function (item) {
            if(item.author_id == id)
            {
                retList.push(item);
            }
        });
        if (!retList.length) {
            reject({
                message: 'Author was not found',
                status: 404
            })
        }
        resolve(retList)
    })
}

// does the search on the passed array for a specific title
function mustBeInTitle(array, title) {
    return new Promise((resolve, reject) => {
        var retList = [];
        array.forEach(function (item) {
            if(item.title === title)
            {
                retList.push(item);
            }
            else if(title === "")
            {
                if(item.title === null)
                {
                    retList.push(item);
                }
            }
        });
        if (!retList.length) {
            reject({
                message: 'Title was not found',
                status: 404
            })
        }
        resolve(retList)
    })
}

// does the search on the passed array for elements between 2 dates
function mustBeBetweenTwoDates(array, startDate, endDate) {
    return new Promise((resolve, reject) => {
        var retList = [];
        var fromTime = new Date(startDate).getTime();
        var toTime = new Date(endDate).getTime();
        var date;
        array.forEach(function (item) {
              date = new Date(item.dates.created);
            
              if (date.getTime() >= fromTime && date.getTime() <= toTime) {
                retList.push(item);
              }
        });
        if (!retList.length) {
            reject({
                message: 'No articles between those dates',
                status: 404
            })
        }
        resolve(retList)
    })
}

function writeJSONFile(filename, content) {
    fs.writeFileSync(filename, JSON.stringify(content), 'utf8', (err) => {
        if (err) {
            console.log(err)
        }
    })
}

module.exports = {
    getNewId,
    newDate,
    mustBeInArray,
    mustBeInAuthors,
    mustBeInTitle,
    mustBeBetweenTwoDates,
    writeJSONFile,
}