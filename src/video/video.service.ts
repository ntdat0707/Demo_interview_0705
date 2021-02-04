import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { VideoEntity } from '../entities/video.entity';
import { EFlagUploadVideo, EResourceStatus } from '../lib/constant';
import { UpdateVideoInput, UploadVideoInput } from './video.dto';
import fs = require('fs');

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  constructor(
    @InjectRepository(VideoEntity) private videoRepository: Repository<VideoEntity>,
    private connection: Connection,
  ) {}

  async uploadVideo(video: any, uploadVideoInput: UploadVideoInput) {
    this.logger.debug('upload video');
    const existVideo = await this.videoRepository.findOne({
      where: { title: uploadVideoInput.title, flag: uploadVideoInput.flag },
    });
    if (existVideo) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'TITLE_EXIST',
        },
        HttpStatus.CONFLICT,
      );
    }
    if (uploadVideoInput.status === EResourceStatus.PUBLISH && uploadVideoInput.flag === EFlagUploadVideo.HOMEPAGE) {
      const checkPublishVideo = await this.videoRepository.findOne({
        where: { status: EResourceStatus.PUBLISH, flag: EFlagUploadVideo.HOMEPAGE },
      });
      if (checkPublishVideo) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'CAN_NOT_PUBLISH_VIDEO',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    let newVideo = new VideoEntity();
    newVideo.setAttributes(uploadVideoInput);
    newVideo.flag = uploadVideoInput.flag;
    if (video) {
      newVideo.video = video.filename;
    }
    await this.connection.queryResultCache.clear();
    newVideo = await this.videoRepository.save(newVideo);
    return {
      data: newVideo,
    };
  }

  async getAllVideo(flag: string, page = 1, limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10)) {
    this.logger.debug('get all video');
    const queryExc = this.videoRepository
      .createQueryBuilder('video')
      .where({ flag: flag })
      .orderBy('created_at', 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);
    const countResult = await queryExc.cache(`videos_count_page${page}_limit${limit}`).getCount();
    const result = await queryExc.cache(`videos__page${page}_limit${limit}`).getMany();
    const pages = Math.ceil(Number(countResult) / limit);
    return {
      page: Number(page),
      totalPages: pages,
      limit: Number(limit),
      totalRecords: countResult,
      data: result,
    };
  }

  async getVideo(id: string) {
    this.logger.debug('get video');
    const video = await this.videoRepository.findOne({ where: { id: id } });
    if (!video) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'VIDEO_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      data: video,
    };
  }

  async updateVideo(id: string, video: any, updateVideoInput: UpdateVideoInput) {
    this.logger.debug('update video');
    const checkVideo = await this.videoRepository.findOne({ where: { id: id } });
    if (!checkVideo) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'VIDEO_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (updateVideoInput.title !== checkVideo.title) {
      const existVideo = await this.videoRepository.findOne({
        where: { title: updateVideoInput.title, flag: checkVideo.flag },
      });
      if (existVideo) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'TITLE_EXIST',
          },
          HttpStatus.CONFLICT,
        );
      }
    }
    if (
      checkVideo.flag === EFlagUploadVideo.HOMEPAGE &&
      updateVideoInput.status !== checkVideo.status &&
      updateVideoInput.status === EResourceStatus.PUBLISH
    ) {
      const checkPublishVideo = await this.videoRepository.findOne({
        where: { status: EResourceStatus.PUBLISH, flag: EFlagUploadVideo.HOMEPAGE },
      });
      if (checkPublishVideo) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'CAN_NOT_PUBLISH_VIDEO',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    let pathFile = '';
    if (checkVideo.video) {
      pathFile = process.env.UPLOAD_VIDEO_PATH + '/' + checkVideo.video;
    }
    checkVideo.setAttributes(updateVideoInput);
    if (video) {
      checkVideo.video = video.filename;
    }
    await this.connection.queryResultCache.clear();
    await this.videoRepository.save(checkVideo);
    if (pathFile !== '') {
      fs.unlinkSync(pathFile);
    }
    return {};
  }

  async deleteVideo(id: string) {
    this.logger.debug('delete video');
    const checkVideo = await this.videoRepository.findOne({ where: { id: id } });
    if (!checkVideo) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'VIDEO_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.connection.queryResultCache.clear();
    await this.videoRepository.softDelete(checkVideo);
    return {};
  }
}
