const { parse } = require('csv-parse');
const fs = require('fs');

const results = [];
 
/* boolean isHabitablePlanet(planet_object)
*   Return true or false based on data that if a planet is hospitable or not
*/
function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

/*We will pipe our Read Stream with parse from our csv-parse package to
* convert out read bytestream to a more user understandable and writable 
* data values
* 
* Comment tells parser, what the comment character is in our data file
* Columns: returns each row in our file as a Java Script object
*/

fs.createReadStream('./kepler_data.csv').pipe(parse({
    comment: '#',
    columns: true
}))
    .on('data', (data) => {
        if (isHabitablePlanet(data)) {
            results.push(data);
        }
    })
    .on('end', () => {
        console.log(results.map((planet) => {
            return planet['kepler_name']
        }));
        console.log(`Total habitable planets found: ${results.length}`);
    })
    .on('error', (err) => {
        console.error("Encountered an Error!!!");
        console.log(err);
    });