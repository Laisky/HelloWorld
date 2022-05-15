import os
from typing import Generator

from kipp.options import options as opt
from kipp.utils import setup_logger
import logging
import boto3
import botocore
from botocore.exceptions import ClientError


logger = setup_logger("s3_uploader")


def main():
    parse_args()

    s3_client = connect_s3()
    for fpath in list_all_files(opt.dir):
        s3_fname = get_s3_fname(opt.dir, fpath)
        if not is_file_exists(s3_client, fpath,opt.bucket, s3_fname):
            upload_file(s3_client, fpath, opt.bucket, s3_fname)


def is_file_exists(s3_client, fpath, bucket, object_name) -> bool:
    try:
        fsize = os.stat(fpath).st_size
        response = s3_client.head_object(Bucket=bucket, Key=object_name)

        resp_code = response['ResponseMetadata']['HTTPStatusCode']
        assert response['ResponseMetadata']['HTTPStatusCode'] == 200, f"status code is {response['ResponseMetadata']['HTTPStatusCode']}"
        assert response['ContentLength'] == fsize, "file size mismatch"
        return True
    except ClientError as e:
        if e.response['Error']['Code'] == "404":
            return False

        logger.exception(f"head file {fpath=}")

def get_s3_fname(root, file_name):
    return file_name[len(root) :].lstrip("/")


def connect_s3():
    b3_session = boto3.Session(
        aws_access_key_id="1", aws_secret_access_key="1", region_name="home"
    )
    return b3_session.client("s3", endpoint_url=opt.server)


def parse_args():
    opt.set_option("dir", "/var/www/s3/www/uploads")

    # opt.add_argument("--dir", required=True)
    opt.add_argument("--bucket", default="uploads")
    opt.add_argument("--server", default="http://100.97.108.34:8333")
    opt.parse_args()


def list_all_files(dir) -> Generator:
    for root, dirs, files in os.walk(dir):
        for file in files:
            yield os.path.join(root, file)


def upload_file(
    s3_client, file_name: str, bucket: str, object_name=None
):
    """Upload a file to an S3 bucket"""

    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
        logger.info(f"uploaded {bucket}/{object_name}")
    except ClientError as e:
        logger.exception(f"upload file {file_name}")
        raise e




if __name__ == "__main__":
    main()
