import asyncHandler from "../middleware/asyncHandler.js"
import Bootcamp from "../models/BootCamps.js"
import geocoder from '../geocoder.js'
const createAllBootcamps = asyncHandler(async (req, res) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    return res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.name) {
      // Duplicate key error
      return res.status(400).json({
        success: false,
        error: 'Duplicate key error',
        message: `Bootcamp with name '${req.body.name}' already exists.`,
      });
    } else {
      // Other errors
      return res.status(500).json({
        success: false,
        error: 'Server Error',
        message: 'Internal server error occurred.',
      });
    }
  }
});
const getAllBootcamps = asyncHandler(async (req, res) => {
  // Initial query
  let query

  // Copy req.query
  const reqQuery = { ...req.query }

  // Fields to exclude from query
  const removeFields = ['select', 'sort', 'page', 'limit']

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  // Create query string
  let queryStr = JSON.stringify(reqQuery)

  // Create operators ($gt, $gte, etc.)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  // Finding resource
  query = Bootcamp.find(JSON.parse(queryStr))

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query = query.select(fields)
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  } else {
    query = query.sort('-createdAt') // default sorting by createdAt in descending order
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 100
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(limit)

  // Executing query
  const bootcamps = await query

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  })
})

const getSingleBootcamp = asyncHandler(async (req, res) => {
 
   const bootcamp = await Bootcamp.findById(req.params.id)
   if(bootcamp){
return res.json(bootcamp)
   }
   res.status(404)
   throw new Error('Bootcamp not found')
  
})
const deleteSingleBootcamp =asyncHandler( async (req, res) => {
   const bootcamp = await Bootcamp.findById(req.params.id)
   if (bootcamp) {
     await Bootcamp.deleteOne({ _id: bootcamp._id })
     res.status(200).json({ message: 'Bootcamp deleted' })
   } else {
     res.status(404)
     throw new Error('Bootcamp not found')
   }
})
const updateBootcamp = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    website,
    phone,
    email,
    address,
    careers,
    housing,
    jobAssistance,
    jobGuarantee,
    acceptGi,
  } = req.body

  const bootcamp = await Bootcamp.findById(req.params.id)

  if (bootcamp) {
    bootcamp.name = name
    bootcamp.description = description
    bootcamp.website = website
    bootcamp.phone = phone
    bootcamp.email = email
    bootcamp.address = address
    bootcamp.careers = careers
    bootcamp.housing = housing
    bootcamp.jobAssistance = jobAssistance
    bootcamp.jobGuarantee = jobGuarantee
    bootcamp.acceptGi = acceptGi
 const updatedBootcamp = await bootcamp.save()
    res.json(updatedBootcamp)
  } else {
    res.status(404)
    throw new Error('Bootcamp not found')
  }
})
const getBootcampsInRadius = asyncHandler(async (req, res) => {
  const { zipcode, distance } = req.params

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  // Earth radius in miles (you can change this to km if needed)
  const radius = distance / 3963

  // Find bootcamps within the specified radius
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  })

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  })
})
export {
  getAllBootcamps,
  createAllBootcamps,
  deleteSingleBootcamp,
  getSingleBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
}