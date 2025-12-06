export default function errorHandler(err, req, res, next) {
    console.error(err);

    const data = {
        success: false,
        message: err.message,
    }

    if (err.errors != null) {
        response.errors = err.errors;
    }

    return res.status(err.statusCode || 500).json(data);
}