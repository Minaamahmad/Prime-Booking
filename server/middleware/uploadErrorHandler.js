// Error handling middleware for Cloudinary uploads
export const handleUploadError = (error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'File size too large. Maximum size is 10MB',
      error: 'LIMIT_FILE_SIZE'
    });
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      message: 'Too many files uploaded. Maximum is 10 files',
      error: 'LIMIT_FILE_COUNT'
    });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      message: 'Unexpected file field',
      error: 'LIMIT_UNEXPECTED_FILE'
    });
  }

  if (error.message && error.message.includes('Cloudinary')) {
    return res.status(500).json({
      message: 'Image upload service error. Please try again.',
      error: 'CLOUDINARY_ERROR'
    });
  }

  if (error.message && error.message.includes('Only image files are allowed')) {
    return res.status(400).json({
      message: 'Only image files are allowed (JPG, PNG, GIF, WebP)',
      error: 'INVALID_FILE_TYPE'
    });
  }

  // Pass other errors to the general error handler
  next(error);
};

// Validation middleware for image uploads
export const validateImageUpload = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      message: 'No files uploaded',
      error: 'NO_FILES'
    });
  }

  // Validate file count
  if (req.files.length > 10) {
    return res.status(400).json({
      message: 'Maximum 10 files allowed per upload',
      error: 'TOO_MANY_FILES'
    });
  }

  // Validate each file
  for (const file of req.files) {
    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        message: `File ${file.originalname} is too large. Maximum size is 10MB`,
        error: 'FILE_TOO_LARGE'
      });
    }

    // Check file type (extra validation)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        message: `File ${file.originalname} is not a valid image type`,
        error: 'INVALID_FILE_TYPE'
      });
    }
  }

  next();
};
