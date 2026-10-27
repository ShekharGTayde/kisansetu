/**
 * Standard API response envelope helpers
 * Format: { success: boolean, data: any, error: { code, message, details? } | null }
 */

export const sendSuccess = (res, data, status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    error: null,
  })
}

export const sendError = (res, code, message, status = 400, details = undefined) => {
  const errorObj = {
    code,
    message,
  }

  if (details !== undefined && details !== null) {
    errorObj.details = details
  }

  return res.status(status).json({
    success: false,
    data: null,
    error: errorObj,
  })
}
