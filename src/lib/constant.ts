enum EUserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

enum EBannerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

enum EResourceStatus {
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
}

enum ECategoryType {
  POST = 'post',
  VIDEO = 'video',
}

enum EFlagUploadVideo {
  HOMEPAGE = 'homepage',
  RESOURCE = 'resource',
}

enum EEducationLevelStatus {
  ANY_LEVEL = 'any_level',
  HIGH_SCHOOL_OR_EQUIVALENT = 'high_school_or_equivalent',
  ASSOCIATE_DEGREE = 'associate_degree',
  BACHELOR_DEGREE = 'bachelor_degree',
  MASTER_DEGREE = 'master_degree',
  DOCTORATE_DEGREE = 'doctorate_degree',
  NONE = 'none',
}

enum ECareerStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

enum EDocumentFlag {
  ABOUT_US = 'about_us',
  RESOURCE = 'resource',
  IMPORT = 'import',
  EXPORT = 'export',
}

enum EFilterValue {
  BY_DATE = 'by_date',
  BY_VIEW = 'by_view',
}

export {
  EBannerStatus,
  EResourceStatus,
  EEducationLevelStatus,
  ECareerStatus,
  EFlagUploadVideo,
  EDocumentFlag,
  ECategoryType,
  EFilterValue,
  EUserStatus,
};
