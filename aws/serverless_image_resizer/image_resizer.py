#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals

import logging
import os
from collections import namedtuple
from io import BytesIO

from requests.exceptions import HTTPError

import tinys3
from PIL import Image


OUTPUT_IMAGE_FORMAT = namedtuple('output_format', ['suffix', 'format'])(
    suffix='.jpeg', format='JPEG'
)
S3_KEY = namedtuple('s3_key', ['access_key', 'secret_key'])(
    access_key=os.environ['S3_ACCESS_KEY'],
    secret_key=os.environ['S3_SECRET_KEY'],
)
S3_BUCKET = 'movoto-data'
S3_URL_PREFIX = 'http://movoto-data.s3-website-us-west-1.amazonaws.com/'


logger = logging.getLogger('image-resizer')
logger.setLevel(logging.INFO)


def conn2s3():
    logger.info('connect to s3...')
    return tinys3.Connection(S3_KEY.access_key, S3_KEY.secret_key,
                             tls=True, default_bucket=S3_BUCKET)


def load_image(s3_conn, key):
    logger.info('download image {} from s3...'.format(key))
    try:
        r = s3_conn.get(key)
    except HTTPError:
        return
    else:
        return Image.open(BytesIO(r.content))


def resize_image(im, size):
    logger.info('resize image to {}...'.format(size))
    return im.resize(size)


def upload_image(s3_conn, key, im):
    logger.info('update image {} to s3...'.format(key))
    im_bytes = BytesIO()
    im.save(im_bytes, format=OUTPUT_IMAGE_FORMAT.format)
    fname = '{}{}'.format(key, OUTPUT_IMAGE_FORMAT.suffix)
    s3_conn.upload(fname, im_bytes)
    return fname


def get_s3_url(fname):
    return '{}{}'.format(S3_URL_PREFIX, fname)


def msg_file_not_found(key):
    return {
        'statusCode': 404,
        "headers": {
            'Content-Type': 'text/plain',
        },
        "body": 'Can not found {}'.format(key)
    }


def msg_bad_request():
    return {
        'statusCode': 400,
        "headers": {
            'Content-Type': 'text/plain',
        },
        "body": 'bad request'
    }


def msg_file_success(s3_url):
    logger.info('redirect to {}'.format(s3_url))
    return {
        'statusCode': 302,
        "headers": {
            'Content-Type': 'text/plain',
            'Location': s3_url,
        },
        "body": 'Converted ok, redirect...'
    }


# ERROR: AWS not support return bytes
def file_success_in_bytes(im):
    im_bytes = BytesIO()
    im.save(im_bytes, OUTPUT_IMAGE_FORMAT.format)
    return {
        'statusCode': 200,
        "headers": {
            'Content-Type': 'image/jpeg'
        },
        "body": im_bytes.read()
    }


def generate_content_type(fext):
    return 'image/{}'.format(fext.lower()[1:])


def lambda_handler(event, context):
    logger.info('start task for {}'.format(event['pathParameters']))
    """
    Args:
        event (dict):
        ::
            {'body': None, 'resource': '/resize/{image_with_size}',
             'requestContext': {'resourceId': 'k7kobn', 'apiId': '4m9h0w3fmc',
                                'resourcePath': '/resize/{image_with_size}', 'httpMethod': 'GET',
                                'requestId': 'test-invoke-request', 'accountId': '825579158472',
                                'identity': {'apiKey': 'test-invoke-api-key', 'userArn': 'arn:aws:iam::825579158472:root', 'cognitoAuthenticationType': None, 'accessKey': 'ASIAJCAJ6DWPLHRLK4NQ', 'caller': '825579158472', 'userAgent': 'Apache-HttpClient/4.5.x (Java/1.8.0_102)', 'user': '825579158472', 'cognitoIdentityPoolId': None, 'cognitoIdentityId': None, 'cognitoAuthenticationProvider': None, 'sourceIp': 'test-invoke-source-ip', 'accountId': '825579158472'},
                                'stage': 'test-invoke-stage'}, 'queryStringParameters': None, 'httpMethod': 'GET',
             'pathParameters': {'image_with_size': 'demo_111x222.jpeg'}, 'headers': None,
             'stageVariables': None, 'path': '/resize/demo_111x222', 'isBase64Encoded': False}
    """
    try:
        im_info, im_ext = os.path.splitext(
            event['pathParameters']['image_with_size'])
        im_name, im_size = im_info.rsplit('_')
        im_width, im_height = map(int, im_size.split('x'))

        assert 0 < im_width <= 1000
        assert 0 < im_height <= 1000
    except Exception:
        return msg_bad_request()

    key = '{}{}'.format(im_name, im_ext)
    new_key = '{im_name}_{im_width}x{im_height}'.format(
        im_name=im_name, im_width=im_width, im_height=im_height)

    s3_conn = conn2s3()
    im = load_image(s3_conn, key)
    if not im:
        return msg_file_not_found(key)

    im = resize_image(im, (im_width, im_height))
    fname = upload_image(s3_conn, new_key, im)
    s3_url = get_s3_url(fname)
    return msg_file_success(s3_url)
