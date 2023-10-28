from flask import Flask, request, jsonify
from minio import Minio
from minio.error import S3Error
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

minio_client = Minio(
    "127.0.0.1:9000",
    access_key="abhiveer",
    secret_key="abhiveer",
    secure=False
)

bucket_name = "bala"

if not minio_client.bucket_exists(bucket_name):
    minio_client.make_bucket(bucket_name)

@app.route("/upload", methods=["POST"])
def upload_photo():
    try:
        if "photo" not in request.files:
            return jsonify({"error": "No file part"})

        photo = request.files["photo"]
        minio_client.put_object(bucket_name, photo.filename, photo, len(photo.read()))

        return jsonify({"message": "Photo uploaded successfully"})
    except S3Error as e:
        return jsonify({"error": f"Error uploading photo: {str(e)}"})

@app.route("/photos", methods=["GET"])
def get_photos():
    try:
        photos = [obj.object_name for obj in minio_client.list_objects(bucket_name)]
        return jsonify({"photos": photos})
    except S3Error as e:
        return jsonify({"error": f"Error retrieving photos: {str(e)}"})

if __name__ == "__main__":
    app.run()
