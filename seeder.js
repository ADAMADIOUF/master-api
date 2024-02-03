import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import slugify from 'slugify'
import Bootcamp from './models/BootCamps.js'
import connectDB from './config/db.js'
import bootcampsData from './data/bootcamps.js'
import course from './data/course.js'
import geocoder from './geocoder.js'
import Course from './models/Course.js'

dotenv.config()
connectDB()

const importData = async () => {
  try {
    // Delete existing data
    await Bootcamp.deleteMany()
    await Course.deleteMany()

    
    // Geocode and insert new data
    const bootcamps = await Promise.all(
      bootcampsData.map(async (bootcamp) => {
        const loc = await geocoder.geocode(bootcamp.address)

        const newBootcamp = {
          ...bootcamp,
          location: {
            type: 'Point',
            coordinates: [loc[0].longitude, loc[0].latitude],
            formattedAddress: loc[0].formattedAddress,
            street: loc[0].streetName,
            city: loc[0].city,
            state: loc[0].stateCode,
            zipcode: loc[0].zipcode,
            country: loc[0].countryCode,
          },
        }

        // Generate the slug using the slugify function
        newBootcamp.slug = slugify(newBootcamp.name, { lower: true })

        return newBootcamp
      })
    )

    await Bootcamp.insertMany(bootcamps)
    console.log(`Bootcamp data imported!`.green.inverse)

    // Call process.exit() after all asynchronous operations are completed
    const sampleProducts = course.map((product) => ({ ...product }))

    await Course.insertMany(sampleProducts)

    console.log(`Course data imported!`.green.inverse)

    process.exit()
  } catch (error) {
    console.log(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    // Delete all data
    await Course.deleteMany()
    await Bootcamp.deleteMany()
    console.log(`Data Destroyed!`.red.inverse)

    // Call process.exit() after all asynchronous operations are completed
    process.exit()
  } catch (error) {
    console.log(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
