enum EBannerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

enum EResourceStatus {
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
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

enum EDocmentFlag {
  ABOUT_US = 'about_us',
  RESOURCE = 'resource',
  IMPORT = 'import',
  EXPORT = 'export',
}

export { EBannerStatus, EResourceStatus, EEducationLevelStatus, ECareerStatus, EFlagUploadVideo, EDocmentFlag };
