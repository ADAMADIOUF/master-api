import asyncHandler from '../middleware/asyncHandler.js'

import Bootcamp from '../models/BootCamps.js'
import Course from '../models/Course.js'
// @desc      Get all courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
const getCourses = asyncHandler(async (req, res) => {
  let query

  if (req.params.id) {
    query = Course.find({ bootcamp: req.params.id })
  } else {
    query = Course.find() //.populate({
    //   path: 'bootcamp',
    //   select: 'name description',
    // })
  }

  const courses = await query
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  })
})

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  })

  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found',
    })
  }

  res.status(200).json({
    success: true,
    data: course,
  })
})

// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
const addCourse = asyncHandler(async (req, res) => {
  req.body.bootcamp = req.params.bootcampId

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return res.status(404).json({
      success: false,
      error: 'Bootcamp not found',
    })
  }

  const course = await Course.create(req.body)

  res.status(201).json({
    success: true,
    data: course,
  })
})

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
const updateCourse = asyncHandler(async (req, res) => {
  let course = await Course.findById(req.params.id)

  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found',
    })
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: course,
  })
})

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)

  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found',
    })
  }

  await course.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

export { getCourses, getCourse, addCourse, updateCourse, deleteCourse }
