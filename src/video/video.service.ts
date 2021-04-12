import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, In, Not, Repository } from 'typeorm';
import { VideoEntity } from '../entities/video.entity';
import { ECategoryType, EFilterValue, EFlagUploadVideo, EResourceStatus } from '../lib/constant';
import { UpdateVideoInput, UploadVideoInput } from './video.dto';
import { isDuplicateLanguageValid, isLanguageENValid } from '../lib/pipeUtils/languageValidate';
import { LanguageEntity } from '../entities/language.entity';
import { CategoryEntity } from '../entities/category.entity';
import { VideoCateEntity } from '../entities/videoCate.entity';
import { v4 as uuidv4 } from 'uuid';
import { convertTv } from '../lib/utils';
@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  constructor(
    @InjectRepository(VideoEntity) private videoRepository: Repository<VideoEntity>,
    @InjectRepository(LanguageEntity) private languageRepository: Repository<LanguageEntity>,
    @InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>,
    private connection: Connection,
  ) {}
  async uploadVideoFile(video: any) {
    this.logger.debug('upload video file');
    if (!video) {
      throw new BadRequestException('VIDEO_REQUIRED');
    }
    return {
      data: video.filename,
    };
  }

  async uploadVideos(uploadVideoInput: [UploadVideoInput]) {
    this.logger.debug('upload video');
    await Promise.all([
      isLanguageENValid(uploadVideoInput, this.languageRepository),
      isDuplicateLanguageValid(uploadVideoInput, this.languageRepository),
    ]);
    let randomCode = '';
    while (true) {
      randomCode = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
      const existCode = await this.videoRepository.findOne({ where: { code: randomCode } });
      if (!existCode) {
        break;
      }
    }
    await this.connection.queryResultCache.clear();

    const newVideos = [];
    const newVideoCates = [];
    for (const item of uploadVideoInput) {
      const existVideo = await this.videoRepository.findOne({
        where: { title: item.title, flag: item.flag },
      });
      if (existVideo) {
        throw new ConflictException('TITLE_EXISTED');
      }
      //check category
      if (item.categoryId && item.flag === EFlagUploadVideo.RESOURCE) {
        const category = await this.categoryRepository.findOne({
          where: { id: item.categoryId, type: ECategoryType.VIDEO },
        });
        if (!category) {
          throw new NotFoundException(`CATEGORY_${item.categoryId}_NOT_FOUND`);
        }
      }
      if (item.status === EResourceStatus.PUBLISH && item.flag === EFlagUploadVideo.HOMEPAGE) {
        const checkPublishVideo = await this.videoRepository.find({
          where: { status: EResourceStatus.PUBLISH, flag: EFlagUploadVideo.HOMEPAGE },
        });
        if (checkPublishVideo.length > 0) {
          for (let i = 0; i < checkPublishVideo.length; i++) {
            await this.videoRepository.update({ id: checkPublishVideo[i].id }, { status: EResourceStatus.UNPUBLISH });
          }
        }
      }
      const newVideo = new VideoEntity();
      newVideo.setAttributes(item);
      newVideo.id = uuidv4();
      newVideo.code = randomCode;
      newVideo.flag = item.flag;
      if (item.flag === EFlagUploadVideo.RESOURCE && item.categoryId) {
        const newVideoCate = new VideoCateEntity();
        newVideoCate.categoryId = item.categoryId;
        newVideoCate.videoId = newVideo.id;
        newVideoCates.push(newVideoCate);
      }
      newVideos.push(newVideo);
    }
    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save<VideoEntity[]>(newVideos);
      await transactionalEntityManager.save<VideoCateEntity[]>(newVideoCates);
    });
    return {};
  }

  async getAllVideo(
    flag: string,
    page = 1,
    limit: number = parseInt(process.env.DEFAULT_MAX_ITEMS_PER_PAGE, 10),
    languageId: string,
    status?: string,
    searchValue?: string,
    filterValue?: string,
    categoryId?: string,
  ) {
    this.logger.debug('get all video');
    const queryExc = this.videoRepository
      .createQueryBuilder('video')
      .where({ flag: flag, languageId: languageId })
      .limit(limit)
      .offset((page - 1) * limit);

    if (status) {
      queryExc.andWhere('status = :status', { status });
    }
    if (searchValue) {
      searchValue = convertTv(searchValue.replace(/  +/g, '').trim());
      queryExc.andWhere(`lower(video."title") like :value`, {
        value: `%${searchValue}%`,
      });
    }
    if (categoryId && flag === EFlagUploadVideo.RESOURCE) {
      const category = await this.categoryRepository.findOne({ where: { id: categoryId, type: ECategoryType.VIDEO } });
      if (!category) {
        throw new NotFoundException(`CATEGORY_${categoryId}_NOT_FOUND`);
      }
      queryExc
        .leftJoinAndMapMany(
          'video.categories',
          VideoCateEntity,
          'video_category',
          '"video_category"."video_id"="video".id and video_category.deleted_at is null',
        )
        .leftJoinAndMapOne(
          'video_category.categoryInformation',
          CategoryEntity,
          'category',
          '"category".id = "video_category"."category_id"',
          { categoryId, type: ECategoryType.VIDEO },
        )
        .andWhere('"category".id=:categoryId and "category"."type"=:type', { categoryId, type: ECategoryType.VIDEO });
    }
    if (filterValue && filterValue === EFilterValue.BY_VIEW) {
      queryExc.orderBy('views', 'DESC');
    } else {
      queryExc.orderBy('"video"."created_at"', 'DESC');
    }
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

  async getVideo(code: string, languageId?: string) {
    this.logger.debug('get video');
    let video: any = [];
    if (!languageId) {
      video = await this.videoRepository.find({ where: { code: code } });
      if (video.length === 0) {
        throw new NotFoundException(`VIDEO_${code}_NOT_FOUND`);
      }
    } else {
      video = await this.videoRepository.find({ where: { code: code, languageId: languageId } });
      if (video.length === 0) {
        throw new NotFoundException(`VIDEO_LANGUAGE_${languageId}_NOT_FOUND`);
      }
      video[0].views++;
      await this.videoRepository.save(video[0]);
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
          const checkVideo = await this.videoRepository.findOne({ where: { id: updateVideoInput.id, code: code } });
          if (!checkVideo) {
            throw new NotFoundException(`VIDEO_${updateVideoInput.id}_NOT_FOUND`);
          }
          if (checkVideo.title !== updateVideoInput.title) {
            const existTitle = await this.videoRepository.findOne({
              where: { title: updateVideoInput.title, languageId: updateVideoInput.languageId },
            });
            if (existTitle) {
              throw new ConflictException('TITLE_EXISTED');
            }
          }
          if (
            checkVideo.flag === EFlagUploadVideo.HOMEPAGE &&
            updateVideoInput.status !== checkVideo.status &&
            updateVideoInput.status === EResourceStatus.PUBLISH
          ) {
            const checkPublishVideo = await this.videoRepository.find({
              where: {
                status: EResourceStatus.PUBLISH,
                flag: EFlagUploadVideo.HOMEPAGE,
                code: Not(code),
              },
            });
            if (checkPublishVideo.length > 0) {
              for (let i = 0; i < checkPublishVideo.length; i++) {
                await transactionalEntityManager.update(
                  VideoEntity,
                  { id: checkPublishVideo[i].id },
                  { status: EResourceStatus.UNPUBLISH },
                );
              }
            }
          }
          checkVideo.setAttributes(updateVideoInput);
          await transactionalEntityManager.update<VideoEntity>(VideoEntity, { id: checkVideo.id }, checkVideo);
        } else {
          const existTitle = await this.videoRepository.findOne({
            where: { title: updateVideoInput.title, languageId: updateVideoInput.languageId },
          });
          if (existTitle) {
            throw new ConflictException('TITLE_EXISTED');
          }
          if (
            updateVideoInput.status === EResourceStatus.PUBLISH &&
            updateVideoInput.flag === EFlagUploadVideo.HOMEPAGE
          ) {
            const checkPublishVideo = await this.videoRepository.find({
              where: {
                status: EResourceStatus.PUBLISH,
                flag: EFlagUploadVideo.HOMEPAGE,
                code: Not(code),
              },
            });
            if (checkPublishVideo.length > 0) {
              for (let i = 0; i < checkPublishVideo.length; i++) {
                await transactionalEntityManager.update(
                  VideoEntity,
                  { id: checkPublishVideo[i].id },
                  { status: EResourceStatus.UNPUBLISH },
                );
              }
            }
          }
          const newVideo: any = new VideoEntity();
          newVideo.setAttributes(updateVideoInput);
          newVideo.code = code;
          await transactionalEntityManager.save<VideoEntity>(newVideo);
        }
      }
    });
    return {};
  }

  async deleteVideo(code: string, categoryId?: string) {
    this.logger.debug('delete video');
    await this.connection.queryResultCache.clear();

    const checkVideo: any = await this.videoRepository.find({ where: { code: code } });
    if (checkVideo.length === 0) {
      throw new NotFoundException(`VIDEO_${code}_NOT_FOUND`);
    }
    const videoIds = checkVideo.map((item: any) => item.id);
    await getManager().transaction(async transactionalEntityManager => {
      if (categoryId) {
        const category: any = await this.categoryRepository.findOne({
          where: { id: categoryId, type: ECategoryType.VIDEO },
        });
        if (!category) {
          throw new NotFoundException(`CATEGORY_${categoryId}_NOT_FOUND`);
        }
        await transactionalEntityManager.softDelete<VideoCateEntity[]>(VideoEntity, { videoId: In(videoIds) });
      }
      await transactionalEntityManager.softDelete<VideoEntity[]>(VideoEntity, { id: In(videoIds) });
    });
    return {};
  }
}
