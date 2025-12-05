export default function successResponse(res, status, message, response) {
    return res.status(status).json({
        success: true,
        message,
        data: response
    })
}