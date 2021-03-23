import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository } from 'typeorm';
import { VideoEntity } from '../entities/video.entity';
import { EFlagUploadVideo, EResourceStatus } from '../lib/constant';
import { UpdateVideoInput, UploadVideoInput } from './video.dto';
import { isDuplicateLanguageValid, isLanguageENValid } from '../lib/pipeUtils/languageValidate';
import { LanguageEntity } from '../entities/language.entity';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  constructor(
    @InjectRepository(VideoEntity) private videoRepository: Repository<VideoEntity>,
    @InjectRepository(LanguageEntity) private languageRepository: Repository<LanguageEntity>,
    private connection: Connection,
  ) {}
  async uploadVideoFile(video: any) {
    this.logger.debug('upload video file');
    if (!video) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'VIDEO_REQUIRED',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      data: video.filename,
    };
  }

  async uploadVideos(uploadVideoInput: [UploadVideoInput]) {
    this.logger.debug('upload video');
    await isLanguageENValid(uploadVideoInput, this.languageRepository);
    await isDuplicateLanguageValid(uploadVideoInput, this.languageRepository);
    let randomCode = '';
    while (true) {
      randomCode = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
      const existAgentCode = await this.videoRepository.findOne({ where: { code: randomCode } });
      if (!existAgentCode) {
        break;
      }
    }
    await this.connection.queryResultCache.clear();
    await getManager().transaction(async transactionalEntityManager => {
      const newVideos = [];
      for (const item of uploadVideoInput) {
        const existVideo = await this.videoRepository.findOne({
          where: { title: item.title, flag: item.flag },
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
        if (item.status === EResourceStatus.PUBLISH && item.flag === EFlagUploadVideo.HOMEPAGE) {
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

        const newVideo: any = new VideoEntity();
        newVideo.setAttributes(item);
        newVideo.code = randomCode;
        newVideos.push(newVideo);
      }
      await transactionalEntityManager.save<VideoEntity[]>(newVideos);
    });
    return {};
  }

  async getAllVideo(
    flag: string,
    page = 1,
    limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10),
    languageId: string,
  ) {
    this.logger.debug('get all video');
    const queryExc = this.videoRepository
      .createQueryBuilder('video')
      .where({ flag: flag, languageId: languageId })
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

  async getVideo(code: string, languageId: string) {
    this.logger.debug('get video');
    const video = await this.videoRepository.findOne({ where: { code: code, languageId: languageId } });
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

  async updateVideo(code: string, updatesVideoInput: [UpdateVideoInput]) {
    this.logger.debug('update video');
    await isDuplicateLanguageValid(updatesVideoInput, this.languageRepository);
    await this.connection.queryResultCache.clear();
    await getManager().transaction(async transactionalEntityManager => {
      for (const updateVideoInput of updatesVideoInput) {
        if (updateVideoInput.id) {
          const checkVideo = await this.videoRepository.findOne({ where: { code: code } });
          if (!checkVideo) {
            throw new HttpException(
              {
                statusCode: HttpStatus.NOT_FOUND,
                message: 'VIDEO_NOT_FOUND',
              },
              HttpStatus.NOT_FOUND,
            );
          }
          if (checkVideo.title !== updateVideoInput.title) {
            const existTitle = await this.videoRepository.findOne({
              where: { title: updateVideoInput.title, languageId: updateVideoInput.languageId },
            });
            if (existTitle) {
              throw new HttpException(
                {
                  statusCode: HttpStatus.CONFLICT,
                  message: `TITLE_HAS_BEEN_EXISTED `,
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
          checkVideo.setAttributes(updateVideoInput);
          await transactionalEntityManager.update<VideoEntity>(VideoEntity, { id: checkVideo.id }, checkVideo);
        } else {
          const existTitle = await this.videoRepository.findOne({
            where: { title: updateVideoInput.title, languageId: updateVideoInput.languageId },
          });
          if (existTitle) {
            throw new HttpException(
              {
                statusCode: HttpStatus.CONFLICT,
                message: `TITLE_HAS_BEEN_EXISTED `,
              },
              HttpStatus.CONFLICT,
            );
          }
          if (
            updateVideoInput.status === EResourceStatus.PUBLISH &&
            updateVideoInput.flag === EFlagUploadVideo.HOMEPAGE
          ) {
            const checkPublishVideo = await this.videoRepository.findOne({
              where: { code: updateVideoInput.code, status: EResourceStatus.PUBLISH, flag: EFlagUploadVideo.HOMEPAGE },
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
          const newVideo: any = new VideoEntity();
          newVideo.setAttributes(updateVideoInput);
          newVideo.code = updateVideoInput.code;
          await transactionalEntityManager.save<VideoEntity>(newVideo);
        }
      }
    });
    return {};
  }

  async deleteVideo(code: string) {
    this.logger.debug('delete video');
    const checkVideo: any = await this.videoRepository.find({ where: { code: code } });
    if (checkVideo.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'VIDEOS_NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.connection.queryResultCache.clear();
    await this.videoRepository.softDelete(checkVideo);
    return {};
  }
}
